/* Page loader: glowing ring + 3 dots (neon green/blue).
   - shows only if a page is still loading after 350ms (fast loads never flash it)
   - shows when the visitor clicks an internal link (opening another page)
   - never stays longer than 4s (safety)          API: pageLoader.show() / pageLoader.hide() */
(function () {
  var d = document, h = d.documentElement;
  var css = '#pageLoader{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;' +
    'background:radial-gradient(circle at 50% 45%,#14161d,#0A0C13 70%);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s}' +
    '#pageLoader.on{opacity:1;visibility:visible}' +
    '.pl-ring{width:64px;height:64px;border-radius:50%;border:4px solid rgba(255,255,255,.08);border-top-color:#39FFA0;border-right-color:#3D8BFF;' +
    'box-shadow:0 0 22px rgba(57,255,160,.45),inset 0 0 14px rgba(61,139,255,.2);animation:plspin .9s linear infinite}' +
    '.pl-dots{display:flex;gap:10px}.pl-dots i{width:9px;height:9px;border-radius:50%;background:#39FFA0;box-shadow:0 0 10px rgba(57,255,160,.8);animation:pldot 1s ease-in-out infinite}' +
    '.pl-dots i:nth-child(2){background:#29D8EA;animation-delay:.15s}.pl-dots i:nth-child(3){background:#3D8BFF;animation-delay:.3s}' +
    '@keyframes plspin{to{transform:rotate(360deg)}}@keyframes pldot{0%,100%{transform:translateY(0);opacity:.45}50%{transform:translateY(-8px);opacity:1}}' +
    '@media(prefers-reduced-motion:reduce){.pl-ring,.pl-dots i{animation-duration:2.4s}}';
  var st = d.createElement('style'); st.textContent = css; (d.head || h).appendChild(st);

  var el = d.createElement('div');
  el.id = 'pageLoader'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="pl-ring"></div><div class="pl-dots"><i></i><i></i><i></i></div>';

  var wait, failsafe;
  function show() {
    if (!el.parentNode) h.appendChild(el);
    void el.offsetWidth; el.classList.add('on');
    clearTimeout(failsafe); failsafe = setTimeout(hide, 4000);
  }
  function hide() { clearTimeout(wait); clearTimeout(failsafe); el.classList.remove('on'); }

  wait = setTimeout(show, 350);
  d.addEventListener('DOMContentLoaded', hide);
  addEventListener('load', hide);
  addEventListener('pageshow', hide);

  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || a.target === '_blank' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) return;   // same page / anchor
    setTimeout(show, 120);
  });
  window.pageLoader = { show: show, hide: hide };
})();
