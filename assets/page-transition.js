/* PAGE CURTAIN TRANSITION
   Intercepts internal <a href="*.html"> clicks, slides an orange panel across,
   then navigates. On the next page the curtain slides off to the right.
   Skipped: external links, anchors (#...), mailto/tel/wa.me, target=_blank,
   data-auth-open, downloads, modifier-clicked links, and middle-clicks.
*/
(function () {
  if (window.__btcCurtainInit) return;
  window.__btcCurtainInit = true;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  function ensureCurtain() {
    var c = document.getElementById('page-curtain');
    if (c) return c;
    c = document.createElement('div');
    c.id = 'page-curtain';
    c.className = 'page-curtain';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML =
      '<div class="page-curtain-inner">' +
        '<span class="page-curtain-mark">B</span>' +
        '<span class="page-curtain-line"></span>' +
        '<span class="page-curtain-wordmark">B THE CHANGE WELFARE SOCIETY</span>' +
      '</div>';
    document.body.appendChild(c);
    return c;
  }

  function init() {
    var curtain = ensureCurtain();

    /* On load: if previous page set the in-transit flag, slide curtain off */
    var inTransit = false;
    try { inTransit = sessionStorage.getItem('btc-curtain') === '1'; } catch (e) {}
    if (inTransit) {
      try { sessionStorage.removeItem('btc-curtain'); } catch (e) {}
      curtain.style.transform = 'translateX(0)';
      requestAnimationFrame(function () {
        curtain.classList.add('is-leaving');
        setTimeout(function () {
          curtain.classList.remove('is-leaving');
          curtain.style.transform = '';
        }, 480);
      });
    }

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      if (a.hasAttribute('data-auth-open')) return;
      if (href.charAt(0) === '#') return;
      if (/^(mailto:|tel:|javascript:|sms:)/i.test(href)) return;
      /* External http(s) — skip */
      if (/^https?:\/\//i.test(href)) {
        try {
          var u = new URL(href, window.location.href);
          if (u.origin !== window.location.origin) return;
          /* Same-origin absolute URL is OK */
        } catch (err) { return; }
      }
      /* WhatsApp/wa.me intercepts already filter via http/https check */

      e.preventDefault();
      try { sessionStorage.setItem('btc-curtain', '1'); } catch (err) {}
      curtain.classList.add('is-entering');
      setTimeout(function () { window.location.href = href; }, 380);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
