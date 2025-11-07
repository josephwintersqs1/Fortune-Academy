(function () {
  var STATE_DATA = window.FA_STATE_DATA || { featured: [], all: [], defaultState: "" };
  var FEATURED = STATE_DATA.featured || [];
  var ALL = STATE_DATA.all || [];
  var PLACEHOLDER = "Select State";

  function buildGroup(container, title, states, featured) {
    if (!states.length) {
      return;
    }
    var titleEl = document.createElement("div");
    titleEl.className = "re-catalog__group-title";
    titleEl.textContent = title;
    container.appendChild(titleEl);

    states.forEach(function (state) {
      var option = document.createElement("div");
      option.className = "re-catalog__option" + (featured ? " re-catalog__option--featured" : "");
      option.setAttribute("data-state", state);
      option.setAttribute("role", "option");
      option.textContent = state;
      container.appendChild(option);
    });
  }

  function filterOptions(dropdown, query) {
    var term = (query || "").toLowerCase();
    dropdown.querySelectorAll(".re-catalog__option").forEach(function (option) {
      var state = option.getAttribute("data-state") || "";
      option.hidden = term && !state.toLowerCase().includes(term);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var openDropdown = null;

    function closeDropdown(dropdown) {
      if (!dropdown) return;
      dropdown.setAttribute("hidden", "hidden");
      if (dropdown.__wrapper) {
        dropdown.__wrapper.classList.remove("is-open");
      }
      if (dropdown.__display) {
        dropdown.__display.setAttribute("aria-expanded", "false");
      }
      if (openDropdown === dropdown) {
        openDropdown = null;
      }
    }

    function openDropdownFor(dropdown) {
      if (openDropdown && openDropdown !== dropdown) {
        closeDropdown(openDropdown);
      }
      dropdown.removeAttribute("hidden");
      if (dropdown.__wrapper) {
        dropdown.__wrapper.classList.add("is-open");
      }
      if (dropdown.__display) {
        dropdown.__display.setAttribute("aria-expanded", "true");
      }
      var searchInput = dropdown.querySelector(".hero-state__search input");
      if (searchInput) {
        searchInput.value = "";
        filterOptions(dropdown, "");
        searchInput.focus();
      }
      openDropdown = dropdown;
    }

    document.querySelectorAll("[data-hero-state-picker]").forEach(function (wrapper) {
      var hiddenInput = wrapper.querySelector('input[type="hidden"]');
      var displayInput = wrapper.querySelector(".re-catalog__state-select");
      var dropdown = wrapper.querySelector(".hero-state__dropdown");
      var searchInput = dropdown ? dropdown.querySelector(".hero-state__search input") : null;
      var groupsContainer = dropdown ? dropdown.querySelector(".hero-state__groups") : null;

      if (!hiddenInput || !displayInput || !dropdown || !groupsContainer) {
        return;
      }

      dropdown.__wrapper = wrapper;
      dropdown.__display = displayInput;

      groupsContainer.innerHTML = "";
      buildGroup(groupsContainer, "Featured", FEATURED, true);
      var remaining = ALL.filter(function (state) {
        return FEATURED.indexOf(state) === -1;
      });
      buildGroup(groupsContainer, "All States", remaining, false);

      function setValue(value) {
        hiddenInput.value = value;
        displayInput.value = value || "";
        if (!value) {
          displayInput.placeholder = PLACEHOLDER;
        }
        wrapper.classList.toggle("has-value", Boolean(value));
        dropdown.querySelectorAll(".re-catalog__option").forEach(function (option) {
          option.classList.toggle("is-selected", option.getAttribute("data-state") === value);
        });
      }

      var initialValue = hiddenInput.value || STATE_DATA.defaultState || FEATURED[0] || ALL[0] || "";
      setValue(initialValue);

      displayInput.setAttribute("aria-haspopup", "listbox");
      displayInput.setAttribute("aria-expanded", "false");
      displayInput.setAttribute("readonly", "readonly");

      function toggleDropdown(evt) {
        if (evt) {
          evt.preventDefault();
        }
        if (dropdown.hasAttribute("hidden")) {
          openDropdownFor(dropdown);
        } else {
          closeDropdown(dropdown);
        }
      }

      displayInput.addEventListener("click", toggleDropdown);
      displayInput.addEventListener("keydown", function (evt) {
        if (evt.key === "Enter" || evt.key === " ") {
          toggleDropdown(evt);
        } else if (evt.key === "Escape") {
          closeDropdown(dropdown);
        }
      });

      if (searchInput) {
        searchInput.addEventListener("input", function () {
          filterOptions(dropdown, this.value || "");
        });
      }

      groupsContainer.addEventListener("click", function (evt) {
        var option = evt.target.closest(".re-catalog__option");
        if (!option) return;
        var value = option.getAttribute("data-state") || "";
        setValue(value);
        closeDropdown(dropdown);
        displayInput.focus();
      });

      wrapper.addEventListener("keydown", function (evt) {
        if (evt.key === "Escape") {
          closeDropdown(dropdown);
          displayInput.focus();
        }
      });
    });

    document.addEventListener("click", function (evt) {
      if (!openDropdown) return;
      if (!openDropdown.contains(evt.target) && !openDropdown.__wrapper.contains(evt.target)) {
        closeDropdown(openDropdown);
      }
    });
  });
})();
