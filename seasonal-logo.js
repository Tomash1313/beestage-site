/* B-Stage seasonal logo: swaps the header/footer logo 7 days before a holiday until 5 days after. */
(function () {
  var P = '/logos/';
  var BDAY = [6, 1]; // B-Stage birthday: [month, day] — change here if needed
  function d(y, m, n) { return Date.UTC(y, m - 1, n) / 864e5; }
  function nth(y, m, wd, n) { var f = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); return d(y, m, 1 + ((wd - f + 7) % 7) + 7 * (n - 1)); }
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, dd = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451), t = h + l - 7 * m + 114;
    return d(y, Math.floor(t / 31), (t % 31) + 1);
  }
  function victoria(y) { var t = d(y, 5, 25), wd = new Date(t * 864e5).getUTCDay(); return t - (((wd + 6) % 7) || 7); }
  function events(y) {
    var bf = nth(y, 11, 4, 4) + 1, cm = bf + 3;
    function e(n, day, a, b) { return { n: n, d: day, a: day - (a === undefined ? 7 : a), b: day + (b === undefined ? 5 : b) }; }
    var bfE = e('black-friday', bf); bfE.b = cm - 1;
    var cmE = e('cyber-monday', cm); cmE.a = cm; cmE.b = cm + 2;
    return [
      e('new-years-day', d(y, 1, 1)), e('easter', easter(y)), e('victoria-day', victoria(y)),
      e('birthday', d(y, BDAY[0], BDAY[1])), e('canada-day', d(y, 7, 1)), e('labour-day', nth(y, 9, 1, 1)),
      e('ndtr', d(y, 9, 30)), e('thanksgiving', nth(y, 10, 1, 2)), e('halloween', d(y, 10, 31)),
      e('remembrance-day', d(y, 11, 11)), bfE, cmE, e('christmas-day', d(y, 12, 25)), e('boxing-day', d(y, 12, 26))
    ];
  }
  var NAMES = 'new-years-day easter victoria-day birthday canada-day labour-day ndtr thanksgiving halloween remembrance-day black-friday cyber-monday christmas-day boxing-day'.split(' ');
  var now = new Date(), today = d(now.getFullYear(), now.getMonth() + 1, now.getDate()), pick = null, best = 1e9;
  try {
    var q = (location.search.match(/[?&]logo=([a-z-]+)/) || [])[1];
    if (q && NAMES.indexOf(q) > -1) pick = q;
  } catch (x) {}
  if (!pick) {
    for (var y = now.getFullYear() - 1; y <= now.getFullYear() + 1; y++) {
      var list = events(y);
      for (var i = 0; i < list.length; i++) {
        var v = list[i];
        if (today >= v.a && today <= v.b) {
          var dist = Math.abs(today - v.d);
          if (dist < best || (dist === best && pick && v.d > 0)) { best = dist; pick = v.n; }
        }
      }
    }
  }
  if (!pick) return;
  var imgs = document.querySelectorAll('.logo img[src="/logo.webp"]');
  for (var j = 0; j < imgs.length; j++) imgs[j].src = P + pick + '.webp';
})();
