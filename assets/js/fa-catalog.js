/*! Fortune Academy – Course Catalog (tabs + state picker + descriptions)
   ---------------------------------------------------------------------
   Usage in HTML (before closing </body>):

   <!-- Optional configuration (override defaults) -->
   <script>
     window.FACatalog = {
       base: '/real-estate', // base URL for links (no trailing slash)
       // segMap: { licensed:'get-licensed', exam:'exam-prep', post:'post-licensing', ce:'continuing-education', upgrade:'upgrade-license' },
       // courseUrl: (key, state, slugify) => `/real-estate/${key}/${slugify(state)}/`,
       // data: { ... },          // override state lists if needed
       // descriptions: { ... },  // override tab blurbs if needed
     };
   </script>
   <script src="assets/js/fa-catalog.js"></script>
*/

(function () {
  'use strict';

  // ---------------- Config & helpers ----------------
  const CFG = window.FACatalog || {};
  const BASE = typeof CFG.base === 'string' ? CFG.base.replace(/\/+$/,'') : '/real-estate';

  const segMap = Object.assign({
    licensed: 'get-licensed',
    exam:     'exam-prep',
    post:     'post-licensing',
    ce:       'continuing-education',
    upgrade:  'upgrade-license'
  }, CFG.segMap || {});

  const slugify = CFG.slugify || (str =>
    String(str).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
  );

  const defaultCourseUrl = (key, state) => `${BASE}/${segMap[key]}/${slugify(state)}/`;
  const courseUrl = typeof CFG.courseUrl === 'function' ? CFG.courseUrl : defaultCourseUrl;

  // ---------------- Data: categories → states ----------------
  const catalogData = Object.assign({
    licensed : {
      top: ["Georgia","North Carolina","South Carolina"],
      other: ["Alabama","Arizona","Arkansas","California","Connecticut","Delaware","Florida","Hawaii","Illinois","Iowa","Kansas","Kentucky","Louisiana","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nevada","New Hampshire","New Mexico","New York","North Dakota","Ohio","Oregon","Pennsylvania","Rhode Island","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin"]
    },
    exam : {
      top: ["Georgia","North Carolina","South Carolina"],
      other: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico"]
    },
    post : {
      top: ["Georgia"],
      other: ["Alabama","Arkansas","California","Delaware","Florida","Idaho","Illinois","Indiana","Kentucky","Louisiana","Maryland","Mississippi","Ohio","Oklahoma","Oregon","Pennsylvania","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington"]
    },
    ce : {
      top: ["Georgia","North Carolina","South Carolina"],
      other: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin"]
    },
    upgrade : {
      top: [],
      other: ["Alabama","California","Florida","Georgia","Hawaii","Illinois","Massachusetts","Michigan","Mississippi","New York","Oregon","Pennsylvania","South Carolina","Tennessee","Texas","Utah","Vermont","Virginia","Washington"]
    }
  }, CFG.data || {});

  // ---------------- Short blurbs under tabs ----------------
  const DESCRIPTIONS = Object.assign({
    licensed: 'Start your real estate career with state-approved pre-licensing that teaches the essentials and gets you exam-ready.',
    exam:     'Targeted practice, content refreshers, and instructor tips to help you pass your state exam on the first try.',
    post:     'State-specific post-licensing that builds real-world skills and keeps your new license in good standing.',
    ce:       'Flexible continuing-education courses to meet renewal requirements and stay current on laws, contracts, and ethics.',
    upgrade:  'Advance your credentials—move up to broker or add designations to expand your scope and earning potential.'
  }, CFG.descriptions || {});

  // ---------------- Rendering ----------------
  function renderPanel(key, panelEl){
    const data = catalogData[key];
    if (!data || !panelEl) return;

    const hasTop = Array.isArray(data.top) && data.top.length > 0;

    panelEl.innerHTML = `
      ${hasTop ? `
        <div class="panel-section">
          <h4 class="group-label"><strong>Top States</strong></h4>
          <div class="top-states" aria-label="Top states">
            ${data.top.map(s =>
              `<a class="state-pill" href="${courseUrl(key,s,slugify)}"><i class="fas fa-location-dot" aria-hidden="true"></i><span>${s}</span></a>`
            ).join('')}
          </div>
        </div>
      ` : ''}

      <div class="panel-section">
        <div class="state-search" role="search">
          <input type="text" class="state-filter" placeholder="Search all states…" aria-label="Search states">
          <button type="button" class="clear-btn" title="Clear">Clear</button>
        </div>

        <h4 class="group-label">All Other States</h4>
        <div class="collapse-wrap collapsed">
          <div class="state-grid">
            ${data.other.map(s =>
              `<a class="state-chip" href="${courseUrl(key,s,slugify)}" data-state="${s}">${s}</a>`
            ).join('')}
          </div>
          <div class="collapse-mask"></div>
          <button type="button" class="collapse-toggle" aria-expanded="false">
            <span class="txt">Show all states</span>
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;

    // Wire up filtering & toggling
    const input = panelEl.querySelector('.state-filter');
    const chips = Array.from(panelEl.querySelectorAll('.state-chip'));
    const clearBtn = panelEl.querySelector('.clear-btn');
    const wrap = panelEl.querySelector('.collapse-wrap');
    const toggle = panelEl.querySelector('.collapse-toggle');
    const toggleTxt = panelEl.querySelector('.collapse-toggle .txt');

    function applyFilter(){
      const q = input.value.trim().toLowerCase();
      chips.forEach(chip => chip.hidden = !chip.dataset.state.toLowerCase().includes(q));
      if(q){ // force expanded when searching
        wrap.classList.remove('collapsed');
        toggle.setAttribute('aria-expanded','true');
        toggleTxt.textContent = 'Hide states';
        toggle.classList.add('open');
      }
    }

    input.addEventListener('input', applyFilter);

    clearBtn.addEventListener('click', ()=>{
      input.value='';
      chips.forEach(c=>c.hidden=false);
      wrap.classList.add('collapsed');
      toggle.setAttribute('aria-expanded','false');
      toggleTxt.textContent = 'Show all states';
      toggle.classList.remove('open');
      input.focus();
    });

    toggle.addEventListener('click', ()=>{
      const isCollapsed = wrap.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', String(!isCollapsed));
      toggleTxt.textContent = isCollapsed ? 'Show all states' : 'Hide states';
      toggle.classList.toggle('open', !isCollapsed);
    });
  }

  function initCatalog(root){
    // Ensure tab buttons have IDs so panels' aria-labelledby can point to them
    root.querySelectorAll('.catalog-tab').forEach(btn=>{
      if(!btn.id && btn.dataset && btn.dataset.tab){
        btn.id = 'tab-' + btn.dataset.tab;
      }
    });

    // Render panels
    renderPanel('licensed', root.querySelector('#panel-licensed'));
    renderPanel('exam',     root.querySelector('#panel-exam'));
    renderPanel('post',     root.querySelector('#panel-post'));
    renderPanel('ce',       root.querySelector('#panel-ce'));
    renderPanel('upgrade',  root.querySelector('#panel-upgrade'));

    // Tabs wiring
    const tabs = Array.from(root.querySelectorAll('.catalog-tab'));
    const panels = {
      licensed: root.querySelector('#panel-licensed'),
      exam:     root.querySelector('#panel-exam'),
      post:     root.querySelector('#panel-post'),
      ce:       root.querySelector('#panel-ce'),
      upgrade:  root.querySelector('#panel-upgrade')
    };

    const descEl = root.querySelector('#catalog-desc');
    const setDesc = key => { if (descEl) descEl.textContent = DESCRIPTIONS[key] || ''; };

    // Initial description (assumes "licensed" is active by default in HTML)
    setDesc('licensed');

    tabs.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const k = btn.dataset.tab;
        // toggle tab styles
        tabs.forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected','true');
        // toggle panels
        Object.values(panels).forEach(p=>p && p.classList.remove('active'));
        panels[k] && panels[k].classList.add('active');
        // update blurb
        setDesc(k);
        // update hash (optional, for deep links)
        if (history && history.replaceState) history.replaceState(null, '', '#' + k);
      });
    });

    // Deep-link via hash like #ce or #exam
    const hash = (location.hash || '').replace('#','');
    if (hash && panels[hash]) {
      const btn = tabs.find(t => t.dataset.tab === hash);
      if (btn) btn.click();
    }
  }

  function ready(fn){
    (document.readyState === 'loading')
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn();
  }

  ready(function(){
    const root = document.querySelector('.destination-section.fa-catalog, .fa-catalog');
    if (!root) return;
    initCatalog(root);
  });

})();