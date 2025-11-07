/**
 * Modern Search Modal (Algolia-Style)
 * Fortune Academy
 */

(function($) {
    'use strict';

    // Course data matching the courses in search.html
    var courses = [
        {
            title: 'Real Estate Pre-Licensing - GA',
            industry: 'real-estate',
            industryLabel: 'Real Estate',
            description: 'Complete 75-hour pre-licensing course for Georgia real estate salesperson license.',
            price: 299,
            url: '#',
            image: 'assets/images/home/real-estate.jpg'
        },
        {
            title: 'NMLS Licensing Course - FL',
            industry: 'mortgage',
            industryLabel: 'Mortgage',
            description: '20-hour NMLS approved pre-licensing education for mortgage loan originators.',
            price: 449,
            url: '#',
            image: 'assets/images/home/mortgage.jpg'
        },
        {
            title: 'Real Estate CE Bundle - SC',
            industry: 'real-estate',
            industryLabel: 'Real Estate',
            description: 'Complete your South Carolina 8-hour continuing education requirement online.',
            price: 99,
            url: '#',
            image: 'assets/images/home/real-estate.jpg'
        },
        {
            title: 'OSHA 30-Hour Construction',
            industry: 'osha',
            industryLabel: 'OSHA Safety',
            description: 'Comprehensive safety training for construction supervisors and workers.',
            price: 349,
            url: '#',
            image: 'assets/images/home/osha.jpg'
        },
        {
            title: 'Appraisal Principles & Procedures',
            industry: 'appraisal',
            industryLabel: 'Appraisal',
            description: '75-hour foundational course covering valuation principles and methodologies.',
            price: 599,
            url: '#',
            image: 'assets/images/home/appraisal.jpg'
        },
        {
            title: 'HIPAA Compliance Training',
            industry: 'healthcare',
            industryLabel: 'Healthcare',
            description: 'Essential privacy and security training for healthcare professionals.',
            price: 149,
            url: '#',
            image: 'assets/images/home/healthcare.jpg'
        },
        {
            title: 'Broker Pre-Licensing - NC',
            industry: 'real-estate',
            industryLabel: 'Real Estate',
            description: '90-hour course to upgrade from salesperson to broker license in North Carolina.',
            price: 399,
            url: '#',
            image: 'assets/images/home/real-estate.jpg'
        },
        {
            title: 'Sexual Harassment Prevention - NY',
            industry: 'hr',
            industryLabel: 'HR Compliance',
            description: 'NYS mandated training for all employees and supervisors.',
            price: 199,
            url: '#',
            image: 'assets/images/home/compliance.jpg'
        },
        {
            title: 'OSHA 10-Hour General Industry',
            industry: 'osha',
            industryLabel: 'OSHA Safety',
            description: 'Entry-level safety training for general industry workers.',
            price: 129,
            url: '#',
            image: 'assets/images/home/osha.jpg'
        },
        {
            title: 'NMLS CE 8-Hour Package',
            industry: 'mortgage',
            industryLabel: 'Mortgage',
            description: 'Complete your annual continuing education requirement online.',
            price: 179,
            url: '#',
            image: 'assets/images/home/mortgage.jpg'
        },
        {
            title: 'Real Estate Exam Prep - TX',
            industry: 'real-estate',
            industryLabel: 'Real Estate',
            description: 'Live review course with practice exams to help you pass on the first try.',
            price: 199,
            url: '#',
            image: 'assets/images/home/real-estate.jpg'
        },
        {
            title: 'USPAP 7-Hour Update',
            industry: 'appraisal',
            industryLabel: 'Appraisal',
            description: 'Required biennial update course for certified appraisers.',
            price: 249,
            url: '#',
            image: 'assets/images/home/appraisal.jpg'
        }
    ];

    var $backdrop;
    var $modal;
    var $searchInput;
    var $searchResults;
    var $closeButton;
    var currentFocus = -1;
    var currentSearchTerm = '';

    // Initialize when DOM is ready
    $(document).ready(function() {
        console.log('Search modal: Initializing...');
        initializeSearchModal();
        
        // FORCE icon colors on load and scroll
        forceIconColors();
        $(window).on('scroll', forceIconColors);
        
        // Add hover handlers to force orange color
        $(document).on('mouseenter', '.header-search-icon .search-icon', function() {
            $(this).css('color', '#CC5500');
            $(this).find('i').css('color', '#CC5500');
        });
        
        $(document).on('mouseleave', '.header-search-icon .search-icon', function() {
            forceIconColors(); // Reset to correct color based on header state
        });
    });
    
    /**
     * Force icon colors based on header state
     * Check if header is sticky (has fixed-header class) vs at top
     */
    function forceIconColors() {
        var $header = $('.site-header');
        var $icon = $('.header-search-icon .search-icon');
        var $iconElement = $('.header-search-icon .search-icon i');
        
        // Debug logging
        console.log('forceIconColors called');
        console.log('Header classes:', $header.attr('class'));
        console.log('Has fixed-header:', $header.hasClass('fixed-header'));
        console.log('Window scroll Y:', window.scrollY);
        
        // Check if we're at the top of the page (not sticky)
        var isAtTop = !$header.hasClass('fixed-header') || window.scrollY <= 50;
        
        if (isAtTop) {
            // At top - white icon
            console.log('Setting icon to WHITE (at top)');
            $icon.css({
                'color': '#fff',
                'background': 'transparent'
            });
            $iconElement.css('color', '#fff');
        } else {
            // Sticky/scrolled - orange icon
            console.log('Setting icon to ORANGE (sticky)');
            $icon.css({
                'color': '#CC5500',
                'background': 'transparent'
            });
            $iconElement.css('color', '#CC5500');
        }
        
        // Verify what was applied
        console.log('Icon color after:', $icon.css('color'));
        console.log('Icon element color after:', $iconElement.css('color'));
    }

    /**
     * Initialize search modal functionality
     */
    function initializeSearchModal() {
        $backdrop = $('#searchBackdrop');
        $modal = $('.search-modal');
        $searchInput = $('#searchModalInput');
        $searchResults = $('#searchModalResults');
        $closeButton = $('#searchModalClose');

        console.log('Search modal: Elements found:', {
            backdrop: $backdrop.length,
            modal: $modal.length,
            input: $searchInput.length,
            results: $searchResults.length,
            closeButton: $closeButton.length
        });

        if ($backdrop.length === 0) {
            console.error('Search modal: Backdrop element not found!');
            return;
        }

        // Check for search icon (may not be loaded yet if using includes)
        var $searchIcon = $('.header-search-icon .search-icon');
        console.log('Search modal: Search icon found:', $searchIcon.length);

        // Use event delegation to handle dynamically loaded header
        $(document).on('click', '.header-search-icon .search-icon', function(e) {
            e.preventDefault();
            console.log('Search modal: Search icon clicked!');
            openModal();
        });

        // Close modal on close button click
        $closeButton.on('click', function(e) {
            e.preventDefault();
            closeModal();
        });

        // Close modal on backdrop click
        $backdrop.on('click', function(e) {
            if ($(e.target).is($backdrop)) {
                closeModal();
            }
        });

        // Listen for input
        $searchInput.on('input', function() {
            var searchTerm = $(this).val().trim();
            currentSearchTerm = searchTerm;
            handleSearchInput(searchTerm);
        });

        // Keyboard navigation
        $searchInput.on('keydown', function(e) {
            handleKeyboardNavigation(e);
        });

        // ESC key to close
        $(document).on('keydown', function(e) {
            if (e.keyCode === 27 && $backdrop.is(':visible')) {
                closeModal();
            }
        });
    }

    /**
     * Open the search modal
     */
    function openModal() {
        console.log('Search modal: openModal called');
        
        // Force styles directly via JavaScript (fallback if CSS doesn't load)
        $backdrop.css({
            'display': 'block',
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'right': '0',
            'bottom': '0',
            'background': 'rgba(0, 0, 0, 0.6)',
            'z-index': '9998',
            'backdrop-filter': 'blur(2px)'
        });
        
        $modal.css({
            'position': 'fixed',
            'top': '80px',
            'left': '50%',
            'transform': 'translateX(-50%)',
            'max-width': '800px',
            'width': 'calc(100% - 32px)',
            'background': '#fff',
            'border-radius': '12px',
            'box-shadow': '0 25px 50px rgba(0, 0, 0, 0.25)',
            'z-index': '9999'
        });
        
        // Apply styles to modal header elements
        $('.search-modal-header').css({
            'display': 'flex',
            'align-items': 'center',
            'padding': '20px 24px',
            'border-bottom': 'none',
            'gap': '12px'
        });
        
        // Style the search icon
        $('.search-modal-icon').css({
            'color': '#9ca3af',
            'font-size': '20px',
            'flex-shrink': '0'
        });
        
        // Style the input
        $searchInput.css({
            'flex': '1',
            'border': 'none',
            'outline': 'none',
            'font-size': '18px',
            'color': '#111827',
            'background': 'transparent',
            'padding': '4px 0'
        });
        
        // Style the close button
        $closeButton.css({
            'background': 'transparent',
            'border': 'none',
            'color': '#9ca3af',
            'font-size': '20px',
            'cursor': 'pointer',
            'padding': '6px',
            'border-radius': '4px',
            'transition': 'all 0.2s ease',
            'flex-shrink': '0'
        });
        
        console.log('Search modal: Applied inline styles');
        
        // Trigger reflow to enable transition
        setTimeout(function() {
            $backdrop.css('opacity', '1');
            $modal.css('opacity', '1');
            console.log('Search modal: Faded in');
        }, 10);
        
        $backdrop.addClass('active');
        $searchInput.focus();
        console.log('Search modal: Modal should now be visible');
    }

    /**
     * Close the search modal
     */
    function closeModal() {
        // Fade out
        $backdrop.css('opacity', '0');
        $modal.css('opacity', '0');
        
        $backdrop.removeClass('active');
        setTimeout(function() {
            $backdrop.css('display', 'none');
            $searchInput.val('');
            $searchResults.hide().html('');
            $('.search-view-all').remove(); // Remove view all link
            currentFocus = -1;
            currentSearchTerm = '';
        }, 300);
    }

    /**
     * Handle search input and show results
     */
    function handleSearchInput(searchTerm) {
        currentFocus = -1;

        if (searchTerm.length < 2) {
            $searchResults.hide();
            return;
        }

        var matches = filterCourses(searchTerm);
        displayResults(matches, searchTerm);
    }

    /**
     * Filter courses based on search term
     */
    function filterCourses(searchTerm) {
        var term = searchTerm.toLowerCase();
        var matches = [];

        courses.forEach(function(course) {
            var titleMatch = course.title.toLowerCase().indexOf(term) !== -1;
            var descMatch = course.description.toLowerCase().indexOf(term) !== -1;
            var industryMatch = course.industryLabel.toLowerCase().indexOf(term) !== -1;

            if (titleMatch || descMatch || industryMatch) {
                // Calculate relevance score
                var score = 0;
                if (titleMatch) score += 3;
                if (industryMatch) score += 2;
                if (descMatch) score += 1;

                matches.push({
                    course: course,
                    score: score
                });
            }
        });

        // Sort by score (highest first) and limit to 5
        matches.sort(function(a, b) {
            return b.score - a.score;
        });

        return matches.slice(0, 5).map(function(m) {
            return m.course;
        });
    }

    /**
     * Display course results
     */
    function displayResults(matches, searchTerm) {
        // Remove any existing "View all" link first
        $('.search-view-all').remove();
        
        if (matches.length === 0) {
            var noResultsHtml = '<div class="search-no-results">' +
                '<i class="fas fa-search"></i>' +
                '<p>No courses found for "' + searchTerm + '"</p>' +
                '</div>';
            $searchResults.html(noResultsHtml).show();
            
            // Style no results
            $('.search-no-results').css({
                'padding': '40px 20px',
                'text-align': 'center',
                'color': '#6b7280'
            });
            $('.search-no-results i').css({
                'font-size': '32px',
                'color': '#d1d5db',
                'margin-bottom': '12px',
                'display': 'block'
            });
            $('.search-no-results p').css({
                'margin': '0',
                'font-size': '14px'
            });
            
            return;
        }

        var html = '';
        matches.forEach(function(course, index) {
            html += buildResultItem(course, index);
        });

        $searchResults.html(html).show();
        
        // Apply inline styles to results container (scrollable area)
        $searchResults.css({
            'max-height': '400px',
            'overflow-y': 'auto',
            'overflow-x': 'hidden'
        });
        
        // Add "View all results" link AFTER the scrollable results
        // Check if it already exists and remove it first
        $('.search-view-all').remove();
        
        var viewAllHtml = '<div class="search-view-all">' +
            '<a href="search.html?q=' + encodeURIComponent(searchTerm) + '" class="search-view-all-link">' +
            'View all results for "' + searchTerm + '" →' +
            '</a>' +
            '</div>';
        
        // Append after the results container
        $searchResults.after(viewAllHtml);
        
        // Style result items
        $('.search-result-item').css({
            'padding': '16px 24px',
            'cursor': 'pointer',
            'transition': 'background 0.15s ease',
            'border-bottom': '1px solid #f3f4f6',
            'display': 'flex',
            'align-items': 'center',
            'gap': '16px'
        });
        
        // Style product images
        $('.search-result-image').css({
            'width': '70px',
            'height': '70px',
            'border-radius': '8px',
            'object-fit': 'cover',
            'flex-shrink': '0',
            'border': '1px solid #e5e7eb'
        });
        
        $('.search-result-main').css({
            'flex': '1',
            'min-width': '0'
        });
        
        $('.search-result-title').css({
            'font-size': '16px',
            'font-weight': '600',
            'color': '#111827',
            'margin-bottom': '4px'
        });
        
        $('.search-result-desc').css({
            'font-size': '14px',
            'color': '#6b7280',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
        });
        
        $('.search-result-meta').css({
            'display': 'flex',
            'align-items': 'center',
            'gap': '12px',
            'flex-shrink': '0'
        });
        
        $('.search-result-industry').css({
            'font-size': '12px',
            'font-weight': '600',
            'padding': '6px 10px',
            'border-radius': '4px',
            'text-transform': 'uppercase',
            'letter-spacing': '0.5px',
            'color': '#fff'
        });
        
        // Apply industry-specific colors (matching CSS variables)
        $('.industry-tag-real-estate').css('background', '#c1241a');    // --color-real-estate
        $('.industry-tag-mortgage').css('background', '#00897B');       // --color-mortgage (teal)
        $('.industry-tag-appraisal').css('background', '#2c75ba');      // --color-appraisal
        $('.industry-tag-osha').css('background', '#4caf50');           // --color-osha
        $('.industry-tag-healthcare').css('background', '#9c27b0');     // --color-healthcare
        $('.industry-tag-hr').css('background', '#ff6f00');             // --color-hr
        
        $('.search-result-price').css({
            'font-size': '16px',
            'font-weight': '700',
            'color': '#111827'
        });
        
        // Style view all link
        $('.search-view-all').css({
            'padding': '16px 24px',
            'border-top': '1px solid #e5e7eb'
        });
        
        $('.search-view-all-link').css({
            'display': 'block',
            'text-align': 'center',
            'font-size': '15px',
            'font-weight': '600',
            'color': '#CC5500',
            'text-decoration': 'none',
            'transition': 'color 0.15s ease'
        });
        
        // Hover effects
        $('.search-result-item').hover(
            function() {
                $(this).css('background', '#f5f5f5');
            },
            function() {
                $(this).css('background', 'transparent');
            }
        );

        // Add click handlers to results
        $('.search-result-item').on('click', function(e) {
            e.preventDefault();
            var url = $(this).data('url');
            if (url && url !== '#') {
                window.location.href = url;
            } else {
                // Navigate to search page with course title as query
                var title = $(this).find('.search-result-title').text();
                window.location.href = 'search.html?q=' + encodeURIComponent(title);
            }
        });
    }

    /**
     * Build HTML for a result item
     */
    function buildResultItem(course, index) {
        var industryClass = 'industry-tag-' + course.industry;
        
        return '<div class="search-result-item" data-index="' + index + '" data-url="' + course.url + '">' +
            '<img src="' + course.image + '" alt="' + course.title + '" class="search-result-image">' +
            '<div class="search-result-main">' +
            '<div class="search-result-title">' + course.title + '</div>' +
            '<div class="search-result-desc">' + course.description + '</div>' +
            '</div>' +
            '<div class="search-result-meta">' +
            '<span class="search-result-industry ' + industryClass + '">' + course.industryLabel + '</span>' +
            '<span class="search-result-price">$' + course.price + '</span>' +
            '</div>' +
            '</div>';
    }

    /**
     * Handle keyboard navigation in results
     */
    function handleKeyboardNavigation(e) {
        var $items = $('.search-result-item');
        
        if ($items.length === 0) {
            return;
        }

        // Down arrow
        if (e.keyCode === 40) {
            e.preventDefault();
            currentFocus++;
            if (currentFocus >= $items.length) {
                currentFocus = 0;
            }
            setActiveResult($items);
        }
        // Up arrow
        else if (e.keyCode === 38) {
            e.preventDefault();
            currentFocus--;
            if (currentFocus < 0) {
                currentFocus = $items.length - 1;
            }
            setActiveResult($items);
        }
        // Enter
        else if (e.keyCode === 13) {
            e.preventDefault();
            if (currentFocus > -1 && $items.length > 0) {
                $items.eq(currentFocus).click();
            } else if (currentSearchTerm) {
                // Navigate to search results page
                window.location.href = 'search.html?q=' + encodeURIComponent(currentSearchTerm);
            }
        }
    }

    /**
     * Set active result for keyboard navigation
     */
    function setActiveResult($items) {
        $items.removeClass('active');
        if (currentFocus >= 0 && currentFocus < $items.length) {
            var $active = $items.eq(currentFocus);
            $active.addClass('active');
            
            // Scroll into view if needed
            var resultsContainer = $searchResults[0];
            var activeElement = $active[0];
            if (activeElement) {
                var containerTop = resultsContainer.scrollTop;
                var containerBottom = containerTop + resultsContainer.clientHeight;
                var elementTop = activeElement.offsetTop;
                var elementBottom = elementTop + activeElement.offsetHeight;
                
                if (elementTop < containerTop) {
                    resultsContainer.scrollTop = elementTop;
                } else if (elementBottom > containerBottom) {
                    resultsContainer.scrollTop = elementBottom - resultsContainer.clientHeight;
                }
            }
        }
    }

})(jQuery);
