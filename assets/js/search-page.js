/**
 * Search Page - Filtering and Sorting
 * Fortune Academy - Redesigned with dropdown filters and search
 */

(function($) {
    'use strict';

    var activeFilters = {
        industry: [],
        state: null, // Changed to single value for radio button
        education: [],
        delivery: [],
        bestseller: []
    };

    var allStates = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
        'Connecticut', 'Delaware', 'Florida', 'Hawaii', 'Idaho', 
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 
        'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    // Initialize when DOM is ready
    $(document).ready(function() {
        console.log('Search page JS loaded');
        initializeStatePicker();
        initializeFilters();
        initializeSorting();
        initializeSearch();
        handleQueryParameter();
        updateResultsCount();
    });

    /**
     * Initialize state picker dropdown
     */
    function initializeStatePicker() {
        var $stateList = $('#stateList');
        
        // Populate all states (excluding featured ones)
        allStates.forEach(function(state) {
            if (state !== 'Georgia' && state !== 'North Carolina' && state !== 'South Carolina') {
                var stateAbbr = getStateAbbreviation(state);
                var html = '<div class="custom-control custom-radio mb-1">' +
                    '<input class="custom-control-input" type="radio" name="stateFilter" value="' + stateAbbr + '" id="state-' + stateAbbr + '">' +
                    '<label class="custom-control-label" for="state-' + stateAbbr + '" style="font-size: 14px;">' + state + '</label>' +
                    '</div>';
                $stateList.append(html);
            }
        });

        // Handle state selection
        $('input[name="stateFilter"]').on('change', function() {
            var selectedState = $(this).val();
            var selectedLabel = $('label[for="state-' + selectedState + '"]').text().replace('⭐ ', '');
            $('#statePickerLabel').text(selectedLabel);
            activeFilters.state = selectedState;
            applyFilters();
        });

        // Handle state search
        $('#stateSearch').on('input', function() {
            var searchTerm = $(this).val().toLowerCase();
            
            // Filter all state options
            $('#stateList .custom-control').each(function() {
                var stateName = $(this).find('label').text().toLowerCase();
                if (stateName.indexOf(searchTerm) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });

            // Filter featured states
            $('#featuredStates .custom-control').each(function() {
                var stateName = $(this).find('label').text().toLowerCase().replace('⭐ ', '');
                if (stateName.indexOf(searchTerm) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });

        // Clear state filter
        $('#clearStateFilter').on('click', function() {
            $('input[name="stateFilter"]').prop('checked', false);
            $('#statePickerLabel').text('All States');
            $('#stateSearch').val('');
            activeFilters.state = null;
            
            // Show all states again
            $('#stateList .custom-control, #featuredStates .custom-control').show();
            
            applyFilters();
        });
    }

    /**
     * Get state abbreviation from full name
     */
    function getStateAbbreviation(stateName) {
        var stateMap = {
            'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
            'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
            'Florida': 'FL', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL',
            'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY',
            'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA',
            'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
            'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
            'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Dakota': 'ND',
            'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA',
            'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
            'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
            'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
            'Wisconsin': 'WI', 'Wyoming': 'WY'
        };
        return stateMap[stateName] || stateName.substring(0, 2).toUpperCase();
    }

    /**
     * Handle query parameter from URL
     */
    function handleQueryParameter() {
        // Get query parameter from URL
        var urlParams = new URLSearchParams(window.location.search);
        var searchQuery = urlParams.get('q');
        
        if (searchQuery) {
            // Update banner or results header to show search term
            $('.inner-title').text('Search Results for "' + searchQuery + '"');
            $('#searchInput').val(searchQuery);
            
            // Filter courses based on query
            applyFilters();
        }
    }

    /**
     * Initialize filter functionality
     */
    function initializeFilters() {
        console.log('Initializing filters');
        
        // Bootstrap handles the dropdown toggle automatically
        // We just need to handle checkbox changes
        
        // Handle checkbox changes
        $('.dropdown-menu input[type="checkbox"]').on('change', function() {
            updateActiveFilters();
            updateFilterCount();
        });

        // Apply filters button
        $('#applyFilters').on('click', function() {
            applyFilters();
        });

        // Clear filters in menu
        $('#clearFiltersInMenu').on('click', function() {
            $('.dropdown-menu input[type="checkbox"]').prop('checked', false);
            updateActiveFilters();
            updateFilterCount();
            applyFilters();
        });

        // Clear all filters button (outside dropdown)
        $('#clearFilters').on('click', function() {
            clearAllFilters();
        });
    }

    /**
     * Initialize search input
     */
    function initializeSearch() {
        var searchTimeout;
        
        $('#searchInput').on('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                applyFilters();
            }, 300); // Debounce for better performance
        });
    }

    /**
     * Update active filters from checkboxes
     */
    function updateActiveFilters() {
        activeFilters.industry = [];
        activeFilters.education = [];
        activeFilters.delivery = [];
        activeFilters.bestseller = [];
        // State is preserved (set by radio buttons)

        $('.dropdown-menu input[type="checkbox"]:checked').each(function() {
            var filterType = $(this).data('filter');
            var filterValue = $(this).val();
            
            if (activeFilters[filterType] && Array.isArray(activeFilters[filterType])) {
                activeFilters[filterType].push(filterValue);
            }
        });
    }

    /**
     * Update filter count badge
     */
    function updateFilterCount() {
        var count = 0;
        for (var key in activeFilters) {
            if (key === 'state' && activeFilters.state) {
                count += 1;
            } else if (Array.isArray(activeFilters[key])) {
                count += activeFilters[key].length;
            }
        }
        
        var $filterCount = $('#filterCount');
        if (count > 0) {
            $filterCount.text(count).show();
        } else {
            $filterCount.text('').hide();
        }
    }

    /**
     * Initialize sorting functionality
     */
    function initializeSorting() {
        $('#sortBy').on('change', function() {
            var sortOption = $(this).val();
            sortCourses(sortOption);
        });
    }

    /**
     * Apply all active filters and search
     */
    function applyFilters() {
        var searchTerm = $('#searchInput').val().toLowerCase();
        var $courses = $('.course-item');
        var visibleCount = 0;

        $courses.each(function() {
            var $course = $(this);
            var shouldShow = true;

            // Check search term
            if (searchTerm) {
                var title = $course.find('h3').text().toLowerCase();
                var description = $course.find('p').text().toLowerCase();
                
                if (title.indexOf(searchTerm) === -1 && description.indexOf(searchTerm) === -1) {
                    shouldShow = false;
                }
            }

            // Check filters (only if we passed search)
            if (shouldShow) {
                shouldShow = matchesFilters($course);
            }

            if (shouldShow) {
                $course.show();
                visibleCount++;
            } else {
                $course.hide();
            }
        });

        updateResultsCount(visibleCount);
    }

    /**
     * Check if a course matches the active filters
     */
    function matchesFilters($course) {
        // Check industry filter
        if (activeFilters.industry.length > 0) {
            var courseIndustry = $course.data('industry');
            if (activeFilters.industry.indexOf(courseIndustry) === -1) {
                return false;
            }
        }

        // Check state filter
        if (activeFilters.state) {
            var courseState = $course.data('state');
            if (courseState !== activeFilters.state) {
                return false;
            }
        }

        // Check education type filter
        if (activeFilters.education.length > 0) {
            var courseEducation = $course.data('education');
            if (activeFilters.education.indexOf(courseEducation) === -1) {
                return false;
            }
        }

        // Check delivery method filter
        if (activeFilters.delivery.length > 0) {
            var courseDelivery = $course.data('delivery');
            if (activeFilters.delivery.indexOf(courseDelivery) === -1) {
                return false;
            }
        }

        // Check bestseller filter
        if (activeFilters.bestseller.length > 0) {
            var courseBestseller = $course.data('bestseller');
            if (courseBestseller !== true && courseBestseller !== 'true') {
                return false;
            }
        }

        return true;
    }

    /**
     * Clear all filters
     */
    function clearAllFilters() {
        // Clear search input
        $('#searchInput').val('');
        
        // Uncheck all checkboxes
        $('.dropdown-menu input[type="checkbox"]').prop('checked', false);
        
        // Clear state picker
        $('input[name="stateFilter"]').prop('checked', false);
        $('#statePickerLabel').text('All States');
        $('#stateSearch').val('');
        $('#stateList .custom-control, #featuredStates .custom-control').show();
        
        // Reset active filters
        activeFilters = {
            industry: [],
            state: null,
            education: [],
            delivery: [],
            bestseller: []
        };
        
        // Reset filter count
        updateFilterCount();
        
        // Reset sort dropdown
        $('#sortBy').val('default');
        
        // Show all courses
        $('.course-item').show();
        
        // Reset sort order
        sortCourses('default');
        
        // Update count
        updateResultsCount();
        
        // Clear URL parameter
        if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Reset banner title
        $('.inner-title').text('Search Results');
    }

    /**
     * Sort courses based on selected option
     */
    function sortCourses(sortOption) {
        var $courseGrid = $('#courseGrid');
        var $courses = $('.course-item').detach();

        if (sortOption === 'title-asc') {
            // Sort A-Z
            $courses.sort(function(a, b) {
                var titleA = $(a).data('title') || $(a).find('h3').text();
                var titleB = $(b).data('title') || $(b).find('h3').text();
                return titleA.localeCompare(titleB);
            });
        } else if (sortOption === 'title-desc') {
            // Sort Z-A
            $courses.sort(function(a, b) {
                var titleA = $(a).data('title') || $(a).find('h3').text();
                var titleB = $(b).data('title') || $(b).find('h3').text();
                return titleB.localeCompare(titleA);
            });
        } else if (sortOption === 'price-low') {
            // Sort by price: low to high
            $courses.sort(function(a, b) {
                var priceA = parseInt($(a).data('price')) || 0;
                var priceB = parseInt($(b).data('price')) || 0;
                return priceA - priceB;
            });
        } else if (sortOption === 'price-high') {
            // Sort by price: high to low
            $courses.sort(function(a, b) {
                var priceA = parseInt($(a).data('price')) || 0;
                var priceB = parseInt($(b).data('price')) || 0;
                return priceB - priceA;
            });
        }
        // For 'default', we don't sort (maintain current order)

        // Re-append sorted courses
        $courseGrid.append($courses);
    }

    /**
     * Update the results count display
     */
    function updateResultsCount(count) {
        if (typeof count === 'undefined') {
            count = $('.course-item:visible').length;
        }
        $('#resultsCount').text(count);
    }

    /**
     * Initialize book modal functionality
     */
    function initializeBookModal() {
        // Handle Read More button clicks
        $(document).on('click', '.read-more-btn', function(e) {
            e.preventDefault();
            
            var $courseItem = $(this).closest('.course-item');
            
            // Get book data from data attributes
            var bookData = {
                title: $courseItem.data('title'),
                code: $courseItem.data('code'),
                state: $courseItem.data('state'),
                price: $courseItem.data('price'),
                author: $courseItem.data('author'),
                isbn: $courseItem.data('isbn'),
                pages: $courseItem.data('pages'),
                publicationDate: $courseItem.data('publication-date'),
                fullDescription: $courseItem.data('full-description'),
                image: $courseItem.find('.feature-image img').attr('src')
            };
            
            // Populate modal
            $('#bookModalTitle').text(bookData.title);
            $('#bookModalCode').text(bookData.code);
            $('#bookModalState').text(bookData.state);
            $('#bookModalPrice').text('$' + bookData.price);
            $('#bookModalAuthor').text(bookData.author);
            $('#bookModalISBN').text(bookData.isbn);
            $('#bookModalPages').text(bookData.pages);
            $('#bookModalDate').text(bookData.publicationDate);
            $('#bookModalDescription').text(bookData.fullDescription);
            $('#bookModalImage').attr('src', bookData.image).attr('alt', bookData.title);
            
            // Show modal
            $('#bookModalBackdrop').fadeIn(200);
            $('body').css('overflow', 'hidden');
        });
        
        // Close modal handlers
        $('#bookModalClose, #bookModalBackdrop').on('click', function(e) {
            if (e.target === this) {
                closeBookModal();
            }
        });
        
        // Close on escape key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $('#bookModalBackdrop').is(':visible')) {
                closeBookModal();
            }
        });
    }
    
    /**
     * Close the book modal
     */
    function closeBookModal() {
        $('#bookModalBackdrop').fadeOut(200);
        $('body').css('overflow', '');
    }

    // Initialize modal on document ready
    $(document).ready(function() {
        initializeBookModal();
    });

})(jQuery);
