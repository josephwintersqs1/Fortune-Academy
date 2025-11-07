(function() {
  'use strict';

  var STATE_DATA = window.FA_STATE_DATA || { featured: [], all: [] };
  var FEATURED = STATE_DATA.featured || [];
  var ALL = STATE_DATA.all || [];

  document.addEventListener('DOMContentLoaded', function() {
    var picker = document.querySelector('[data-hero-state]');
    if (!picker) return;

    var input = picker.querySelector('.hero-state-input');
    var menu = picker.querySelector('.hero-state-menu');
    var searchInput = picker.querySelector('.hero-state-search input');
    var optionsContainer = picker.querySelector('.hero-state-options');
    
    if (!input || !menu || !searchInput || !optionsContainer) return;

    // Build menu
    function buildMenu() {
      optionsContainer.innerHTML = '';
      
      // Featured states
      if (FEATURED.length > 0) {
        var featuredTitle = document.createElement('div');
        featuredTitle.className = 'hero-state-group-title';
        featuredTitle.textContent = 'FEATURED';
        optionsContainer.appendChild(featuredTitle);
        
        FEATURED.forEach(function(state) {
          var opt = document.createElement('div');
          opt.className = 'hero-state-option hero-state-featured';
          opt.textContent = state;
          opt.setAttribute('data-value', state);
          optionsContainer.appendChild(opt);
        });
      }
      
      // All other states
      var remaining = ALL.filter(function(s) { return FEATURED.indexOf(s) === -1; });
      if (remaining.length > 0) {
        var allTitle = document.createElement('div');
        allTitle.className = 'hero-state-group-title';
        allTitle.textContent = 'ALL STATES';
        optionsContainer.appendChild(allTitle);
        
        remaining.forEach(function(state) {
          var opt = document.createElement('div');
          opt.className = 'hero-state-option';
          opt.textContent = state;
          opt.setAttribute('data-value', state);
          optionsContainer.appendChild(opt);
        });
      }
    }

    buildMenu();

    // Set initial value
    var initialState = FEATURED[0] || ALL[0] || '';
    input.value = initialState;

    // Open menu
    function openMenu() {
      menu.removeAttribute('hidden');
      picker.classList.add('is-open');
      searchInput.value = '';
      filterOptions('');
      searchInput.focus();
    }

    // Close menu
    function closeMenu() {
      menu.setAttribute('hidden', 'hidden');
      picker.classList.remove('is-open');
    }

    // Filter options
    function filterOptions(query) {
      var term = (query || '').toLowerCase();
      optionsContainer.querySelectorAll('.hero-state-option').forEach(function(opt) {
        var val = opt.getAttribute('data-value').toLowerCase();
        opt.hidden = term && !val.includes(term);
      });
    }

    // Click input to toggle
    input.addEventListener('click', function(e) {
      e.stopPropagation();
      if (menu.hasAttribute('hidden')) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    // Search
    searchInput.addEventListener('input', function() {
      filterOptions(this.value);
    });

    // Select option
    optionsContainer.addEventListener('click', function(e) {
      var opt = e.target.closest('.hero-state-option');
      if (!opt) return;
      var value = opt.getAttribute('data-value');
      input.value = value;
      closeMenu();
    });

    // Click outside to close
    document.addEventListener('click', function(e) {
      if (!picker.contains(e.target)) {
        closeMenu();
      }
    });

    // Escape to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !menu.hasAttribute('hidden')) {
        closeMenu();
        input.focus();
      }
    });
  });
})();

