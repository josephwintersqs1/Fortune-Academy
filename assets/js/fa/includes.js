/* assets/js/fa/includes.js */
(function () {
  function hideLoader() {
    var el = document.getElementById('siteLoader');
    if (!el) return;
    el.style.transition = el.style.transition || 'opacity .35s ease';
    el.style.opacity = '0';
    setTimeout(function () { el.style.display = 'none'; }, 400);
  }

  function fetchText(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) {
        var e = new Error('HTTP ' + r.status + ' for ' + url);
        e.status = r.status; throw e;
      }
      return r.text();
    });
  }

  function resolveUrl(raw) {
    var root = document.body.getAttribute('data-include-root') || '';
    if (raw.startsWith('/')) return raw;          // absolute already
    if (root) {
      // ensure single slash between root and raw
      return (root.endsWith('/') ? root.slice(0, -1) : root) + '/' + raw.replace(/^\/+/, '');
    }
    return raw; // relative to current page directory
  }

  function inject(el) {
    var raw = el.getAttribute('data-include');
    if (!raw) return Promise.resolve();

    var url = resolveUrl(raw);
    return fetchText(url)
      .catch(function (err) {
        // If first try fails and wasn’t absolute, try absolute from origin as a fallback
        if (!raw.startsWith('/')) {
          var abs = '/' + raw.replace(/^\/+/, '');
          console.warn('[includes] retrying as absolute:', abs, '(first failed:', err.message, ')');
          return fetchText(abs).then(function (html) { return html; });
        }
        throw err;
      })
      .then(function (html) {
        el.innerHTML = html;
      })
      .catch(function (err) {
        console.error('[includes] failed to load', raw, '->', err.message);
        // Insert a harmless comment so it’s obvious in the DOM something failed
        el.innerHTML = '<!-- include failed: ' + raw + ' -->';
      });
  }

  function injectAll() {
    var incEls = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    return Promise.all(incEls.map(inject));
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) return resolve();
      var s = document.createElement('script');
      s.src = src; s.defer = true;
      s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectAll().then(function () {
      document.dispatchEvent(new CustomEvent('fa:partials:loaded'));
      // Load theme init after partials are in DOM
      loadScript('assets/js/custom.min.js')
        .catch(function (e) { console.warn('custom.min.js failed to load', e); })
        .then(function () {
          if (document.readyState === 'complete') hideLoader();
          else window.addEventListener('load', hideLoader, { once: true });
          // Hard fallback
          setTimeout(hideLoader, 3500);
        });
    });
  });
})();