/**
 * B-Stage Bookkeeping — Tax intake form receiver
 * Bound to the spreadsheet "Податкове повернення".
 * Writes each submission as a row in the "Website Intake" tab (matched by column header,
 * so reordering columns is safe) and saves uploaded files to a private Drive folder.
 *
 * DEPLOY: Deploy > New deployment > Web app
 *   Execute as: Me   |   Who has access: Anyone
 * Copy the /exec URL into INTAKE_ENDPOINT on the website page (tax-intake.html).
 * The first deploy asks for permission (Sheets + Drive) — approve it once.
 */
const SHEET_NAME = 'Website Intake';
const ROOT_FOLDER_NAME = 'B-Stage Website Intake Uploads';
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 10;
const ALLOWED = /\.(pdf|jpe?g|png|heic|heif|webp|docx?|xlsx?|csv|txt)$/i;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const body = JSON.parse(e.postData.contents);

    // Ignore accidental double submissions of the same form
    const cache = CacheService.getScriptCache();
    if (body.submissionId) {
      if (cache.get('sub_' + body.submissionId)) return out_({ result: 'success', duplicate: true });
    }

    const fields = body.fields || {};
    const files = (body.files || []).slice(0, MAX_FILES);
    const now = new Date();
    const stamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    // 1) Save files
    const links = [];
    let total = 0;
    if (files.length) {
      const folder = subFolder_(fields, now);
      files.forEach(function (f) {
        if (!ALLOWED.test(f.name || '')) return;
        const bytes = Utilities.base64Decode(f.data);
        total += bytes.length;
        if (total > MAX_TOTAL_BYTES) throw new Error('Files too large');
        const safeName = String(f.name).replace(/[^\w.\- ()]/g, '_').slice(0, 120);
        const blob = Utilities.newBlob(bytes, f.type || 'application/octet-stream', safeName);
        links.push(folder.createFile(blob).getUrl());
      });
    }

    // 2) Write row by header name
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Tab "' + SHEET_NAME + '" not found');
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
    const record = Object.assign({}, fields, { 'Timestamp': stamp, 'File Links': links.join('\n') });

    // Add any header the sheet does not have yet (e.g. "Preferred Language") at the end
    Object.keys(record).forEach(function (h) {
      if (headers.indexOf(h) === -1) {
        sheet.getRange(1, headers.length + 1).setValue(h);
        headers.push(h);
      }
    });

    const row = headers.map(function (h) { return record[h] == null ? '' : String(record[h]); });
    const target = sheet.getLastRow() + 1;
    const range = sheet.getRange(target, 1, 1, row.length);
    range.setNumberFormat('@');   // keep everything as text: SIN, +1 phone numbers, postal codes
    range.setValues([row]);

    if (body.submissionId) cache.put('sub_' + body.submissionId, '1', 21600);
    return out_({ result: 'success' });
  } catch (err) {
    return out_({ result: 'error', message: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return out_({ result: 'ok', service: 'B-Stage tax intake' });
}

function subFolder_(fields, now) {
  const it = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  const root = it.hasNext() ? it.next() : DriveApp.createFolder(ROOT_FOLDER_NAME);
  const clean = function (s) { return String(s || '').replace(/[^\w\-]/g, '').slice(0, 30); };
  const name = [clean(fields['Last Name']), clean(fields['First Name']),
    Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss')].filter(String).join('_');
  return root.createFolder(name);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
