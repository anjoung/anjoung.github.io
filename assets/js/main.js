/**
 * Main JavaScript for Academic Portfolio
 * Handles navigation, smooth scroll, accessibility, and lazy loading
 */

(function() {
    'use strict';

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
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const offset = 80;
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
    // Accessibility Enhancements
    // ========================================
    const Accessibility = {
        init() {
            this.addSkipLink();
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

    // ========================================
    // Initialize
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
        SmoothScroll.init();
        LazyLoad.init();
        Accessibility.init();
    });

    // ========================================
    // Injected styles for keyboard navigation
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-nav *:focus {
            outline: 2px solid var(--color-primary) !important;
            outline-offset: 2px !important;
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
