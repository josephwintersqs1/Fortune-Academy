/*!
 * layout.js
 * Lightweight HTML partial loader for shared site chrome (header/footer).
 */
(function () {
  "use strict";

  var INCLUDE_SELECTOR = "[data-include]";
  var EVENT_NAME = "layout:ready";
  var cache = new Map();
  var readyFired = false;

  function toArray(collection) {
    return Array.prototype.slice.call(collection || []);
  }

  function signalReady() {
    if (readyFired) {
      return;
    }
    readyFired = true;
    if (document.body) {
      document.body.classList.add("layout-ready");
      document.body.dataset.layoutReady = "true";
    }
    document.dispatchEvent(new CustomEvent(EVENT_NAME));
  }

  function buildAbsoluteUrl(url) {
    try {
      return new URL(url, window.location.href).toString();
    } catch (error) {
      return url;
    }
  }

  function fetchPartial(url) {
    // DEVELOPMENT: Cache disabled - always fetch fresh content
    // if (!cache.has(url)) {
      var resolvedUrl = buildAbsoluteUrl(url);
      var request;

      if (window.location.protocol === "file:") {
        request = new Promise(function (resolve, reject) {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", resolvedUrl, true);
            xhr.overrideMimeType && xhr.overrideMimeType("text/html");
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                  resolve(xhr.responseText);
                } else {
                  reject(
                    new Error(
                      "Failed to load partial: " +
                        url +
                        " (status " +
                        xhr.status +
                        ")"
                    )
                  );
                }
              }
            };
            xhr.onerror = function () {
              reject(new Error("Network error while loading partial: " + url));
            };
            xhr.send();
          } catch (error) {
            reject(error);
          }
        });
      } else {
        request = fetch(resolvedUrl, { 
          credentials: "same-origin",
          cache: "no-store"  // Disable browser cache
        }).then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to load partial: " + url + " (" + response.status + ")");
          }
          return response.text();
        });
      }

      // cache.set(url, request);  // Cache disabled for development
    // }
    // return cache.get(url);
    return request;
  }

  function insertMarkup(el, html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    var fragment = template.content.cloneNode(true);
    var root =
      fragment.querySelector("[data-layout-component]") || fragment.firstElementChild || null;

    el.replaceWith(fragment);
    return root;
  }

  function applyHeaderOptions(root, options) {
    if (!root) {
      return;
    }

    if (options.headerClass) {
      options.headerClass
        .split(/\s+/)
        .filter(Boolean)
        .forEach(function (cls) {
          root.classList.add(cls);
        });
    }

    if (options.logoWhite) {
      var whiteLogo = root.querySelector(".white-logo");
      if (whiteLogo) {
        whiteLogo.setAttribute("src", options.logoWhite);
      }
    }

    if (options.logoDark) {
      var darkLogo = root.querySelector(".black-logo");
      if (darkLogo) {
        darkLogo.setAttribute("src", options.logoDark);
      }
    }

    if (options.logoAlt) {
      var logoLink = root.querySelector(".site-identity a");
      if (logoLink) {
        logoLink.setAttribute("aria-label", options.logoAlt);
        logoLink.setAttribute("title", options.logoAlt);
      }
      toArray(root.querySelectorAll(".site-identity img")).forEach(function (img) {
        img.setAttribute("alt", options.logoAlt);
      });
    }

    if (options.loginHref) {
      var loginButton = root.querySelector(".header-btn a");
      if (loginButton) {
        loginButton.setAttribute("href", options.loginHref);
      }
    }

    if (options.loginLabel) {
      var loginButtonLabel = root.querySelector(".header-btn a");
      if (loginButtonLabel) {
        loginButtonLabel.textContent = options.loginLabel;
      }
    }

    if (options.activeVertical) {
      var verticalLink = root.querySelector(
        ".vertical-item." + options.activeVertical + " > a"
      );
      if (verticalLink) {
        verticalLink.classList.add("is-active");
        verticalLink.setAttribute("aria-current", "page");
      }
    }

    if (options.activeNavHref) {
      var navLink = root.querySelector('.main-navigation a[href="' + options.activeNavHref + '"]');
      if (navLink) {
        navLink.classList.add("is-active");
        navLink.setAttribute("aria-current", "page");
      }
    }

    // Apply base path to all relative URLs if specified (do this LAST after other options are set)
    if (options.basePath) {
      var basePath = options.basePath;
      
      // Handle root links specially (logo, etc.)
      toArray(root.querySelectorAll('a[data-root-link]')).forEach(function(link) {
        link.setAttribute('href', basePath + 'index.html');
      });
      
      // Update all other href attributes
      toArray(root.querySelectorAll('a[href]:not([data-root-link])')).forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && !href.match(/^(https?:\/\/|mailto:|tel:|#|\.\.\/)/)) {
          link.setAttribute('href', basePath + href);
        }
      });
      
      // Update all src attributes (images, scripts, etc.) - but skip if already set to absolute/relative path
      toArray(root.querySelectorAll('[src]')).forEach(function(element) {
        var src = element.getAttribute('src');
        if (src && !src.match(/^(https?:\/\/|data:|\.\.\/)/)) {
          element.setAttribute('src', basePath + src);
        }
      });
    }
  }

  function applyFooterOptions(root, options) {
    if (!root) {
      return;
    }

    if (options.footerLogo) {
      var footerLogo = root.querySelector(".footer-logo img");
      if (footerLogo) {
        footerLogo.setAttribute("src", options.footerLogo);
      }
    }

    if (options.footerLogoAlt) {
      var footerLogoImg = root.querySelector(".footer-logo img");
      if (footerLogoImg) {
        footerLogoImg.setAttribute("alt", options.footerLogoAlt);
        var footerLink = footerLogoImg.closest("a");
        if (footerLink) {
          footerLink.setAttribute("aria-label", options.footerLogoAlt);
          footerLink.setAttribute("title", options.footerLogoAlt);
        }
      }
    }

    // Apply base path to all relative URLs if specified (do this LAST after other options are set)
    if (options.basePath) {
      var basePath = options.basePath;
      
      // Handle root links specially
      toArray(root.querySelectorAll('a[data-root-link]')).forEach(function(link) {
        link.setAttribute('href', basePath + 'index.html');
      });
      
      // Update all other href attributes
      toArray(root.querySelectorAll('a[href]:not([data-root-link])')).forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && !href.match(/^(https?:\/\/|mailto:|tel:|#|\.\.\/)/)) {
          link.setAttribute('href', basePath + href);
        }
      });
      
      // Update all src attributes (images, scripts, etc.) - but skip if already set to absolute/relative path
      toArray(root.querySelectorAll('[src]')).forEach(function(element) {
        var src = element.getAttribute('src');
        if (src && !src.match(/^(https?:\/\/|data:|\.\.\/)/)) {
          element.setAttribute('src', basePath + src);
        }
      });
    }
  }

  function configureComponent(root, options) {
    if (!root) {
      return;
    }
    var componentType = (root.dataset && root.dataset.layoutComponent) || "";

    if (componentType === "header") {
      applyHeaderOptions(root, options);
    } else if (componentType === "footer") {
      applyFooterOptions(root, options);
    }
  }

  function parseOptions(dataset) {
    var options = {};
    Object.keys(dataset || {}).forEach(function (key) {
      if (key === "include") {
        return;
      }
      options[key] = dataset[key];
    });
    return options;
  }

  function processInclude(el) {
    var src = el.getAttribute("data-include");
    if (!src) {
      el.parentNode && el.parentNode.removeChild(el);
      return Promise.resolve();
    }
    var options = parseOptions(el.dataset);
    return fetchPartial(src)
      .then(function (html) {
        var root = insertMarkup(el, html);
        configureComponent(root, options);
      })
      .catch(function (error) {
        console.error("[layout] Failed to load include:", src, error);
        el.parentNode && el.parentNode.removeChild(el);
      });
  }

  function init() {
    var includeNodes = toArray(document.querySelectorAll(INCLUDE_SELECTOR));

    if (includeNodes.length === 0) {
      signalReady();
      return;
    }

    Promise.all(includeNodes.map(processInclude))
      .catch(function (error) {
        console.error("[layout] include processing error:", error);
      })
      .finally(signalReady);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

