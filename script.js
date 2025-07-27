// Enhanced Portfolio JavaScript with Zoom-Responsive Features and Modern Animations
class PortfolioManager {
    constructor() {
        this.isInitialized = false;
        this.observers = new Map();
        this.themeChangeCallbacks = new Set();
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializePortfolio());
        } else {
            this.initializePortfolio();
        }
    }

    initializePortfolio() {
        if (this.isInitialized) return;
        
        try {
            this.setupThemeToggle();
            this.setupNavigation();
            this.setupAnimations();
            this.setupContactForm();
            this.setupScrollEffects();
            this.setupPerformanceOptimizations();
            this.setupResponsiveFeatures();
            this.setupAccessibilityFeatures();
            
            this.isInitialized = true;
            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }

    // Enhanced Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Initialize theme with improved detection
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemTheme = prefersDark.matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;
        
        this.setTheme(initialTheme);
        
        // Theme toggle click handler with enhanced animation
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
            
            // Add enhanced click animation
            themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 200);
        });

        // Listen for system theme changes
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        try {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            
            const themeIcon = document.querySelector('#themeToggle i');
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Notify all theme change callbacks
            this.themeChangeCallbacks.forEach(callback => {
                try {
                    callback(theme);
                } catch (error) {
                    console.error('Theme change callback error:', error);
                }
            });
            
            // Dispatch custom event for theme change
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme } 
            }));
            
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    }

    // Enhanced Navigation with Better Performance
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navbar) {
            console.warn('Navbar not found');
            return;
        }

        // Enhanced hamburger menu toggle with animation and accessibility
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = hamburger.classList.contains('active');
                
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is open on mobile
                if (window.innerWidth <= 768) {
                    document.body.style.overflow = isActive ? '' : 'hidden';
                }
                
                // Add ARIA attributes for accessibility
                hamburger.setAttribute('aria-expanded', !isActive);
                hamburger.setAttribute('aria-label', isActive ? 'Open menu' : 'Close menu');
                navMenu.setAttribute('aria-hidden', isActive);
            });
        }

        // Close menu when clicking on links or outside
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.setAttribute('aria-label', 'Open menu');
                    navMenu.setAttribute('aria-hidden', 'true');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });

        // Enhanced navbar scroll effects with throttling
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Active nav link highlighting with intersection observer
        this.setupActiveNavTracking();
    }

    setupActiveNavTracking() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => navObserver.observe(section));
        this.observers.set('nav', navObserver);
    }

    // Enhanced Animations with Better Performance
    setupAnimations() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0,
                useClassNames: true,
                disableMutationObserver: true
            });
        }

        // Enhanced typing effect for hero section
        this.setupTypingEffect();
        
        // Counter animations for stats
        this.setupCounterAnimations();
        
        // Smooth reveal animations
        this.setupRevealAnimations();
        
        // Hero entrance animations
        this.setupHeroAnimations();
    }

    setupHeroAnimations() {
        const heroElements = document.querySelectorAll(
            '.hero-title .greeting, .hero-title .name, .hero-title .role, .hero-description, .hero-buttons'
        );
        
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }

    setupTypingEffect() {
        const roleElement = document.querySelector('.hero-title .role');
        if (!roleElement) return;

        const roles = [
            'DevOps Engineer',
            'Backend Specialist', 
            'Full Stack Developer',
            'Cloud Architect',
            'System Administrator'
        ];
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;

        const typeSpeed = 80;
        const deleteSpeed = 40;
        const waitTime = 2500;

        const type = () => {
            if (isWaiting) return;
            
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                roleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(type, 500);
                    return;
                }
            } else {
                roleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentRole.length) {
                    isDeleting = true;
                    isWaiting = true;
                    setTimeout(() => {
                        isWaiting = false;
                        type();
                    }, waitTime);
                    return;
                }
            }
            
            setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
        };

        // Start typing effect after initial delay
        setTimeout(type, 2000);
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-item h3, [data-counter]');
        
        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                    this.animateCounter(entry.target);
                    entry.target.setAttribute('data-counted', 'true');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
        this.observers.set('counter', counterObserver);
    }

    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d/g, '');
        
        if (isNaN(number)) return;
        
        const duration = 2000;
        const steps = 60;
        const stepValue = number / steps;
        const stepTime = duration / steps;
        
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(stepValue * step), number);
            element.textContent = current + suffix;
            
            if (current >= number) {
                clearInterval(timer);
                element.textContent = number + suffix;
            }
        }, stepTime);
    }

    setupRevealAnimations() {
        const revealElements = document.querySelectorAll(
            '.skill-category, .project-card, .timeline-item, .certification-card'
        );
        
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            revealObserver.observe(element);
        });

        this.observers.set('reveal', revealObserver);
    }

    // Enhanced Contact Form with Better Validation and WhatsApp Integration
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) {
            console.warn('Contact form not found');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerHTML;
            
            // Validate form before submission
            if (!this.validateForm(form)) {
                this.showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Get form data with validation
                const formData = new FormData(form);
                const name = formData.get('name')?.toString().trim() || '';
                const email = formData.get('email')?.toString().trim() || '';
                const message = formData.get('message')?.toString().trim() || '';
                
                if (!name || !email || !message) {
                    throw new Error('Missing required fields');
                }
                
                // Send to WhatsApp
                await this.sendToWhatsApp(name, email, message);
                
                // Success state
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'var(--gradient-success)';
                
                // Reset form
                form.reset();
                this.clearAllFieldErrors(form);
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
            } catch (error) {
                console.error('Contact form error:', error);
                
                // Error state
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
                submitBtn.style.background = 'var(--error-color)';
                this.showNotification('Failed to send message. Please try again or contact me directly.', 'error');
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });

        // Real-time form validation
        this.setupFormValidation(form);
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                if (input.value.trim() || input.hasAttribute('required')) {
                    this.validateField(input);
                }
            });
            
            // Clear errors on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Skip validation if field is empty and not required
        if (!value && !field.hasAttribute('required')) {
            return true;
        }

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = 'Please enter a valid email address';
                break;
                
            case 'text':
                if (field.name === 'name') {
                    isValid = value.length >= 2 && /^[a-zA-Z\s\-'\.]+$/.test(value);
                    message = 'Name must be at least 2 characters and contain only letters, spaces, hyphens, apostrophes, and periods';
                } else {
                    isValid = value.length >= 2;
                    message = 'This field must be at least 2 characters';
                }
                break;
                
            default:
                if (field.tagName === 'TEXTAREA') {
                    isValid = value.length >= 10;
                    message = 'Message must be at least 10 characters';
                } else {
                    isValid = value.length > 0;
                    message = 'This field is required';
                }
        }

        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error-color)';
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id || field.name}-error`);
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.id = `${field.id || field.name}-error`;
            errorElement.setAttribute('role', 'alert');
            errorElement.style.cssText = `
                color: var(--error-color);
                font-size: clamp(0.75rem, 1.5vw, 0.875rem);
                margin-top: var(--space-xs);
                display: block;
                animation: slideInUp 0.3s ease;
            `;
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearAllFieldErrors(form) {
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        });
    }

    async sendToWhatsApp(name, email, message) {
        return new Promise((resolve, reject) => {
            try {
                // Replace with your actual WhatsApp number
                const phoneNumber = "919876543210";
                const timestamp = new Date().toLocaleString();
                
                const whatsappMessage = encodeURIComponent(
                    `🔥 *New Portfolio Contact* 🔥\n\n` +
                    `👤 *Name:* ${name}\n` +
                    `📧 *Email:* ${email}\n` +
                    `💬 *Message:* ${message}\n\n` +
                    `🕒 *Time:* ${timestamp}\n` +
                    `🌐 *Source:* Portfolio Website`
                );
                
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
                
                // Open WhatsApp in new tab
                const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
                
                if (newWindow) {
                    // Success - window opened
                    setTimeout(() => resolve(), 1000);
                } else {
                    // Popup blocked or failed
                    throw new Error('Failed to open WhatsApp');
                }
                
            } catch (error) {
                reject(error);
            }
        });
    }

    // Enhanced Scroll Effects
    setupScrollEffects() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;
            
            e.preventDefault();
            const targetId = target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });

        // Scroll to top button
        this.createScrollToTopButton();
        
        // Parallax effects for hero section (disabled on mobile for performance)
        if (window.innerWidth > 768) {
            this.setupParallaxEffects();
        }
    }

    createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: var(--space-xl);
            right: var(--space-xl);
            width: clamp(3rem, 5vw, 3.5rem);
            height: clamp(3rem, 5vw, 3.5rem);
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
            z-index: 1000;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(1rem, 2vw, 1.25rem);
        `;

        document.body.appendChild(scrollBtn);

        let ticking = false;
        const updateScrollButton = () => {
            const shouldShow = window.pageYOffset > 500;
            
            if (shouldShow) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
            
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupParallaxEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let ticking = false;
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.setupIntersectionObservers();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });

        this.observers.set('images', imageObserver);
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/resume.pdf',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.pdf') ? 'document' : 'style';
            link.onload = () => console.log(`Preloaded: ${resource}`);
            link.onerror = () => console.warn(`Failed to preload: ${resource}`);
            document.head.appendChild(link);
        });
    }

    setupIntersectionObservers() {
        // Optimize observer performance
        const observerOptions = {
            rootMargin: '50px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                } else {
                    entry.target.classList.remove('in-viewport');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('[data-aos], .skill-category, .project-card');
        animatedElements.forEach(el => performanceObserver.observe(el));
        this.observers.set('performance', performanceObserver);
    }

    // Responsive Features
    setupResponsiveFeatures() {
        this.handleViewportChanges();
        this.setupTouchGestures();
        this.setupKeyboardNavigation();
    }

    handleViewportChanges() {
        const updateViewport = () => {
            // Update CSS custom property for viewport height
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            
            // Handle orientation changes
            if (window.innerHeight < window.innerWidth) {
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            } else {
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            }
            
            // Re-enable parallax on larger screens
            if (window.innerWidth > 768 && !this.parallaxEnabled) {
                this.setupParallaxEffects();
                this.parallaxEnabled = true;
            }
        };

        updateViewport();
        window.addEventListener('resize', this.debounce(updateViewport, 250));
        window.addEventListener('orientationchange', updateViewport);
    }

    setupTouchGestures() {
        // Add touch-friendly interactions
        const touchElements = document.querySelectorAll('.btn, .nav-link, .skill-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu on escape
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('navMenu');
                
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Accessibility Features
    setupAccessibilityFeatures() {
        // Add skip link
        this.addSkipLink();
        
        // Enhanced focus management
        this.setupFocusManagement();
        
        // Add reduced motion support
        this.handleReducedMotion();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1002;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;
        
        const focusableElements = navMenu.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }

    // Utility Functions
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Enhanced Notification System
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.style.cssText = `
            position: fixed;
            top: var(--space-xl);
            right: var(--space-xl);
            background: ${colors[type] || colors.info};
            color: white;
            padding: var(--space-lg) var(--space-xl);
            border-radius: 0.75rem;
            box-shadow: var(--shadow-xl);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            max-width: min(400px, 90vw);
            font-weight: 500;
            font-size: clamp(0.875rem, 1.5vw, 1rem);
        `;

        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
                font-size: 1.2rem;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            " aria-label="Close notification" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'" onmouseout="this.style.backgroundColor='transparent'">×</button>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);

        return notification;
    }

    // Cleanup method
    destroy() {
        // Clean up all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Clear theme change callbacks
        this.themeChangeCallbacks.clear();
        
        // Remove scroll to top button
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (scrollBtn) {
            scrollBtn.remove();
        }
        
        console.log('Portfolio manager destroyed');
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();
});

// Service Worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Portfolio error:', event.error);
    // Show user-friendly error message for critical errors
    if (window.portfolioManager) {
        window.portfolioManager.showNotification('Something went wrong. Please refresh the page.', 'error');
    }
});

// Export for testing and external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioManager;
}
