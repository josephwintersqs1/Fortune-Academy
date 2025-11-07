/**
 * Business Landing Page - Calculator & Form Functionality
 * Fortune Academy
 */

(function() {
  'use strict';

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  
  let selectedCourses = [];
  let allCourses = [];
  let filteredCourses = [];
  let currentPage = 1;
  const coursesPerPage = 5;

  // =========================================================================
  // BULK DISCOUNT CALCULATOR
  // =========================================================================

  function calculateBulkDiscount(courseCount) {
    if (courseCount >= 25) return 0.20; // 20% off
    if (courseCount >= 10) return 0.15; // 15% off
    if (courseCount >= 5) return 0.10;  // 10% off
    return 0; // No discount
  }

  function calculateTotals() {
    let subtotal = 0;
    let originalTotal = 0;
    let totalQuantity = 0;

    selectedCourses.forEach(course => {
      const qty = course.quantity || 1;
      subtotal += parseFloat(course.price) * qty;
      originalTotal += parseFloat(course.originalPrice || course.price) * qty;
      totalQuantity += qty;
    });

    const discount = calculateBulkDiscount(totalQuantity);
    const discountAmount = subtotal * discount;
    const finalSubtotal = subtotal - discountAmount;
    const totalSavings = (originalTotal - finalSubtotal);

    return {
      subtotal: finalSubtotal,
      savings: totalSavings,
      discount: discount,
      count: selectedCourses.length,
      totalQuantity: totalQuantity
    };
  }

  function updateSummary() {
    const totals = calculateTotals();
    const savingsEl = document.querySelector('.stat-value.savings');
    const subtotalEl = document.querySelector('.stat-value.subtotal');
    const emptyState = document.querySelector('.summary-empty');
    const statsContainer = document.querySelector('.summary-stats');

    if (savingsEl) savingsEl.textContent = '$' + totals.savings.toFixed(2);
    if (subtotalEl) subtotalEl.textContent = '$' + totals.subtotal.toFixed(2);

    // Show/hide empty state
    if (selectedCourses.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (statsContainer) statsContainer.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (statsContainer) statsContainer.style.display = 'block';
    }

    // Update discount badge if exists
    const discountBadge = document.querySelector('.discount-badge');
    if (discountBadge && totals.discount > 0) {
      discountBadge.textContent = `${(totals.discount * 100).toFixed(0)}% Bulk Discount Applied!`;
      discountBadge.style.display = 'block';
    }
  }

  function addCourse(courseId, quantity = 1) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;

    // Check if already added
    const existing = selectedCourses.find(c => c.id === courseId);
    if (existing) {
      existing.quantity = quantity;
    } else {
      selectedCourses.push({...course, quantity: quantity});
    }

    updateSummary();
    updateButtonState(courseId, true);
  }

  function removeCourse(courseId) {
    selectedCourses = selectedCourses.filter(c => c.id !== courseId);
    updateSummary();
    updateButtonState(courseId, false);
  }

  function updateButtonState(courseId, isAdded) {
    const button = document.querySelector(`[data-course-id="${courseId}"]`);
    if (!button) return;

    if (isAdded) {
      button.textContent = 'ADDED';
      button.classList.add('added');
      button.onclick = (e) => {
        e.preventDefault();
        removeCourse(courseId);
      };
    } else {
      button.textContent = 'ADD';
      button.classList.remove('added');
      button.onclick = (e) => {
        e.preventDefault();
        addCourse(courseId);
      };
    }
  }

  // =========================================================================
  // COURSE FILTERING & SEARCH
  // =========================================================================

  function filterCourses() {
    const categoryFilter = document.getElementById('categoryFilter');
    const stateFilter = document.getElementById('stateFilter');
    const searchInput = document.getElementById('searchInput');

    let filtered = [...allCourses];

    // Filter by category
    if (categoryFilter && categoryFilter.value !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter.value);
    }

    // Filter by state
    if (stateFilter && stateFilter.value !== 'all') {
      filtered = filtered.filter(c => c.state === stateFilter.value || c.state === 'All States');
    }

    // Search by name
    if (searchInput && searchInput.value.trim() !== '') {
      const searchTerm = searchInput.value.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        (c.description && c.description.toLowerCase().includes(searchTerm))
      );
    }

    filteredCourses = filtered;
    currentPage = 1;
    renderCourses();
  }

  function renderCourses() {
    const courseList = document.querySelector('.course-list');
    if (!courseList) return;

    const startIndex = 0;
    const endIndex = currentPage * coursesPerPage;
    const coursesToShow = filteredCourses.slice(startIndex, endIndex);

    // Clear existing courses
    courseList.innerHTML = '';

    // Render courses
    coursesToShow.forEach(course => {
      const selectedCourse = selectedCourses.find(c => c.id === course.id);
      const isAdded = !!selectedCourse;
      const quantity = selectedCourse ? selectedCourse.quantity : 1;
      
      const courseHTML = `
        <div class="course-item" data-course="${course.id}">
          <div class="course-info">
            <h4>${course.name}</h4>
            <div class="course-details">
              <a href="#" class="course-details-link">Details +</a>
              <a href="#" class="course-details-link">Pricing +</a>
            </div>
          </div>
          <div class="course-pricing">
            <div class="price-display">
              ${course.originalPrice && course.originalPrice !== course.price ? 
                `<span class="original-price">$${parseFloat(course.originalPrice).toFixed(2)}</span>` : ''}
              <span class="current-price">$${parseFloat(course.price).toFixed(2)}</span>
            </div>
            <div class="qty-controls">
              <label for="qty-${course.id}" class="qty-label">QTY:</label>
              <input type="number" 
                     id="qty-${course.id}" 
                     class="qty-input" 
                     min="1" 
                     max="999" 
                     value="${quantity}" 
                     data-course-id="${course.id}">
            </div>
            <button class="add-course-btn ${isAdded ? 'added' : ''}" data-course-id="${course.id}">
              ${isAdded ? 'ADDED' : 'ADD'}
            </button>
          </div>
        </div>
      `;
      courseList.insertAdjacentHTML('beforeend', courseHTML);
    });

    // Attach event listeners to quantity inputs
    document.querySelectorAll('.qty-input').forEach(input => {
      const courseId = input.getAttribute('data-course-id');
      
      input.addEventListener('change', (e) => {
        const qty = parseInt(e.target.value) || 1;
        const selectedCourse = selectedCourses.find(c => c.id === courseId);
        if (selectedCourse) {
          selectedCourse.quantity = qty;
          updateSummary();
        }
      });
    });

    // Attach event listeners to add buttons
    document.querySelectorAll('.add-course-btn').forEach(btn => {
      const courseId = btn.getAttribute('data-course-id');
      const isAdded = selectedCourses.find(c => c.id === courseId);
      
      btn.onclick = (e) => {
        e.preventDefault();
        if (isAdded) {
          removeCourse(courseId);
        } else {
          const qtyInput = document.getElementById(`qty-${courseId}`);
          const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
          addCourse(courseId, quantity);
        }
      };
    });

    // Update course count
    const courseCount = document.querySelector('.course-count');
    if (courseCount) {
      courseCount.textContent = `${endIndex} of ${filteredCourses.length} COURSES`;
    }

    // Show/hide load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      if (endIndex >= filteredCourses.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-block';
      }
    }
  }

  function loadMoreCourses() {
    currentPage++;
    renderCourses();
  }

  // =========================================================================
  // FORM VALIDATION
  // =========================================================================

  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ef4444';
      } else {
        field.style.borderColor = '#e5e7eb';
      }
    });

    // Email validation
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = '#ef4444';
      }
    }

    // Phone validation (basic)
    const phoneField = form.querySelector('[type="tel"]');
    if (phoneField && phoneField.value) {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(phoneField.value)) {
        isValid = false;
        phoneField.style.borderColor = '#ef4444';
      }
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (validateForm(form)) {
      // Collect form data
      const formData = {
        firstName: form.querySelector('[name="firstName"]').value,
        lastName: form.querySelector('[name="lastName"]').value,
        phone: form.querySelector('[name="phone"]').value,
        email: form.querySelector('[name="email"]').value,
        company: form.querySelector('[name="company"]').value,
        companySize: form.querySelector('[name="companySize"]').value,
        employeeCount: form.querySelector('[name="employeeCount"]').value,
        contactMethod: form.querySelector('[name="contactMethod"]:checked').value,
        comments: form.querySelector('[name="comments"]').value
      };

      console.log('Form submitted:', formData);
      
      // Show success message
      alert('Thank you! Your inquiry has been submitted. Our team will contact you within 24 hours.');
      
      // Reset form
      form.reset();
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  // =========================================================================
  // ADD ALL TO CART
  // =========================================================================

  function addAllToCart() {
    if (selectedCourses.length === 0) {
      alert('Please add courses to your selection first.');
      return;
    }

    const totals = calculateTotals();
    console.log('Adding to cart:', {
      courses: selectedCourses,
      totals: totals
    });

    alert(`Adding ${selectedCourses.length} courses to cart!\nSubtotal: $${totals.subtotal.toFixed(2)}\nSavings: $${totals.savings.toFixed(2)}`);
    
    // In production, this would redirect to checkout or add to cart
    // window.location.href = '/checkout';
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  function init() {
    // Get courses from data attribute
    const courseData = document.getElementById('courseData');
    if (courseData) {
      try {
        allCourses = JSON.parse(courseData.textContent);
        filteredCourses = [...allCourses];
        renderCourses();
      } catch (e) {
        console.error('Error parsing course data:', e);
      }
    }

    // Filter event listeners
    const applyFiltersBtn = document.querySelector('.apply-filters-btn');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', filterCourses);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          filterCourses();
        }
      });
    }

    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreCourses);
    }

    // Add all to cart button
    const addAllBtn = document.querySelector('.add-all-btn');
    if (addAllBtn) {
      addAllBtn.addEventListener('click', addAllToCart);
    }

    // Form submission
    const leadForm = document.querySelector('.lead-gen-form');
    if (leadForm) {
      leadForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize summary
    updateSummary();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

