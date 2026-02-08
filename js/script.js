/**
 * StyleWeave - JavaScript functionality
 * Features: Dark mode toggle, favorite button interactions, smooth animations
 */

// ========================================
// THEME MANAGEMENT
// ========================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    init() {
        // Apply stored theme on load
        this.applyTheme(this.currentTheme);
        
        // Add event listener to theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    getStoredTheme() {
        return localStorage.getItem('styleweave-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('styleweave-theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add a subtle animation feedback
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
}

// ========================================
// FAVORITE BUTTONS
// ========================================

class FavoriteManager {
    constructor() {
        this.favorites = this.getStoredFavorites();
        this.init();
    }

    init() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        
        favoriteButtons.forEach((btn, index) => {
            // Restore favorite state from storage
            if (this.favorites.includes(index)) {
                btn.classList.add('active');
            }
            
            // Add click event listener
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                this.toggleFavorite(btn, index);
            });
        });
    }

    getStoredFavorites() {
        const stored = localStorage.getItem('styleweave-favorites');
        return stored ? JSON.parse(stored) : [];
    }

    setStoredFavorites() {
        localStorage.setItem('styleweave-favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(button, productIndex) {
        const isActive = button.classList.contains('active');
        
        if (isActive) {
            // Remove from favorites
            button.classList.remove('active');
            this.favorites = this.favorites.filter(id => id !== productIndex);
            this.animateButton(button, 'remove');
        } else {
            // Add to favorites
            button.classList.add('active');
            this.favorites.push(productIndex);
            this.animateButton(button, 'add');
        }
        
        this.setStoredFavorites();
    }

    animateButton(button, action) {
        // Create a heart burst animation effect
        if (action === 'add') {
            button.style.animation = 'heartBurst 0.4s ease-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 400);
        }
    }
}

// ========================================
// PRODUCT CARD INTERACTIONS
// ========================================

class ProductInteractions {
    constructor() {
        this.init();
    }

    init() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            // Add hover effect for image zoom
            card.addEventListener('mouseenter', () => {
                this.onCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.onCardHover(card, false);
            });
            
            // Add click handler (can be extended for product details)
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on favorite button
                if (!e.target.closest('.favorite-btn')) {
                    this.onCardClick(card);
                }
            });
        });
    }

    onCardHover(card, isHovering) {
        const image = card.querySelector('.product-image');
        if (image) {
            // Additional hover effects can be added here
        }
    }

    onCardClick(card) {
        const productName = card.querySelector('.product-name').textContent;
        console.log(`Product clicked: ${productName}`);
        
        // Add ripple effect
        this.createRipple(card);
        
        // Future: Navigate to product detail page or open modal
    }

    createRipple(card) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(0, 0, 0, 0.1)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// LAZY LOADING IMAGES
// ========================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('.product-image');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Add loaded class for fade-in effect
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new ThemeManager();
    new FavoriteManager();
    new ProductInteractions();
    new SmoothScroll();
    new LazyLoader();
    
    console.log('✨ StyleWeave initialized successfully!');
});

// ========================================
// ADDITIONAL CSS ANIMATIONS (injected dynamically)
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes heartBurst {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    @keyframes rippleEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.5;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
