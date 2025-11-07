/**
 * Hero Form - Standalone JavaScript
 * Pure vanilla JS for state picker with featured states
 * Zero dependencies on jQuery or old form code
 */

(function() {
  'use strict';

  // Get state data from global
  var STATE_DATA = window.FA_STATE_DATA || { featured: [], all: [], defaultState: '' };
  var FEATURED_STATES = STATE_DATA.featured || ['Georgia', 'North Carolina', 'South Carolina'];
  var ALL_STATES = STATE_DATA.all || [];

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var form = document.querySelector('[data-fa-hero-form]');
    if (!form) return;

    var picker = form.querySelector('[data-fa-state-picker]');
    if (!picker) return;

    var input = picker.querySelector('.fa-state-input');
    var dropdown = picker.querySelector('.fa-state-dropdown');
    var searchInput = picker.querySelector('.fa-state-search input');
    var listContainer = picker.querySelector('.fa-state-list');

    if (!input || !dropdown || !searchInput || !listContainer) return;

    // Build the dropdown content
    buildStateList(listContainer);

    // Set initial value
    var initialState = STATE_DATA.defaultState || FEATURED_STATES[0] || ALL_STATES[0] || '';
    if (initialState) {
      input.value = initialState;
    }

    // Toggle dropdown on input click
    input.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleDropdown();
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
      filterStates(this.value);
    });

    // Select state on option click
    listContainer.addEventListener('click', function(e) {
      var option = e.target.closest('.fa-state-option');
      if (!option) return;

      var stateName = option.getAttribute('data-state');
      if (stateName) {
        input.value = stateName;
        closeDropdown();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!picker.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !dropdown.hasAttribute('hidden')) {
        closeDropdown();
        input.focus();
      }
    });

    // Helper functions
    function toggleDropdown() {
      if (dropdown.hasAttribute('hidden')) {
        openDropdown();
      } else {
        closeDropdown();
      }
    }

    function openDropdown() {
      dropdown.removeAttribute('hidden');
      searchInput.value = '';
      filterStates('');
      searchInput.focus();
    }

    function closeDropdown() {
      dropdown.setAttribute('hidden', 'hidden');
    }

    function filterStates(query) {
      var term = query.toLowerCase().trim();
      var options = listContainer.querySelectorAll('.fa-state-option');

      options.forEach(function(option) {
        var stateName = option.getAttribute('data-state').toLowerCase();
        if (!term || stateName.includes(term)) {
          option.removeAttribute('hidden');
        } else {
          option.setAttribute('hidden', 'hidden');
        }
      });
    }
  }

  function buildStateList(container) {
    container.innerHTML = '';

    // Featured States Section
    if (FEATURED_STATES.length > 0) {
      var featuredTitle = document.createElement('div');
      featuredTitle.className = 'fa-state-group-title';
      featuredTitle.textContent = 'FEATURED';
      container.appendChild(featuredTitle);

      FEATURED_STATES.forEach(function(state) {
        var option = createStateOption(state, true);
        container.appendChild(option);
      });
    }

    // All States Section
    var remainingStates = ALL_STATES.filter(function(state) {
      return FEATURED_STATES.indexOf(state) === -1;
    });

    if (remainingStates.length > 0) {
      var allTitle = document.createElement('div');
      allTitle.className = 'fa-state-group-title';
      allTitle.textContent = 'ALL STATES';
      container.appendChild(allTitle);

      remainingStates.forEach(function(state) {
        var option = createStateOption(state, false);
        container.appendChild(option);
      });
    }
  }

  function createStateOption(stateName, isFeatured) {
    var option = document.createElement('div');
    option.className = 'fa-state-option' + (isFeatured ? ' featured' : '');
    option.textContent = stateName;
    option.setAttribute('data-state', stateName);
    option.setAttribute('role', 'option');
    return option;
  }

})();

