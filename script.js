// Enhanced Navigation and Performance
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormHandling();
    initLazyLoading();
    initAccessibility();
    
    console.log('ACE Website Enhanced - All systems loaded! 🚀');
});

// Navigation Enhancement
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    

    // Enhanced mobile menu toggle
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Accessibility: Update aria-expanded
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced Scroll Effects
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    // Back to top button
    const backToTop = createBackToTopButton();
    
    // Throttled scroll handler for better performance
    let ticking = false;
    
    function updateScrollEffects() {
        const currentScrollY = window.scrollY;
        
        // Navbar background
        if (navbar) {
            navbar.style.background = currentScrollY > 100 
                ? 'rgba(10, 20, 40, 0.98)' 
                : 'rgba(10, 20, 40, 0.95)';
        }
        
        // Back to top button
        if (backToTop) {
            backToTop.classList.toggle('visible', currentScrollY > 300);
        }
        
        // Hide/show navbar on scroll (optional enhancement)
        if (Math.abs(currentScrollY - lastScrollY) > 5) {
            if (navbar) {
                navbar.style.transform = currentScrollY > lastScrollY && currentScrollY > 100
                    ? 'translateY(-100%)'
                    : 'translateY(0)';
            }
            lastScrollY = currentScrollY;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Create back to top button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    button.title = 'Back to top';
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    return button;
}

// Enhanced Animations with Intersection Observer
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for grid items
                if (entry.target.parentElement?.classList.contains('events-grid') ||
                    entry.target.parentElement?.classList.contains('team-grid')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const elementsToAnimate = document.querySelectorAll(
        '.mission-card, .event-card, .team-card, .gallery-item, .contact-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced typing effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        typeWriterEffect(heroTitle);
    }

    // Enhanced particle effect
    createParticles();
}

// Improved typing effect
function typeWriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '3px solid #3b82f6';
    
    let i = 0;
    const speed = 100;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    setTimeout(type, 1000);
}

// Enhanced Form Handling
function initFormHandling() {
    const contactForm = document.querySelector('.form');
    
    if (!contactForm) return;
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    contactForm.addEventListener('submit', handleFormSubmission);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const type = field.type;
    
    clearError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    formGroup?.classList.remove('error');
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup?.classList.add('error');
    
    let errorElement = formGroup?.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup?.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    const button = form.querySelector('.btn-primary');
    
    // Validate all fields
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) return;
    
    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.style.opacity = '0.7';
    button.style.pointerEvents = 'none';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success state
        button.textContent = 'Message Sent!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Reset form
        form.reset();
        
        // Show success notification
        showNotification('Message sent successfully!', 'success');
        
    } catch (error) {
        button.textContent = 'Error - Try Again';
        button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }, 3000);
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all images
    document.querySelectorAll('img').forEach(img => {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
    });
}

// Accessibility Enhancements
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #3b82f6;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.id = 'main-content';
        heroSection.setAttribute('tabindex', '-1');
    }
    
    // Enhance keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu?.classList.contains('active')) {
                hamburger?.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
}

// Enhanced Particle Effect
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = window.innerWidth < 768 ? 20 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        hero.appendChild(particle);
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = Math.random() * 3000 + 2000;
    const direction = Math.random() * 360;
    const distance = Math.random() * 100 + 50;
    
    particle.animate([
        { transform: 'translate(0, 0)', opacity: 0 },
        { opacity: 1 },
        { 
            transform: `translate(${Math.cos(direction) * distance}px, ${Math.sin(direction) * distance}px)`,
            opacity: 0 
        }
    ], {
        duration: duration,
        easing: 'ease-out',
        iterations: Infinity
    });
}

// Enhanced Gallery with Lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.gallery-overlay h3')?.textContent || '';
            const description = this.querySelector('.gallery-overlay p')?.textContent || '';
            
            showLightbox(img.src, title, description);
        });
    });
}

function showLightbox(src, title, description) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
        margin-bottom: 1rem;
    `;
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
        color: #3b82f6;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    `;
    
    const descElement = document.createElement('p');
    descElement.textContent = description;
    descElement.style.cssText = `
        color: #cbd5e1;
        font-size: 1rem;
    `;
    
    content.appendChild(img);
    if (title) content.appendChild(titleElement);
    if (description) content.appendChild(descElement);
    lightbox.appendChild(content);
    document.body.appendChild(lightbox);
    
    // Show lightbox with animation
    setTimeout(() => {
        lightbox.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Close handlers
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    function closeLightbox() {
        lightbox.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);

// Performance monitoring
window.ACE = {
    // Scroll to top function
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    getCurrentSection: function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section.getAttribute('id');
            }
        });
        
        return current;
    },
    
    theme: {
        current: 'dark',
        toggle: function() {
            console.log('Theme toggle feature coming soon!');
        }
    },
    
    // New performance utilities
    performance: {
        measurePageLoad: function() {
            window.addEventListener('load', function() {
                const loadTime = performance.now();
                console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            });
        }
    }
};

// Initialize performance monitoring
ACE.performance.measurePageLoad();
