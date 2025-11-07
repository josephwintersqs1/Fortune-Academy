<script>
/* ======================= Data ======================= */
const catalogData = {
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
};

/* ============== Helpers (customize hrefs here) ============== */
function slugify(str){ return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

/* Build your course URLs here */
function courseUrl(categoryKey, state){
  // Example pattern: /real-estate/<category>/<state>/
  // Map keys to readable segments
  const seg = {licensed:'get-licensed', exam:'exam-prep', post:'post-licensing', ce:'continuing-education', upgrade:'upgrade-license'}[categoryKey];
  return `#/${seg}/${slugify(state)}`; // replace '#' with your real path base
}

/* ======================= Rendering ======================= */
function renderPanel(key, panelEl){
  const data = catalogData[key];
  panelEl.innerHTML = `
    <div class="top-states" aria-label="Top states">
      ${data.top.map(s => `<a class="state-pill" href="${courseUrl(key,s)}"><i class="fas fa-location-dot" aria-hidden="true"></i><span>${s}</span></a>`).join('')}
    </div>

    <div class="state-search" role="search">
      <input type="text" class="state-filter" placeholder="Search states…" aria-label="Search states">
      <button type="button" class="clear-btn" title="Clear">Clear</button>
    </div>

    <div class="collapse-wrap collapsed">
      <div class="state-grid">
        ${data.other.map(s => `<a class="state-chip" href="${courseUrl(key,s)}" data-state="${s}">${s}</a>`).join('')}
      </div>
      <div class="collapse-mask"></div>
      <button type="button" class="collapse-toggle" aria-expanded="false">Show all states</button>
    </div>
  `;

  // Wire up filtering
  const input = panelEl.querySelector('.state-filter');
  const chips = [...panelEl.querySelectorAll('.state-chip')];
  const clearBtn = panelEl.querySelector('.clear-btn');

  function applyFilter(){
    const q = input.value.trim().toLowerCase();
    let any = false;
    chips.forEach(chip=>{
      const show = chip.dataset.state.toLowerCase().includes(q);
      chip.hidden = !show;
      if(show) any = true;
    });
    // if user is searching, force expanded view
    const wrap = panelEl.querySelector('.collapse-wrap');
    if(q){
      wrap.classList.remove('collapsed');
      const toggle = wrap.querySelector('.collapse-toggle');
      toggle.setAttribute('aria-expanded','true');
      toggle.textContent = 'Hide states';
    }
  }
  input.addEventListener('input', applyFilter);
  clearBtn.addEventListener('click', ()=>{
    input.value='';
    chips.forEach(c=>c.hidden=false);
    const wrap = panelEl.querySelector('.collapse-wrap');
    wrap.classList.add('collapsed');
    const toggle = wrap.querySelector('.collapse-toggle');
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent = 'Show all states';
    input.focus();
  });

  // Expand / collapse
  const toggle = panelEl.querySelector('.collapse-toggle');
  const wrap = panelEl.querySelector('.collapse-wrap');
  toggle.addEventListener('click', ()=>{
    const isCollapsed = wrap.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded', String(!isCollapsed));
    toggle.textContent = isCollapsed ? 'Show all states' : 'Hide states';
  });
}

function initCatalog(){
  // Render all panels
  renderPanel('licensed', document.getElementById('panel-licensed'));
  renderPanel('exam',     document.getElementById('panel-exam'));
  renderPanel('post',     document.getElementById('panel-post'));
  renderPanel('ce',       document.getElementById('panel-ce'));
  renderPanel('upgrade',  document.getElementById('panel-upgrade'));

  // Tabs wiring
  const tabs = [...document.querySelectorAll('.catalog-tab')];
  const panels = {
    licensed: document.getElementById('panel-licensed'),
    exam:     document.getElementById('panel-exam'),
    post:     document.getElementById('panel-post'),
    ce:       document.getElementById('panel-ce'),
    upgrade:  document.getElementById('panel-upgrade')
  };

  tabs.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabs.forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      Object.values(panels).forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      panels[btn.dataset.tab].classList.add('active');
    });
  });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initCatalog)
  : initCatalog();
</script>