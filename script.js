// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    setupSmoothScrolling();
    setupMobileMenu();
    setupHeaderScroll();
    setupContactForm();
    setupAnimations();
    setupAccessibility();
    setupVideoPlayer();
}

// Smooth Scrolling Navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const header = document.querySelector('.modern-header') || document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Mobile Menu Functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = nav.classList.contains('mobile-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('mobile-open') && 
                !mobileMenuBtn.contains(e.target) && 
                !nav.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
        
        // Close menu when nav links are clicked
        const navLinks = nav.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }
    
    function openMobileMenu() {
        nav.classList.add('mobile-open');
        mobileMenuBtn.classList.add('active');
        if (header) header.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const nav = document.getElementById('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const header = document.getElementById('header');
    
    if (nav && mobileMenuBtn) {
        nav.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
        header.classList.remove('mobile-menu-open');
        document.body.style.overflow = ''; // Restore body scroll
    }
}

// Header Scroll Effects
function setupHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(this)) {
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message')
            };
            
            // Send via WhatsApp
            sendWhatsAppMessage(data);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Special handling for select elements
            if (input.tagName === 'SELECT') {
                // Initialize state
                input.classList.toggle('has-value', input.value !== '');
                
                input.addEventListener('change', function() {
                    // Force label position update for select
                    this.classList.toggle('has-value', this.value !== '');
                });
            }
        });
    }
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error
    removeFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validation Helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// WhatsApp Message Sender
function sendWhatsAppMessage(data) {
    const whatsappNumber = '919544228686';

    // Ensure values are strings
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();
    const email = (data.email || '').trim();
    const serviceKey = (data.service || '').trim();
    const messageText = (data.message || '').trim();

    // Map select values to readable labels
    const serviceMap = {
        electrical: 'Electrical Supplies',
        plumbing: 'Plumbing Supplies',
        both: 'Both Supplies',
        bulk: 'Bulk Orders'
    };
    const serviceLabel = serviceMap[serviceKey] || serviceKey || 'Not specified';

    // Construct message
    let message = `New enquiry from BuildX website\n\n`;
    if (name) message += `Name: ${name}\n`;
    if (phone) message += `Phone: ${phone}\n`;
    if (email) message += `Email: ${email}\n`;
    message += `Product Needed: ${serviceLabel}\n\n`;
    if (messageText) {
        message += `Details:\n${messageText}\n\n`;
    }
    message += `Sent: ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);

    // Use the API endpoint which is generally more reliable across platforms
    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    // Show loading state on submit button
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : null;
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
    }

    // Small delay to allow UX transition
    setTimeout(() => {
        // Try opening in a new tab/window; fallback to redirect if blocked
        const newWindow = window.open(whatsappURL, '_blank');
        if (!newWindow) {
            // Popup blocked, redirect current tab (safer on mobile)
            window.location.href = whatsappURL;
        }

        // Notify user and reset form locally
        showNotification('Opening WhatsApp with your message...', 'success');
        const form = document.getElementById('contactForm');
        if (form) form.reset();

        // Restore submit button
        if (submitBtn && originalText !== null) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 700);
}

// Simple Animations (No Delays)
function setupAnimations() {
    // Simple hover effects only - no scroll animations with delays
    const cards = document.querySelectorAll('.service-card, .service-card-simple, .contact-item, .hero-card');
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
}

// Accessibility Features
function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-navy);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Focus management for mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        font-size: 1.2rem;
    `;
    
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(notificationStyles);

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Mobile-specific enhancements
function setupMobileEnhancements() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouchDevice) {
        document.body.classList.add('mobile-device');
        
        // Optimize scrolling performance
        setupMobileScrolling();
        
        // Handle orientation changes
        setupOrientationHandler();
        
        // Improve touch interactions
        setupTouchInteractions();
        
        // Mobile form enhancements
        setupMobileFormEnhancements();
        
        // Prevent zoom on double tap
        preventDoubleTabZoom();
    }
    
    // Handle viewport height changes (iOS Safari)
    setupViewportHandler();
}

// Mobile scrolling optimizations
function setupMobileScrolling() {
    let ticking = false;
    
    function updateScrollPosition() {
        const scrollTop = window.pageYOffset;
        const header = document.getElementById('header');
        
        // Hide/show header on scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }, { passive: true });
}

// Handle orientation changes
function setupOrientationHandler() {
    window.addEventListener('orientationchange', function() {
        // Close mobile menu on orientation change
        setTimeout(closeMobileMenu, 100);
        
        // Recalculate viewport height
        setTimeout(updateViewportHeight, 500);
    });
}

// Touch interaction improvements
function setupTouchInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .service-item, .value-item');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => this.classList.remove('touch-active'), 150);
        }, { passive: true });
        
        button.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Improve service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-2px)';
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    });
}

// Mobile form enhancements
function setupMobileFormEnhancements() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Prevent zoom on focus for iOS
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                this.style.fontSize = '16px';
            }
        });
        
        // Add floating label effect
        if (input.type !== 'submit' && input.tagName !== 'SELECT') {
            addFloatingLabel(input);
        }
        
        // Auto-resize textarea
        if (input.tagName === 'TEXTAREA') {
            input.addEventListener('input', autoResizeTextarea);
        }
    });
}

// Floating label functionality
function addFloatingLabel(input) {
    const label = input.parentNode.querySelector('label');
    if (!label) return;
    
    function updateLabel() {
        if (input.value || input === document.activeElement) {
            label.classList.add('floating');
        } else {
            label.classList.remove('floating');
        }
    }
    
    input.addEventListener('focus', updateLabel);
    input.addEventListener('blur', updateLabel);
    input.addEventListener('input', updateLabel);
    
    // Initial state
    updateLabel();
}

// Auto-resize textarea
function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

// Prevent double-tap zoom
function preventDoubleTabZoom() {
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Handle viewport height changes (iOS Safari address bar)
function setupViewportHandler() {
    updateViewportHeight();
    window.addEventListener('resize', debounce(updateViewportHeight, 100));
}

function updateViewportHeight() {
    // Set CSS custom property for viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update mobile menu height if needed
    const nav = document.getElementById('nav');
    if (nav && nav.classList.contains('mobile-open')) {
        nav.style.height = `${window.innerHeight}px`;
    }
}

// Enhanced mobile menu functionality
function setupEnhancedMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    
    if (!mobileMenuBtn || !nav) return;
    
    // Add swipe to close functionality
    let startY = 0;
    let startX = 0;
    
    nav.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    nav.addEventListener('touchmove', function(e) {
        if (!nav.classList.contains('mobile-open')) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = startY - currentY;
        const diffX = startX - currentX;
        
        // Close menu on swipe up or right
        if (diffY > 50 || diffX < -50) {
            closeMobileMenu();
        }
    }, { passive: true });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
            closeMobileMenu();
        }
    });
    
    // Trap focus in mobile menu
    const navLinks = nav.querySelectorAll('.nav-link');
    const firstLink = navLinks[0];
    const lastLink = navLinks[navLinks.length - 1];
    
    nav.addEventListener('keydown', function(e) {
        if (!nav.classList.contains('mobile-open')) return;
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstLink) {
                    e.preventDefault();
                    lastLink.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastLink) {
                    e.preventDefault();
                    firstLink.focus();
                }
            }
        }
    });
}

// Enhanced sticky call button
function setupEnhancedStickyButton() {
    const stickyBtn = document.querySelector('.sticky-call-btn');
    if (!stickyBtn) return;
    
    let isVisible = false;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', debounce(function() {
        const scrollTop = window.pageYOffset;
        const shouldShow = scrollTop > 300 && window.innerWidth <= 768;
        
        if (shouldShow && !isVisible) {
            stickyBtn.style.transform = 'translateY(0)';
            stickyBtn.style.opacity = '1';
            isVisible = true;
        } else if (!shouldShow && isVisible) {
            stickyBtn.style.transform = 'translateY(100px)';
            stickyBtn.style.opacity = '0';
            isVisible = false;
        }
        
        lastScrollTop = scrollTop;
    }, 10), { passive: true });
    
    // Add pulse animation when first shown
    const callBtn = stickyBtn.querySelector('.call-btn');
    let hasAnimated = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                callBtn.style.animation = 'pulse 1s ease-in-out 3';
                hasAnimated = true;
                setTimeout(() => {
                    callBtn.style.animation = 'pulse 2s infinite';
                }, 3000);
            }
        });
    });
    
    observer.observe(stickyBtn);
}

// Add CSS for mobile enhancements
function addMobileCSS() {
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        .mobile-device .touch-active {
            transform: scale(0.95);
            opacity: 0.8;
            transition: all 0.1s ease;
        }
        
        .mobile-device .floating {
            transform: translateY(-12px) scale(0.85);
            color: var(--primary-navy);
        }
        
        .sticky-call-btn {
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 768px) {
            .nav {
                height: calc(var(--vh, 1vh) * 100);
            }
            
            .form-group label.floating {
                transform: translateY(-20px) scale(0.85);
                background: var(--white);
                padding: 0 4px;
                border-radius: 2px;
            }
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
            .hero {
                min-height: calc(var(--vh, 1vh) * 100 - 80px);
            }
            
            .sticky-call-btn {
                bottom: calc(20px + env(safe-area-inset-bottom));
            }
        }
    `;
    document.head.appendChild(mobileStyles);
}

// Video Player Setup
function setupVideoPlayer() {
    const video = document.querySelector('.main-video');
    const placeholder = document.querySelector('.video-placeholder');
    
    if (!video || !placeholder) return;
    
    // Hide placeholder when video starts playing
    video.addEventListener('play', function() {
        placeholder.style.display = 'none';
    });
    
    // Show placeholder when video is paused or ended
    video.addEventListener('pause', function() {
        placeholder.style.display = 'flex';
    });
    
    video.addEventListener('ended', function() {
        placeholder.style.display = 'flex';
    });
    
    // Click on placeholder to play video
    placeholder.addEventListener('click', function() {
        video.play();
    });
    
    // Keyboard accessibility
    placeholder.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            video.play();
        }
    });
}

// Update the main initialization function
const originalInitializeApp = initializeApp;
initializeApp = function() {
    originalInitializeApp();
    setupVideoPlayer();
    setupMobileEnhancements();
    setupEnhancedMobileMenu();
    setupEnhancedStickyButton();
    addMobileCSS();
};
