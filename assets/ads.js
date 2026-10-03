/* =====================================================================
   2FA Authenticator — ad system (AdSense-ready)
   Mobile (<768px)        : top 320x100 · mid 300x250 · bottom 300x250
   Tablet/Desktop (>=768) : top 728x90  · mid 728x90  · bottom 728x90
   Wide desktop (>=1480)  : + left & right sidebars 160x600
   Placeholders are EMPTY until you fill CONFIG below.
   Preview the layout: open any page with  ?ads=debug  (e.g. /?ads=debug)
   ===================================================================== */
(function () {
  var CONFIG = {
    client: '',               // e.g. 'ca-pub-1234567890123456'  (leave '' to keep slots empty)
    slots: {                  // AdSense ad-unit IDs (numbers) — one per placement
      'top-m': '',  'top-d': '',
      'mid-m': '',  'mid-d': '',
      'bottom-m': '', 'bottom-d': '',
      'left-d': '', 'right-d': ''
    }
  };

  var q = new URLSearchParams(location.search);
  if (q.get('ads') === 'debug') document.documentElement.classList.add('ads-debug');

  var all = document.querySelectorAll('.ad[data-slot]');
  all.forEach(function (el) {            // reserve space (prevents layout jump when ads load)
    var s = (el.dataset.size || '').split('x');
    if (s[1]) el.style.minHeight = s[1] + 'px';
    if (s[0]) el.style.maxWidth = s[0] + 'px';
  });

  var libLoaded = false;
  function loadLib(cb) {
    if (libLoaded) return cb();
    var sc = document.createElement('script');
    sc.async = true; sc.crossOrigin = 'anonymous';
    sc.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(CONFIG.client);
    sc.onload = function () { libLoaded = true; cb(); };
    document.head.appendChild(sc);
  }

  // Fills only slots that are visible on this screen size (never loads ads into hidden boxes)
  function fill() {
    if (!CONFIG.client) return;
    var todo = [];
    all.forEach(function (el) {
      if (el.dataset.filled || !el.getClientRects().length) return;
      if (!CONFIG.slots[el.dataset.slot]) return;
      todo.push(el);
    });
    if (!todo.length) return;
    loadLib(function () {
      todo.forEach(function (el) {
        var s = el.dataset.size.split('x'), ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.cssText = 'display:inline-block;width:' + s[0] + 'px;height:' + s[1] + 'px';
        ins.setAttribute('data-ad-client', CONFIG.client);
        ins.setAttribute('data-ad-slot', CONFIG.slots[el.dataset.slot]);
        el.appendChild(ins); el.dataset.filled = '1';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    });
  }

  fill();
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fill, 300); });
})();
