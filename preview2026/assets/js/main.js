/**
 * Main JavaScript for Academic Portfolio
 * Handles navigation, theme switching, and progressive enhancements
 */

(function() {
    'use strict';

    // ========================================
    // Theme Management
    // ========================================
    const ThemeManager = {
        STORAGE_KEY: 'preferred-theme',
        DARK: 'dark',
        LIGHT: 'light',
        
        init() {
            this.button = document.querySelector('.theme-toggle');
            if (!this.button) return;
            
            // Load saved theme or detect system preference
            const savedTheme = localStorage.getItem(this.STORAGE_KEY);
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (systemPrefersDark ? this.DARK : this.LIGHT);
            
            this.setTheme(theme);
            this.button.addEventListener('click', () => this.toggle());
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', (e) => {
                    if (!localStorage.getItem(this.STORAGE_KEY)) {
                        this.setTheme(e.matches ? this.DARK : this.LIGHT);
                    }
                });
        },
        
        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(this.STORAGE_KEY, theme);
            
            // Update meta theme color for mobile browsers
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.content = theme === this.DARK ? '#1A202C' : '#FFFFFF';
            }
        },
        
        toggle() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === this.DARK ? this.LIGHT : this.DARK;
            this.setTheme(next);
        }
    };

    // ========================================
    // Mobile Navigation
    // ========================================
    const Navigation = {
        init() {
            this.toggle = document.querySelector('.nav-toggle');
            this.menu = document.querySelector('.nav-menu');
            if (!this.toggle || !this.menu) return;
            
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                    this.closeMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeMenu();
            });
            
            // Highlight active page
            this.highlightActivePage();
        },
        
        toggleMenu() {
            const isOpen = this.menu.classList.toggle('active');
            this.toggle.setAttribute('aria-expanded', isOpen);
            
            // Animate hamburger to X
            if (isOpen) {
                this.toggle.classList.add('active');
            } else {
                this.toggle.classList.remove('active');
            }
        },
        
        closeMenu() {
            this.menu.classList.remove('active');
            this.toggle.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', false);
        },
        
        highlightActivePage() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const links = document.querySelectorAll('.nav-menu a');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    };

    // ========================================
    // Smooth Scroll
    // ========================================
    const SmoothScroll = {
        init() {
            // Handle anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const offset = 80; // Navigation height
                        const targetPosition = target.offsetTop - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ========================================
    // Lazy Loading
    // ========================================
    const LazyLoad = {
        init() {
            if ('IntersectionObserver' in window) {
                const images = document.querySelectorAll('img[loading="lazy"]');
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
                
                images.forEach(img => imageObserver.observe(img));
            }
        }
    };

    // ========================================
    // Animation on Scroll
    // ========================================
    const ScrollAnimations = {
        init() {
            if ('IntersectionObserver' in window) {
                const elements = document.querySelectorAll('.interest-card, .paper-card, .section');
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                        }
                    });
                }, {
                    threshold: 0.1
                });
                
                elements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(el);
                });
            }
        }
    };

    // ========================================
    // Form Handling (for contact page)
    // ========================================
    const Forms = {
        init() {
            const form = document.querySelector('.contact-form');
            if (!form) return;
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Here you would normally send the data to a server
                // For now, we'll create a mailto link
                const subject = encodeURIComponent(data.subject || 'Contact from Website');
                const body = encodeURIComponent(
                    `Name: ${data.name}\n` +
                    `Email: ${data.email}\n` +
                    `Message:\n${data.message}`
                );
                
                window.location.href = `mailto:ajoung@umich.edu?subject=${subject}&body=${body}`;
            });
        }
    };

    // ========================================
    // Accessibility Enhancements
    // ========================================
    const Accessibility = {
        init() {
            // Skip to main content
            this.addSkipLink();
            
            // Keyboard navigation indicators
            this.enhanceKeyboardNav();
        },
        
        addSkipLink() {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--color-primary);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                text-decoration: none;
                z-index: 10000;
                transition: top 0.2s;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '10px';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-100px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        },
        
        enhanceKeyboardNav() {
            // Add focus styles dynamically
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-nav');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-nav');
            });
        }
    };

    // Handle abstract/description toggles
document.querySelectorAll('.abstract-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const content = this.closest('article').querySelector('.paper-abstract-collapsible, .paper-description-collapsible');
        
        if (content) {
            if (isExpanded) {
                content.style.display = 'none';
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.toggle-text').textContent = this.querySelector('.toggle-text').textContent.replace('Hide', 'Show');
            } else {
                content.style.display = 'block';
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.toggle-text').textContent = this.querySelector('.toggle-text').textContent.replace('Show', 'Hide');
            }
            this.classList.toggle('expanded');
        }
    });
});

    // ========================================
    // Performance Monitoring
    // ========================================
    const Performance = {
        init() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                    }
                });
            }
        }
    };

    // ========================================
    // Initialize Everything
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        Navigation.init();
        SmoothScroll.init();
        LazyLoad.init();
        ScrollAnimations.init();
        Forms.init();
        Accessibility.init();
        Performance.init();
        
        // Add animate-in class to visible elements
        setTimeout(() => {
            document.querySelectorAll('.animate-in').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 100);
    });

    // ========================================
    // CSS for animations (inject if needed)
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-nav *:focus {
            outline: 2px solid var(--color-accent) !important;
            outline-offset: 2px !important;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);

})();
