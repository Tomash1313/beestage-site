/**
 * B-Stage Bookkeeping — Tax intake form receiver (VERTICAL layout, same rows as the Google Form sheet)
 * Bound to the spreadsheet "Податкове повернення".
 *
 * Tab "Website Intake": column A = field names (exact order of the Google Form),
 * every submission = a NEW COLUMN to the right. Row 1 = header (client's name), rows 2+ = the 79 items.
 * Uploaded files go to a private Drive folder; their links are written to the "Додатки" row.
 *
 * One-time setup: run setupSheet() once from the editor (builds column A; clears the tab).
 * Deploy: Deploy > Manage deployments > edit > New version.
 */
const SHEET_NAME = 'Website Intake';
const ROOT_FOLDER_NAME = 'B-Stage Website Intake Uploads';
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 10;
const MAX_FIELD_LEN = 2000;      // anything longer is cut (comments can be long, nothing else needs this)
const ALLOWED = /\.(pdf|jpe?g|png|heic|heif|webp|docx?|xlsx?|csv|txt)$/i;

/** Ordered rows: [key sent by the website, label shown in column A]. Duplicated labels are expected (client + dependants). */
function rows_() {
  const R = [
    ['ts', 'Позначка часу'], ['lang', 'Preferred language'],
    ['lastName', 'Прізвище'], ['firstName', "Ім'я"], ['sin', 'SIN-номер'], ['dob', 'Дата народження'], ['email', 'E-mail'],
    ['unit', 'Номер квартири'], ['streetNumber', 'Номер будинку'], ['streetName', 'Назва вулиці'], ['city', 'Місто'],
    ['province', 'Провінція'], ['postal', 'Поштовий індекс'], ['phone', 'Номер телефону'],
    ['resident', 'Резиденство'], ['entry', 'Дата прибуття'], ['prov31', 'Назва провінції'], ['moving', 'Дата переїзду'],
    ['homeSame', 'Домашня адреса'], ['provNow', 'Провінція проживання'],
    ['marital', 'Сімейний стан'], ['statusChanged', 'Зміни стану'], ['statusDate', 'Дата зміни'], ['statusBefore', 'Статус до'],
    ['hasDeps', 'У вас є утриманці?']
  ];
  for (let i = 1; i <= 5; i++) {
    R.push(['d' + i + '_lastName', 'Прізвище'], ['d' + i + '_firstName', "Ім'я"], ['d' + i + '_relationship', 'Відношення до вас'],
      ['d' + i + '_dob', 'Дата народження'], ['d' + i + '_sin', 'SIN-номер'], ['d' + i + '_netIncome', 'Дохід'],
      ['d' + i + '_health', "Стан здоров'я"], ['d' + i + '_coRes', 'Спільне проживання']);
    if (i < 5) R.push(['d' + i + '_add', 'Додати']);
  }
  R.push(['firstTime', 'Декларація'], ['citizen', 'Громадянство'], ['indian', 'Закон про Індіанців'], ['foreignProp', 'Власність'],
    ['disposedRes', 'Помешкання'], ['flip', 'Нерухомість'], ['fhsa', 'Ощадний рахунок'], ['prison', "Ув'язнення"],
    ['comments', 'Коментарі'], ['files', 'Додатки']);
  return R;
}

/** Run once: builds column A (clears the "Website Intake" tab). Row 1 = header, rows 2+ = items. */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  const R = rows_();
  sheet.getRange(1, 1).setValue('Field');
  sheet.getRange(2, 1, R.length, 1).setValues(R.map(function (r) { return [r[1]]; }));
  sheet.getRange(1, 1, R.length + 1, 1).setFontWeight('bold');
  sheet.getRange(1, 1).setBackground('#A76D45').setFontColor('#ffffff');
  sheet.setColumnWidth(1, 220);
  sheet.setFrozenColumns(1);
  sheet.setFrozenRows(1);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const body = JSON.parse(e.postData.contents);

    const cache = CacheService.getScriptCache();
    if (body.submissionId && cache.get('sub_' + body.submissionId)) return out_({ result: 'success', duplicate: true });

    const f = {};
    Object.keys(body.fields || {}).forEach(function (k) { f[k] = String(body.fields[k] == null ? '' : body.fields[k]).slice(0, MAX_FIELD_LEN); });
    const files = (body.files || []).filter(function (x) { return x && ALLOWED.test(x.name || '') && x.data; }).slice(0, MAX_FILES);   // only allowed types
    // basic server-side sanity (the page already checks this; it stops junk posted straight to the URL)
    if (!f.lastName || !f.firstName || !/^\d{9}$/.test(f.sin || '') || String(f.email || '').indexOf('@') < 1 || !files.length) throw new Error('Invalid submission');
    const now = new Date();
    const tz = Session.getScriptTimeZone();

    // 1) Save files to Drive
    const links = [];
    let total = 0;
    if (files.length) {
      const folder = subFolder_(f, now, tz);
      files.forEach(function (file) {
        if (!ALLOWED.test(file.name || '')) return;
        const bytes = Utilities.base64Decode(file.data);
        total += bytes.length;
        if (total > MAX_TOTAL_BYTES) throw new Error('Files too large');
        const safeName = String(file.name).replace(/[^\w.\- ()]/g, '_').slice(0, 120);
        links.push(folder.createFile(Utilities.newBlob(bytes, file.type || 'application/octet-stream', safeName)).getUrl());
      });
    }

    // 2) Write ONE NEW COLUMN, aligned with column A by position
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getRange(1, 1).getValue() !== 'Field') throw new Error('Run setupSheet() once first');
    const rec = Object.assign({}, f, { ts: Utilities.formatDate(now, tz, 'dd.MM.yyyy HH:mm:ss'), files: links.join('\n') });
    const R = rows_();
    const name = [f.lastName, f.firstName].filter(String).join(' ') || 'Client';
    const values = [[name]].concat(R.map(function (r) { return [rec[r[0]] == null ? '' : String(rec[r[0]])]; }));
    const col = sheet.getLastColumn() + 1;
    if (col > sheet.getMaxColumns()) sheet.insertColumnsAfter(sheet.getMaxColumns(), 26);   // a new tab has only 26 columns
    if (values.length > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), values.length - sheet.getMaxRows());
    const range = sheet.getRange(1, col, values.length, 1);
    range.setNumberFormat('@');                 // keep text as typed: SIN, +1 phone, postal code, dates
    range.setValues(values);
    range.setVerticalAlignment('top');
    sheet.getRange(1, col).setFontWeight('bold').setBackground('#f3e6dc');
    sheet.setColumnWidth(col, 190);

    if (body.submissionId) cache.put('sub_' + body.submissionId, '1', 21600);
    return out_({ result: 'success' });
  } catch (err) {
    return out_({ result: 'error', message: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() { return out_({ result: 'ok', service: 'B-Stage tax intake' }); }

function subFolder_(f, now, tz) {
  const it = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  const root = it.hasNext() ? it.next() : DriveApp.createFolder(ROOT_FOLDER_NAME);
  const clean = function (s) { return String(s || '').replace(/[^\w\-]/g, '').slice(0, 30); };
  const name = [clean(f.lastName), clean(f.firstName), Utilities.formatDate(now, tz, 'yyyyMMdd-HHmmss')].filter(String).join('_');
  return root.createFolder(name);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
