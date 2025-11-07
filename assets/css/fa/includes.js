<!-- Create this file at assets/js/fa/includes.js -->
<script>
// Simple HTML partial loader + theme init
(function(){
  function inject(el){
    const url = el.getAttribute('data-include');
    if(!url) return Promise.resolve();
    return fetch(url, {cache: 'no-cache'})
      .then(r => { if(!r.ok) throw new Error(url+' '+r.status); return r.text(); })
      .then(html => { el.innerHTML = html; })
      .catch(err => { console.error('Include failed:', url, err); });
  }

  function loadThemeJs(){
    // Load custom.min.js after includes are in place so it can wire up nav/search/mobile
    var s = document.createElement('script');
    s.src = 'assets/js/custom.min.js';
    s.defer = true;
    document.body.appendChild(s);
  }

  // Wait for DOM, then include header/footer, then init theme
  document.addEventListener('DOMContentLoaded', function(){
    const incEls = [].slice.call(document.querySelectorAll('[data-include]'));
    Promise.all(incEls.map(inject)).then(function(){
      document.dispatchEvent(new CustomEvent('fa:partials:loaded'));
      loadThemeJs();
    });
  });
})();
</script>