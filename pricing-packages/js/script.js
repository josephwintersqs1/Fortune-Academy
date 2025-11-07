// =============================================
// MODERN PRICING PACKAGE SCRIPT
// =============================================

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize components
        initAccordions();
        initDeliveryOptions();
        initEnrollButtons();
        
    });
    
    // =============================================
    // ACCORDION FUNCTIONALITY
    // =============================================
    
    function initAccordions() {
        const accordionButtons = document.querySelectorAll('.btn-details');
        
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Toggle icon rotation is handled by CSS
                // Bootstrap handles the collapse/expand
            });
        });
    }
    
    // =============================================
    // DELIVERY OPTIONS
    // =============================================
    
    function initDeliveryOptions() {
        const deliveryOptions = document.querySelectorAll('.delivery-options .form-check-input');
        
        deliveryOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.checked) {
                    console.log('Selected delivery method:', this.id);
                    // You can add custom logic here for delivery method changes
                    // For example, update pricing based on delivery method
                }
            });
        });
    }
    
    // =============================================
    // ENROLL BUTTONS
    // =============================================
    
    function initEnrollButtons() {
        const enrollButtons = document.querySelectorAll('.btn-enroll');
        
        enrollButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get package information
                const card = this.closest('.pricing-card');
                const packageName = card.querySelector('.package-name').textContent;
                const price = card.querySelector('.price').textContent;
                const deliveryMethod = card.querySelector('.delivery-options .form-check-input:checked');
                const deliveryMethodLabel = deliveryMethod ? deliveryMethod.nextElementSibling.textContent : 'Not selected';
                
                console.log('Enroll clicked:', {
                    package: packageName,
                    price: price,
                    delivery: deliveryMethodLabel
                });
                
                // Add your enrollment logic here
                // For example: redirect to checkout, open modal, etc.
                
                // Example: Show alert (replace with your actual enrollment flow)
                alert(`Enrolling in ${packageName} package with ${deliveryMethodLabel}`);
            });
        });
    }
    
    // =============================================
    // SMOOTH SCROLL (Optional Enhancement)
    // =============================================
    
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // =============================================
    // UTILITY: Get Package Data
    // =============================================
    
    function getPackageData(card) {
        const packageName = card.querySelector('.package-name').textContent;
        const price = card.querySelector('.price').textContent;
        const features = [];
        
        card.querySelectorAll('.feature-list li').forEach(feature => {
            features.push(feature.textContent.trim());
        });
        
        const deliveryMethod = card.querySelector('.delivery-options .form-check-input:checked');
        const deliveryMethodLabel = deliveryMethod ? deliveryMethod.nextElementSibling.textContent : null;
        
        return {
            package: packageName,
            price: price,
            features: features,
            delivery: deliveryMethodLabel
        };
    }
    
})();
