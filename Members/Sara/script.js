// Global variables
let cart = JSON.parse(localStorage.getItem('kuromiCart')) || [];
let searchOpen = false;
let cartOpen = false;

// Enhanced product database with full details
const enhancedProducts = {
    1: {
        id: 1,
        name: "Kuromi Gothic Hoodie",
        price: 39.99,
        originalPrice: 55.99,
        image: "",
        images: [],
        badge: "SALE",
        category: "clothing",
        description: "Embrace your mischievous side with this premium gothic hoodie featuring Kuromi's signature style. Made from ultra-soft cotton blend with a cozy fleece interior.",
        features: ["100% Cotton Blend", "Fleece-lined Interior", "Embroidered Details", "Kangaroo Pocket", "Unisex Fit"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Purple", "Pink"],
        stock: 15,
        rating: 4.8,
        reviews: 124
    },
    2: {
        id: 2,
        name: "Gothic Lolita Dress",
        price: 129.99,
        image: "",
        images: [],
        badge: "NEW",
        category: "clothing",
        description: "Stunning gothic lolita dress with intricate lace details and a rebellious kawaii aesthetic. Perfect for special occasions or daily mischief.",
        features: ["Premium Lace Fabric", "Fitted Bodice", "Flared Skirt", "Hidden Back Zipper", "Gothic Accessories Included"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Deep Purple"],
        stock: 8,
        rating: 4.9,
        reviews: 67
    },
    3: {
        id: 3,
        name: "Mischief Crop Top",
        price: 24.99,
        image: "",
        images: [],
        category: "clothing",
        description: "Show off your rebellious style with this cute yet edgy crop top featuring Kuromi's devil horn motif.",
        features: ["Soft Cotton Blend", "Stretch Fabric", "Machine Washable", "Graphic Print"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "White", "Pink"],
        stock: 23,
        rating: 4.7,
        reviews: 89
    },
    4: {
        id: 4,
        name: "Devil Horn Headband",
        price: 19.99,
        originalPrice: 29.99,
        image: "",
        images: [],
        badge: "SALE",
        category: "accessories",
        description: "Complete your mischievous look with this adorable devil horn headband. Comfortable and adjustable for all-day wear.",
        features: ["Adjustable Fit", "Soft Padding", "Durable Materials", "Lightweight Design"],
        colors: ["Black", "Purple", "Pink"],
        stock: 31,
        rating: 4.6,
        reviews: 156
    },
    5: {
        id: 5,
        name: "Gothic Choker Set",
        price: 35.99,
        image: "",
        images: [],
        category: "accessories",
        description: "Elegant gothic choker set with multiple pieces to mix and match. Perfect for creating your unique dark kawaii style.",
        features: ["3-Piece Set", "Adjustable Length", "Hypoallergenic Materials", "Gothic Charms"],
        colors: ["Black", "Silver", "Rose Gold"],
        stock: 18,
        rating: 4.8,
        reviews: 94
    }
};

// Sample limited edition products (keeping for compatibility)
const limitedProducts = [
    enhancedProducts[1],
    enhancedProducts[2],
    enhancedProducts[3]
];

// Add professional card animations
function animateCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 100);
    });
}

// Product Modal Functionality
function openProductModal(productId) {
    const product = enhancedProducts[productId];
    if (!product) return;

    const modal = createProductModal(product);
    document.body.appendChild(modal);

    // Trigger modal appearance
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Setup modal interactions
    setupModalInteractions(modal, product);
}

function createProductModal(product) {
    const isInWishlist = wishlist.includes(product.id);
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-header">
                <h2 style="color: #ffffff; margin: 0;">${product.name}</h2>
                <button class="modal-close-btn">&times;</button>
            </div>
            <div class="product-modal-body">
                <div class="product-image-zoom">
                    ${product.image && product.image.trim() !== '' ? `
                        <div class="zoom-container" data-zoom="false">
                            <img src="${product.image}"
                                 alt="${product.name}"
                                 class="product-main-image"
                                 onerror="this.parentElement.parentElement.innerHTML = createModalImagePlaceholder('${product.category || 'Kawaii'}');">
                        </div>
                    ` : createModalImagePlaceholder(product.category || 'Kawaii')}
                </div>

                <div class="product-details">
                    <h1 class="product-modal-title">${product.name}</h1>

                    ${product.rating ? `
                        <div class="product-modal-rating">
                            <div class="modal-rating-stars">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            <span class="modal-rating-count">(${product.reviews || 0} reviews)</span>
                        </div>
                    ` : ''}

                    <div class="product-modal-price">
                        <span class="modal-current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `
                            <span class="modal-original-price">$${product.originalPrice.toFixed(2)}</span>
                            <span class="modal-discount-badge">-${discountPercent}%</span>
                        ` : ''}
                    </div>

                    ${product.stock !== undefined ? `
                        <div class="modal-stock-status ${getStockStatus(product.stock).class}">
                            <div class="stock-indicator"></div>
                            ${getStockStatus(product.stock).text}
                        </div>
                    ` : ''}

                    ${product.description ? `
                        <div class="product-description">
                            <h3 class="description-title">Description</h3>
                            <p class="description-text">${product.description}</p>
                        </div>
                    ` : ''}

                    ${product.features ? `
                        <div class="product-features">
                            <h3 class="description-title">Features</h3>
                            <ul class="features-list">
                                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${product.sizes || product.colors ? `
                        <div class="product-options">
                            ${product.sizes ? `
                                <div class="option-group">
                                    <label class="option-label">Size:</label>
                                    <div class="option-buttons" data-option="size">
                                        ${product.sizes.map(size => `
                                            <button class="option-btn" data-value="${size}">${size}</button>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            ${product.colors ? `
                                <div class="option-group">
                                    <label class="option-label">Color:</label>
                                    <div class="option-buttons" data-option="color">
                                        ${product.colors.map(color => `
                                            <button class="option-btn" data-value="${color}">${color}</button>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <div class="modal-actions">
                        <button class="modal-add-to-cart" data-product-id="${product.id}">
                            Add to Bag - $${product.price.toFixed(2)}
                        </button>
                        <button class="modal-wishlist-btn ${isInWishlist ? 'active' : ''}" data-product-id="${product.id}">
                            ${isInWishlist ? '♥' : '♡'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function createModalImagePlaceholder(category) {
    return `
        <div class="modal-image-placeholder">
            <div class="placeholder-icon">🎀</div>
            <div class="placeholder-text">Image Coming Soon</div>
            <div class="placeholder-subtext">Premium ${category} item</div>
        </div>
    `;
}

function setupModalInteractions(modal, product) {
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => closeProductModal(modal));

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProductModal(modal);
        }
    });

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeProductModal(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Image zoom functionality
    const zoomContainer = modal.querySelector('.zoom-container');
    if (zoomContainer) {
        setupImageZoom(zoomContainer);
    }

    // Option selection functionality
    const optionButtons = modal.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.option-buttons');
            group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Add to cart functionality
    const addToCartBtn = modal.querySelector('.modal-add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        addToCart(product.id);
        showNotification(`${product.name} added to cart!`);
    });

    // Wishlist functionality
    const wishlistBtn = modal.querySelector('.modal-wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
        const wasAdded = toggleWishlist(product.id);
        wishlistBtn.classList.toggle('active', wasAdded);
        wishlistBtn.textContent = wasAdded ? '♥' : '♡';
        showNotification(wasAdded ? `${product.name} added to wishlist!` : `${product.name} removed from wishlist!`);
    });
}

function setupImageZoom(container) {
    const image = container.querySelector('.product-main-image');
    let isZooming = false;

    container.addEventListener('click', () => {
        isZooming = !isZooming;
        container.classList.toggle('zooming', isZooming);
        container.dataset.zoom = isZooming;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isZooming) return;

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        container.style.setProperty('--zoom-x', `${x}%`);
        container.style.setProperty('--zoom-y', `${y}%`);
    });

    container.addEventListener('mouseleave', () => {
        if (isZooming) {
            isZooming = false;
            container.classList.remove('zooming');
            container.dataset.zoom = 'false';
        }
    });
}

function closeProductModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    loadLimitedProducts();
    updateCartUI();

    // Add smooth entrance animations
    setTimeout(() => {
        animateCards();
    }, 100);
});

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'linear-gradient(45deg, #22c55e, #4ade80)' : 'linear-gradient(45deg, #ef4444, #f87171)',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '0.9rem',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        zIndex: '10002',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced Wishlist Effects
function createWishlistParticles(button) {
    const particles = document.createElement('div');
    particles.className = 'wishlist-particles';

    // Create 8 particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'wishlist-particle';
        particles.appendChild(particle);
    }

    button.appendChild(particles);

    // Remove particles after animation
    setTimeout(() => {
        if (particles.parentNode) {
            particles.parentNode.removeChild(particles);
        }
    }, 1000);
}

function updateWishlistCounter() {
    // Update navigation wishlist counter with enhanced animation
    const navCounter = document.getElementById('wishlistNavCount');
    if (navCounter) {
        const prevCount = parseInt(navCounter.textContent) || 0;
        const newCount = wishlist.length;

        if (newCount !== prevCount) {
            navCounter.textContent = newCount;

            if (newCount > 0) {
                navCounter.style.display = 'flex';
                if (newCount > prevCount) {
                    // Animate counter increase
                    navCounter.classList.add('show');
                    navCounter.style.animation = 'counterBounce 0.6s ease-out';
                }
            } else {
                navCounter.style.display = 'none';
            }
        }
    }

    // Update individual wishlist buttons with counters
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        updateButtonCounter(btn);
    });
}

function updateButtonCounter(button) {
    const productId = parseInt(button.dataset.productId);
    const isInWishlist = wishlist.includes(productId);

    // Remove existing counter
    const existingCounter = button.querySelector('.wishlist-counter');
    if (existingCounter) {
        existingCounter.remove();
    }

    // Add counter if item is in wishlist
    if (isInWishlist) {
        const counter = document.createElement('div');
        counter.className = 'wishlist-counter show';
        counter.textContent = '♥';
        button.appendChild(counter);
    }
}

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

function initializeWebsite() {
    // Add loading class to elements that need smooth entry
    const elementsToAnimate = document.querySelectorAll('.category-card, .product-card, .review-bubble');
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Initialize sparkle animations
    initializeSparkles();
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on nav links
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
    }

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');

    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }

    if (searchSubmit) {
        searchSubmit.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }

    // Language selector
    const langBtn = document.getElementById('langBtn');
    const langOptions = document.querySelectorAll('.lang-option');

    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            selectLanguage(option.dataset.lang);
        });
    });

    // Wishlist functionality
    const wishlistNavBtn = document.getElementById('wishlistNavBtn');

    if (wishlistNavBtn) {
        wishlistNavBtn.addEventListener('click', openWishlistModal);
    }

    // Wishlist heart buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            const wasAdded = toggleWishlist(productId);
            const product = enhancedProducts[productId];
            if (product) {
                showNotification(
                    wasAdded
                        ? `${product.name} added to wishlist!`
                        : `${product.name} removed from wishlist!`
                );
            }
        });
    });

    // Initialize wishlist UI
    updateWishlistUI();

    // Order tracking functionality
    const orderTrackingNav = document.getElementById('orderTrackingNav');
    if (orderTrackingNav) {
        orderTrackingNav.addEventListener('click', (e) => {
            e.preventDefault();
            openOrderTrackingModal();
        });
    }

    // Help functionality
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', openHelpModal);
    }

    // Cart functionality
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Hero CTA
    const heroCta = document.getElementById('heroCta');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            const categorySection = document.querySelector('.category-preview');
            if (categorySection) {
                categorySection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            navigateToCategory(category);
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Close search dropdown (only if search elements exist and search is open)
        if (searchOpen && !e.target.closest('.search-dropdown') && !e.target.closest('#searchBtn')) {
            closeSearch();
        }

        // Close mobile menu (only if mobile menu elements exist)
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active') &&
            !e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Smooth scrolling for anchor links
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

// Mobile menu functions
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');

    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    if (mobileToggle) {
        mobileToggle.classList.toggle('active');
    }

    // Prevent body scroll when menu is open
    if (navMenu) {
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');

    if (navMenu) {
        navMenu.classList.remove('active');
    }
    if (mobileToggle) {
        mobileToggle.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// Search functions
function toggleSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    
    if (searchOpen) {
        closeSearch();
    } else {
        openSearch();
    }
}

function openSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');

    if (searchDropdown) {
        searchDropdown.classList.add('active');
    }
    searchOpen = true;

    // Focus on input after animation
    if (searchInput) {
        setTimeout(() => {
            searchInput.focus();
        }, 150);
    }
}

function closeSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');

    if (searchDropdown) {
        searchDropdown.classList.remove('active');
    }
    searchOpen = false;
    if (searchInput) {
        searchInput.value = '';
    }
}

function performSearch(query) {
    if (!query.trim()) return;

    const searchResults = searchProducts(query);
    showSearchResults(query, searchResults);
    closeSearch();
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    const allProducts = Object.values(enhancedProducts);

    return allProducts.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            (product.features && product.features.some(feature =>
                feature.toLowerCase().includes(searchTerm)
            )) ||
            (product.colors && product.colors.some(color =>
                color.toLowerCase().includes(searchTerm)
            ))
        );
    });
}

function showSearchResults(query, results) {
    const modal = createSearchResultsModal(query, results);
    document.body.appendChild(modal);

    setupSearchResultsEventListeners(modal);

    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createSearchResultsModal(query, results) {
    const modal = document.createElement('div');
    modal.className = 'search-results-modal';

    modal.innerHTML = `
        <div class="search-overlay"></div>
        <div class="search-results-content">
            <div class="search-header">
                <h2>Search Results for "${query}"</h2>
                <button class="search-results-close">&times;</button>
            </div>

            <div class="search-results-body">
                ${results.length === 0 ? `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <h3>No products found</h3>
                        <p>Try searching for different keywords like "gothic", "kawaii", or "accessories"</p>
                    </div>
                ` : `
                    <div class="search-results-count">
                        Found ${results.length} product${results.length !== 1 ? 's' : ''}
                    </div>
                    <div class="search-results-grid">
                        ${results.map(product => createSearchResultCard(product)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .search-results-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .search-results-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .search-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .search-results-content {
            position: relative;
            background: white;
            border-radius: 16px;
            max-width: 800px;
            width: 95%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .search-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #eee;
        }

        .search-header h2 {
            margin: 0;
            color: var(--midnight-black);
        }

        .search-results-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .search-results-close:hover {
            background-color: #f5f5f5;
        }

        .search-results-body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .search-results-count {
            margin-bottom: 20px;
            color: #666;
            font-weight: 500;
        }

        .search-results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .search-result-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-soft);
            transition: var(--transition-smooth);
            cursor: pointer;
        }

        .search-result-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-medium);
        }

        .search-result-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }

        .search-result-info {
            padding: 16px;
        }

        .search-result-name {
            font-weight: 600;
            color: var(--midnight-black);
            margin-bottom: 8px;
            font-size: 14px;
        }

        .search-result-price {
            color: var(--deep-orchid);
            font-weight: 500;
            margin-bottom: 8px;
        }

        .search-result-category {
            background: var(--lavender-blush);
            color: var(--deep-orchid);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
            margin-bottom: 8px;
        }

        .search-result-actions {
            display: flex;
            gap: 8px;
        }

        .search-result-btn {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .add-to-cart-search {
            background: var(--deep-orchid);
            color: white;
        }

        .add-to-cart-search:hover {
            background: var(--midnight-black);
        }

        .quick-view-search {
            background: transparent;
            border: 1px solid var(--deep-orchid);
            color: var(--deep-orchid);
        }

        .quick-view-search:hover {
            background: var(--deep-orchid);
            color: white;
        }

        .no-results {
            text-align: center;
            padding: 60px 20px;
        }

        .no-results-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .no-results h3 {
            color: var(--midnight-black);
            margin-bottom: 12px;
        }

        .no-results p {
            color: #666;
            line-height: 1.5;
        }

        @media (max-width: 768px) {
            .search-results-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    modal.appendChild(style);
    return modal;
}

function createSearchResultCard(product) {
    return `
        <div class="search-result-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="search-result-image">
            <div class="search-result-info">
                <div class="search-result-category">${product.category}</div>
                <div class="search-result-name">${product.name}</div>
                <div class="search-result-price">$${product.price.toFixed(2)}</div>
                <div class="search-result-actions">
                    <button class="search-result-btn add-to-cart-search" data-product-id="${product.id}">
                        Add to Bag
                    </button>
                    <button class="search-result-btn quick-view-search" data-product-id="${product.id}">
                        Quick View
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupSearchResultsEventListeners(modal) {
    // Close modal
    const closeBtn = modal.querySelector('.search-results-close');
    const overlay = modal.querySelector('.search-overlay');

    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', () => closeSearchResultsModal(modal));
    });

    // Add to cart buttons
    modal.querySelectorAll('.add-to-cart-search').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            const product = enhancedProducts[productId];
            if (product) {
                addToCartFromShop({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                showNotification(`${product.name} added to cart!`);
            }
        });
    });

    // Quick view buttons
    modal.querySelectorAll('.quick-view-search').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            closeSearchResultsModal(modal);
            openQuickViewModal(productId);
        });
    });

    // Card clicks for quick view
    modal.querySelectorAll('.search-result-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.dataset.productId);
            closeSearchResultsModal(modal);
            openQuickViewModal(productId);
        });
    });
}

function closeSearchResultsModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// Language selection
function selectLanguage(langCode) {
    const langOptions = document.querySelectorAll('.lang-option');
    
    langOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === langCode) {
            option.classList.add('active');
        }
    });
    
    // In a real implementation, this would change the site language
    console.log(`Language changed to: ${langCode}`);
}

// Category navigation
function navigateToCategory(category) {
    // In a real implementation, this would navigate to the category page
    alert(`Navigating to ${category} category... In a real implementation, this would open the shop page!`);
}

// Load limited edition products
function loadLimitedProducts() {
    const limitedProductsContainer = document.getElementById('limitedProducts');
    if (!limitedProductsContainer) {
        console.error('Limited products container not found!');
        return;
    }

    console.log('Loading limited products:', limitedProducts);

    limitedProductsContainer.innerHTML = limitedProducts.map(product =>
        createProductCard(product)
    ).join('');

    console.log('Limited products loaded, container innerHTML:', limitedProductsContainer.innerHTML.substring(0, 200));

    // Ensure all limited product cards are immediately visible
    const productCards = limitedProductsContainer.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.3s ease';
    });

    // Add event listeners to product buttons
    limitedProductsContainer.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId || e.target.closest('.add-to-cart-btn').dataset.productId);
            addToCart(productId);
        });
    });
}

function createProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const stockStatus = getStockStatus(product.stock);

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}

                <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-product-id="${product.id}"
                        title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                        onclick="event.stopPropagation(); toggleWishlist(${product.id}); updateWishlistUI();">
                    ${isInWishlist ? '♥' : '♡'}
                </button>

                ${product.image && product.image.trim() !== '' ? `
                    <img src="${product.image}"
                         alt="${product.name}"
                         class="product-image"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="product-image-placeholder" style="display: none;">
                        <div class="placeholder-icon">🎀</div>
                        <div class="placeholder-text">Image Coming Soon</div>
                        <div class="placeholder-subtext">Premium ${product.category || 'Kawaii'} item</div>
                    </div>
                ` : `
                    <div class="product-image-placeholder">
                        <div class="placeholder-icon">🎀</div>
                        <div class="placeholder-text">Image Coming Soon</div>
                        <div class="placeholder-subtext">Premium ${product.category || 'Kawaii'} item</div>
                    </div>
                `}

                <button class="quick-view-btn" data-product-id="${product.id}"
                        title="Quick View"
                        onclick="event.stopPropagation(); openProductModal(${product.id});">
                    👁️ Quick View
                </button>
            </div>

            <div class="product-info">
                ${product.rating ? `
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span class="rating-count">(${product.reviews || 0})</span>
                    </div>
                ` : ''}

                <h3 class="product-name">${product.name}</h3>

                ${product.stock !== undefined ? `
                    <div class="stock-status ${stockStatus.class}">
                        <div class="stock-indicator"></div>
                        ${stockStatus.text}
                    </div>
                ` : ''}

                <div class="product-price-container">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `
                        <span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>
                        <span class="price-discount">-${discountPercent}%</span>
                    ` : ''}
                </div>

                <button class="add-to-cart-btn" data-product-id="${product.id}"
                        onclick="event.stopPropagation(); addToCart(${product.id});">
                    <span class="btn-text">Add to Bag</span>
                    <span class="btn-icon">✨</span>
                </button>
            </div>
        </div>
    `;
}

// Helper function for stock status
function getStockStatus(stock) {
    if (stock === undefined || stock === null) {
        return { class: 'in-stock', text: 'Available' };
    }

    if (stock === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (stock <= 5) {
        return { class: 'low-stock', text: `Only ${stock} left` };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

// Cart functionality
function addToCart(productId) {
    const product = limitedProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCart();
    showCartAddedAnimation();
    
    // Show success message
    showNotification(`${product.name} added to your bag!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <span class="empty-icon">🛍️</span>
                    <p>Your bag is empty</p>
                    <p class="empty-subtitle">Add some mischievous fashion!</p>
                </div>
            `;
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            cartItems.innerHTML = cart.map(item => createCartItem(item)).join('');
            if (cartFooter) cartFooter.style.display = 'block';

            // Add event listeners to cart items
            cartItems.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', handleCartQuantityChange);
            });

            cartItems.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.productId);
                    removeFromCart(productId);
                });
            });
        }
    }

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

function createCartItem(item) {
    // Check if image is a file path (contains . and file extension) or an emoji/icon
    const isImageFile = item.image && (item.image.includes('.') || item.image.startsWith('http'));

    return `
        <div class="cart-item">
            <div class="cart-item-image">
                ${isImageFile ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="display: none; width: 60px; height: 60px; background: var(--lavender-blush); border-radius: 8px; align-items: center; justify-content: center; font-size: 24px;">🛍️</div>` : `<span style="font-size: 40px;">${item.image}</span>`}
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-item" data-product-id="${item.id}">Remove</button>
                </div>
                <div class="cart-item-total">Total: $${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `;
}

function handleCartQuantityChange(e) {
    const productId = parseInt(e.target.dataset.productId);
    const action = e.target.dataset.action;
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (action === 'increase') {
            updateCartQuantity(productId, item.quantity + 1);
        } else if (action === 'decrease') {
            updateCartQuantity(productId, item.quantity - 1);
        }
    }
}

function toggleCart() {
    // If we're on the checkout page, redirect to shop page
    if (window.location.pathname.includes('checkout.html')) {
        window.location.href = 'shop.html';
        return;
    }

    if (cartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    // Check if cart elements exist (they might not exist on checkout page)
    if (!cartSidebar || !cartOverlay) {
        // On checkout page or pages without cart sidebar, redirect to cart/checkout
        window.location.href = 'checkout.html';
        return;
    }

    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    cartOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    // Check if cart elements exist before trying to manipulate them
    if (!cartSidebar || !cartOverlay) {
        return;
    }

    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    cartOpen = false;
    document.body.style.overflow = '';
}

function saveCart() {
    localStorage.setItem('kuromiCart', JSON.stringify(cart));
}

function showCartAddedAnimation() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
            cartBtn.style.animation = '';
        }, 600);
    }
}

// Newsletter signup
function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('.newsletter-input').value;

    if (email) {
        showNotification(`Welcome to the Mischief Club! 💜 Check ${email} for your 10% discount code!`);
        e.target.reset();
    }
}

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✨</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, var(--deep-orchid), var(--bubblegum-pink));
        color: var(--soft-white);
        padding: 15px 20px;
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-medium);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize sparkle animations
function initializeSparkles() {
    const sparkles = document.querySelectorAll('.sparkle');
    
    sparkles.forEach((sparkle, index) => {
        // Randomize animation timing
        sparkle.style.animationDelay = `${index * 0.5}s`;
        sparkle.style.animationDuration = `${6 + Math.random() * 4}s`;
    });
}

// Parallax effects for sparkles (optional enhancement)
function initParallaxEffects() {
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sparkles = document.querySelectorAll('.sparkle');
            
            sparkles.forEach((sparkle, index) => {
                const speed = 0.5 + (index * 0.1);
                sparkle.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Easter egg: Konami code
function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
    ];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        userInput = userInput.slice(-konamiCode.length);

        if (userInput.join(',') === konamiCode.join(',')) {
            activateKonamiCode();
        }
    });
}

function activateKonamiCode() {
    // Add special effects
    document.body.style.filter = 'hue-rotate(180deg)';
    showNotification('🦇 Konami Code Activated! Secret mischief mode enabled! 🦇');
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.filter = '';
    }, 5000);
}

// Initialize special features
initKonamiCode();

// Checkout functionality
function initializeCheckout() {
    const checkoutBtns = document.querySelectorAll('.checkout-btn');
    checkoutBtns.forEach(btn => {
        btn.addEventListener('click', redirectToCheckout);
    });
}

function redirectToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add some items first.');
        return;
    }

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add some items first.');
        return;
    }

    const modal = createCheckoutModal();
    document.body.appendChild(modal);

    // Add event listeners for checkout form
    setupCheckoutEventListeners(modal);

    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createCheckoutModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="checkout-overlay"></div>
        <div class="checkout-content">
            <div class="checkout-header">
                <h2>Checkout</h2>
                <button class="checkout-close">&times;</button>
            </div>

            <div class="checkout-body">
                <div class="checkout-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-items">
                        ${cart.map(item => `
                            <div class="summary-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-total">
                        <strong>Total: $${total.toFixed(2)} (${itemCount} items)</strong>
                    </div>
                </div>

                <div class="checkout-form">
                    <h3>Shipping Information</h3>
                    <form id="checkoutForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name *</label>
                                <input type="text" id="firstName" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required>
                        </div>

                        <div class="form-group">
                            <label for="address">Address *</label>
                            <input type="text" id="address" name="address" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">City *</label>
                                <input type="text" id="city" name="city" required>
                            </div>
                            <div class="form-group">
                                <label for="zipCode">ZIP Code *</label>
                                <input type="text" id="zipCode" name="zipCode" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="country">Country *</label>
                            <select id="country" name="country" required>
                                <option value="">Select Country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="UK">United Kingdom</option>
                                <option value="AU">Australia</option>
                                <option value="DE">Germany</option>
                                <option value="JP">Japan</option>
                                <option value="KR">South Korea</option>
                            </select>
                        </div>

                        <h3>Payment Method</h3>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="payment" value="card" checked>
                                <span>💳 Credit/Debit Card</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="paypal">
                                <span>💰 PayPal</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="apple">
                                <span>📱 Apple Pay</span>
                            </label>
                        </div>

                        <div class="checkout-actions">
                            <button type="button" class="btn-secondary" id="backToCart">Back to Cart</button>
                            <button type="submit" class="btn-primary">Complete Order ($${total.toFixed(2)})</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Add styles for the modal
    const style = document.createElement('style');
    style.textContent = `
        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .checkout-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .checkout-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .checkout-content {
            position: relative;
            background: white;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .checkout-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #eee;
        }

        .checkout-header h2 {
            margin: 0;
            color: #2d1b69;
        }

        .checkout-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .checkout-close:hover {
            background-color: #f5f5f5;
        }

        .checkout-body {
            padding: 24px;
        }

        .checkout-summary {
            margin-bottom: 24px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }

        .checkout-summary h3 {
            margin: 0 0 16px 0;
            color: #2d1b69;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }

        .summary-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .summary-total {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 2px solid #d63384;
            font-size: 18px;
            color: #2d1b69;
        }

        .checkout-form h3 {
            margin: 0 0 16px 0;
            color: #2d1b69;
        }

        .form-row {
            display: flex;
            gap: 16px;
        }

        .form-group {
            flex: 1;
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #2d1b69;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
            box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #d63384;
        }

        .payment-options {
            margin-bottom: 24px;
        }

        .payment-option {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .payment-option:hover {
            border-color: #d63384;
            background-color: #fdf2f8;
        }

        .payment-option input[type="radio"] {
            margin-right: 12px;
        }

        .checkout-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
        }

        .btn-secondary {
            padding: 12px 24px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s ease;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        .btn-primary {
            padding: 12px 24px;
            background: linear-gradient(45deg, #d63384, #f06292);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.2s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .checkout-content {
                width: 95%;
                margin: 20px;
            }

            .form-row {
                flex-direction: column;
                gap: 0;
            }

            .checkout-actions {
                flex-direction: column;
            }
        }
    `;

    modal.appendChild(style);
    return modal;
}

function setupCheckoutEventListeners(modal) {
    // Close modal
    const closeBtn = modal.querySelector('.checkout-close');
    const overlay = modal.querySelector('.checkout-overlay');
    const backBtn = modal.querySelector('#backToCart');

    [closeBtn, overlay, backBtn].forEach(element => {
        if (element) {
            element.addEventListener('click', () => closeCheckoutModal(modal));
        }
    });

    // Form submission
    const form = modal.querySelector('#checkoutForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder(modal, new FormData(form));
    });
}

function closeCheckoutModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function processOrder(modal, formData) {
    // Show loading state
    const submitBtn = modal.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Simulate order processing
    setTimeout(() => {
        const orderData = {
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                address: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country')
            },
            paymentMethod: formData.get('payment'),
            orderDate: new Date().toISOString(),
            orderId: 'KUR-' + Date.now()
        };

        // Save order to localStorage (in a real app, this would go to a server)
        const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('kuromiOrders', JSON.stringify(orders));

        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();

        // Close modal
        closeCheckoutModal(modal);
        closeCart();

        // Show success message
        showOrderConfirmation(orderData);

    }, 2000);
}

function showOrderConfirmation(orderData) {
    const confirmation = document.createElement('div');
    confirmation.className = 'order-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-overlay"></div>
        <div class="confirmation-content">
            <div class="confirmation-icon">🎉</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you ${orderData.customer.firstName}! Your mischievous order has been placed successfully.</p>
            <div class="order-details">
                <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
                <p><strong>Items:</strong> ${orderData.items.length} item(s)</p>
            </div>
            <p class="confirmation-note">A confirmation email will be sent to ${orderData.customer.email}</p>
            <button class="confirmation-close">Continue Shopping</button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .order-confirmation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .confirmation-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .confirmation-content {
            position: relative;
            background: white;
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .confirmation-icon {
            font-size: 64px;
            margin-bottom: 16px;
        }

        .confirmation-content h2 {
            color: #2d1b69;
            margin-bottom: 16px;
        }

        .order-details {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
            text-align: left;
        }

        .confirmation-note {
            font-size: 14px;
            color: #666;
            margin: 16px 0;
        }

        .confirmation-close {
            background: linear-gradient(45deg, #d63384, #f06292);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: transform 0.2s ease;
        }

        .confirmation-close:hover {
            transform: translateY(-2px);
        }
    `;

    confirmation.appendChild(style);
    document.body.appendChild(confirmation);

    // Close confirmation
    confirmation.querySelector('.confirmation-close').addEventListener('click', () => {
        document.body.removeChild(confirmation);
    });

    confirmation.querySelector('.confirmation-overlay').addEventListener('click', () => {
        document.body.removeChild(confirmation);
    });
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCheckout);

// Help Modal functionality
function openHelpModal() {
    const modal = createHelpModal();
    document.body.appendChild(modal);

    // Setup event listeners
    setupHelpModalEventListeners(modal);

    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';

    modal.innerHTML = `
        <div class="help-overlay"></div>
        <div class="help-content">
            <div class="help-header">
                <h2>🎀 Help & Support</h2>
                <button class="help-close">&times;</button>
            </div>

            <div class="help-body">
                <div class="help-sections">
                    <div class="help-section">
                        <h3>🛍️ Shopping Help</h3>
                        <ul>
                            <li><strong>How to order:</strong> Browse products, add to cart, and checkout securely</li>
                            <li><strong>Payment methods:</strong> We accept all major credit cards, PayPal, and Apple Pay</li>
                            <li><strong>Size guide:</strong> Check our size charts for the perfect fit</li>
                            <li><strong>Stock updates:</strong> Follow us on social media for restock notifications</li>
                        </ul>
                    </div>

                    <div class="help-section">
                        <h3>📦 Shipping & Returns</h3>
                        <ul>
                            <li><strong>Shipping time:</strong> 3-7 business days for standard shipping</li>
                            <li><strong>Express shipping:</strong> 1-3 business days available</li>
                            <li><strong>Returns:</strong> 30-day return policy on unworn items</li>
                            <li><strong>Exchanges:</strong> Free size exchanges within 14 days</li>
                        </ul>
                    </div>

                    <div class="help-section">
                        <h3>💜 Account & Orders</h3>
                        <ul>
                            <li><strong>Order tracking:</strong> Check your email for tracking information</li>
                            <li><strong>Order changes:</strong> Contact us within 1 hour of placing order</li>
                            <li><strong>Account issues:</strong> Email us at hello@kuromi-fashion.com</li>
                            <li><strong>Newsletter:</strong> Join for 10% off and exclusive updates</li>
                        </ul>
                    </div>

                    <div class="help-section">
                        <h3>🌸 Product Care</h3>
                        <ul>
                            <li><strong>Washing:</strong> Machine wash cold, gentle cycle</li>
                            <li><strong>Drying:</strong> Air dry recommended to preserve prints</li>
                            <li><strong>Storage:</strong> Store in cool, dry place away from direct sunlight</li>
                            <li><strong>Accessories:</strong> Wipe clean with damp cloth</li>
                        </ul>
                    </div>
                </div>

                <div class="help-contact">
                    <h3>💌 Still Need Help?</h3>
                    <p>Our mischievous support team is here to help!</p>
                    <div class="contact-options">
                        <a href="mailto:hello@kuromi-fashion.com" class="contact-btn">
                            📧 Email Us
                        </a>
                        <a href="tel:1-800-MISCHIEF" class="contact-btn">
                            📞 Call Us
                        </a>
                        <button class="contact-btn" onclick="openLiveChat()">
                            💬 Live Chat
                        </button>
                    </div>
                    <p class="help-hours">Support hours: Mon-Fri 9AM-6PM PST</p>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .help-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .help-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .help-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .help-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 800px;
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .help-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 30px;
            border-bottom: 1px solid #f0f0f0;
            background: linear-gradient(45deg, var(--lavender-blush), var(--soft-white));
            border-radius: 20px 20px 0 0;
        }

        .help-header h2 {
            margin: 0;
            color: var(--deep-orchid);
            font-family: var(--font-gothic);
        }

        .help-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: var(--deep-orchid);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .help-close:hover {
            background: rgba(153, 50, 204, 0.1);
            transform: scale(1.1);
        }

        .help-body {
            padding: 30px;
        }

        .help-sections {
            margin-bottom: 30px;
        }

        .help-section {
            margin-bottom: 25px;
            padding: 20px;
            background: var(--lavender-blush);
            border-radius: 12px;
            border-left: 4px solid var(--deep-orchid);
        }

        .help-section h3 {
            color: var(--deep-orchid);
            margin-bottom: 15px;
            font-size: 18px;
        }

        .help-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .help-section li {
            margin-bottom: 10px;
            padding-left: 0;
            line-height: 1.6;
            color: var(--midnight-black);
        }

        .help-section li strong {
            color: var(--deep-orchid);
        }

        .help-contact {
            text-align: center;
            padding: 25px;
            background: linear-gradient(45deg, var(--lavender-blush), var(--soft-white));
            border-radius: 12px;
            border: 2px solid var(--bubblegum-pink);
        }

        .help-contact h3 {
            color: var(--deep-orchid);
            margin-bottom: 10px;
        }

        .help-contact p {
            color: var(--midnight-black);
            margin-bottom: 20px;
        }

        .contact-options {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .contact-btn {
            background: linear-gradient(45deg, var(--deep-orchid), var(--bubblegum-pink));
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .contact-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(153, 50, 204, 0.3);
        }

        .help-hours {
            font-size: 14px;
            color: #666;
            margin: 0;
        }

        @media (max-width: 768px) {
            .help-content {
                width: 95%;
                margin: 20px;
                max-height: 85vh;
            }

            .help-header {
                padding: 20px;
            }

            .help-body {
                padding: 20px;
            }

            .help-section {
                padding: 15px;
            }

            .contact-options {
                flex-direction: column;
                align-items: center;
            }

            .contact-btn {
                width: 100%;
                max-width: 250px;
                justify-content: center;
            }
        }
    `;

    modal.appendChild(style);
    return modal;
}

function setupHelpModalEventListeners(modal) {
    // Close modal
    const closeBtn = modal.querySelector('.help-close');
    const overlay = modal.querySelector('.help-overlay');

    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', () => closeHelpModal(modal));
    });

    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHelpModal(modal);
        }
    });
}

function closeHelpModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}

function openLiveChat() {
    showNotification('Live chat coming soon! For now, please email us at hello@kuromi-fashion.com 💜');
}

// Quick View Modal functionality
function openQuickViewModal(productId) {
    const product = enhancedProducts[productId];
    if (!product) {
        showNotification('Product details not available');
        return;
    }

    const modal = createQuickViewModal(product);
    document.body.appendChild(modal);

    // Setup event listeners
    setupQuickViewEventListeners(modal, product);

    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createQuickViewModal(product) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';

    const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock';
    const stockClass = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';

    modal.innerHTML = `
        <div class="quick-view-overlay"></div>
        <div class="quick-view-content">
            <button class="quick-view-close">&times;</button>

            <div class="quick-view-body">
                <div class="quick-view-images">
                    <div class="main-image-container">
                        <img src="${product.image}" alt="${product.name}" class="main-product-image" id="mainImage">
                        ${product.badge ? `<div class="product-badge-qv">${product.badge}</div>` : ''}
                    </div>
                    ${product.images && product.images.length > 1 ? `
                        <div class="image-thumbnails">
                            ${product.images.map((img, index) => `
                                <img src="${img}" alt="${product.name} ${index + 1}"
                                     class="thumbnail ${index === 0 ? 'active' : ''}"
                                     onclick="switchMainImage('${img}', this)">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <div class="quick-view-details">
                    <h2 class="qv-product-name">${product.name}</h2>

                    <div class="qv-rating">
                        ${product.rating ? `
                            <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                            <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                        ` : ''}
                    </div>

                    <div class="qv-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>

                    <div class="qv-stock ${stockClass}">
                        <span class="stock-indicator">●</span>
                        <span>${stockStatus}</span>
                    </div>

                    <div class="qv-description">
                        <p>${product.description}</p>
                    </div>

                    ${product.features ? `
                        <div class="qv-features">
                            <h4>Features:</h4>
                            <ul>
                                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${product.sizes ? `
                        <div class="qv-sizes">
                            <h4>Size:</h4>
                            <div class="size-options">
                                ${product.sizes.map(size => `
                                    <button class="size-btn" data-size="${size}">${size}</button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${product.colors ? `
                        <div class="qv-colors">
                            <h4>Color:</h4>
                            <div class="color-options">
                                ${product.colors.map((color, index) => `
                                    <button class="color-btn ${index === 0 ? 'active' : ''}"
                                            data-color="${color}"
                                            title="${color}"
                                            style="background: ${getColorCode(color)};"></button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="qv-quantity">
                        <h4>Quantity:</h4>
                        <div class="quantity-controls">
                            <button class="qty-btn minus" ${product.stock === 0 ? 'disabled' : ''}>-</button>
                            <input type="number" class="qty-input" value="1" min="1" max="${product.stock}" ${product.stock === 0 ? 'disabled' : ''}>
                            <button class="qty-btn plus" ${product.stock === 0 ? 'disabled' : ''}>+</button>
                        </div>
                    </div>

                    <div class="qv-actions">
                        <button class="add-to-cart-qv" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            <span class="btn-text">${product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                            <span class="btn-sparkle">✨</span>
                        </button>
                        <button class="add-to-wishlist-qv" data-product-id="${product.id}">
                            <span class="heart">♡</span>
                            <span>Add to Wishlist</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .quick-view-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .quick-view-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .quick-view-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 900px;
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .quick-view-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .quick-view-close:hover {
            background: white;
            transform: scale(1.1);
        }

        .quick-view-body {
            display: flex;
            gap: 40px;
            padding: 40px;
        }

        .quick-view-images {
            flex: 1;
        }

        .main-image-container {
            position: relative;
            margin-bottom: 20px;
        }

        .main-product-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 12px;
            transition: transform 0.3s ease;
        }

        .main-product-image:hover {
            transform: scale(1.05);
        }

        .product-badge-qv {
            position: absolute;
            top: 15px;
            left: 15px;
            background: linear-gradient(45deg, #d63384, #f06292);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .image-thumbnails {
            display: flex;
            gap: 10px;
            overflow-x: auto;
        }

        .thumbnail {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
        }

        .thumbnail:hover,
        .thumbnail.active {
            border-color: var(--deep-orchid);
            transform: scale(1.05);
        }

        .quick-view-details {
            flex: 1;
        }

        .qv-product-name {
            font-size: 28px;
            font-weight: 700;
            color: var(--midnight-black);
            margin-bottom: 16px;
        }

        .qv-rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
        }

        .stars {
            color: #ffc107;
            font-size: 18px;
        }

        .rating-text {
            color: #666;
            font-size: 14px;
        }

        .qv-price {
            margin-bottom: 16px;
        }

        .qv-price .current-price {
            font-size: 24px;
            font-weight: 700;
            color: var(--deep-orchid);
            margin-right: 12px;
        }

        .qv-price .original-price {
            font-size: 18px;
            text-decoration: line-through;
            color: #999;
        }

        .qv-stock {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .stock-indicator {
            font-size: 12px;
        }

        .in-stock .stock-indicator {
            color: #28a745;
        }

        .low-stock .stock-indicator {
            color: #ffc107;
        }

        .out-of-stock .stock-indicator {
            color: #dc3545;
        }

        .qv-description {
            margin-bottom: 20px;
            line-height: 1.6;
            color: #555;
        }

        .qv-features {
            margin-bottom: 20px;
        }

        .qv-features h4 {
            margin-bottom: 8px;
            color: var(--midnight-black);
        }

        .qv-features ul {
            list-style: none;
            padding: 0;
        }

        .qv-features li {
            padding: 4px 0;
            color: #666;
            position: relative;
            padding-left: 20px;
        }

        .qv-features li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--deep-orchid);
            font-weight: bold;
        }

        .qv-sizes,
        .qv-colors,
        .qv-quantity {
            margin-bottom: 20px;
        }

        .qv-sizes h4,
        .qv-colors h4,
        .qv-quantity h4 {
            margin-bottom: 8px;
            color: var(--midnight-black);
        }

        .size-options,
        .color-options {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .size-btn {
            padding: 8px 16px;
            border: 2px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .size-btn:hover,
        .size-btn.active {
            border-color: var(--deep-orchid);
            background: var(--deep-orchid);
            color: white;
        }

        .color-btn {
            width: 40px;
            height: 40px;
            border: 3px solid #ddd;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .color-btn:hover,
        .color-btn.active {
            border-color: var(--deep-orchid);
            transform: scale(1.1);
        }

        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .qty-btn {
            width: 40px;
            height: 40px;
            border: 2px solid var(--deep-orchid);
            background: white;
            color: var(--deep-orchid);
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .qty-btn:hover {
            background: var(--deep-orchid);
            color: white;
        }

        .qty-input {
            width: 80px;
            height: 40px;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-weight: 600;
        }

        .qv-actions {
            display: flex;
            gap: 16px;
            margin-top: 30px;
        }

        .add-to-cart-qv {
            flex: 1;
            padding: 16px;
            background: linear-gradient(45deg, var(--deep-orchid), var(--bubblegum-pink));
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .add-to-cart-qv:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(153, 50, 204, 0.3);
        }

        .add-to-cart-qv:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .add-to-wishlist-qv {
            padding: 16px;
            background: white;
            border: 2px solid var(--deep-orchid);
            color: var(--deep-orchid);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
        }

        .add-to-wishlist-qv:hover {
            background: var(--deep-orchid);
            color: white;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .quick-view-body {
                flex-direction: column;
                padding: 20px;
                gap: 20px;
            }

            .qv-actions {
                flex-direction: column;
            }
        }
    `;

    modal.appendChild(style);
    return modal;
}

function getColorCode(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Pink': '#FFB6C1',
        'Purple': '#9932CC',
        'Deep Purple': '#4B0082',
        'Silver': '#C0C0C0',
        'Rose Gold': '#E8B4B8'
    };
    return colorMap[colorName] || '#000000';
}

function switchMainImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    mainImage.src = imageSrc;

    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function setupQuickViewEventListeners(modal, product) {
    // Close modal
    const closeBtn = modal.querySelector('.quick-view-close');
    const overlay = modal.querySelector('.quick-view-overlay');

    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', () => closeQuickViewModal(modal));
    });

    // Size selection
    const sizeButtons = modal.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Color selection
    const colorButtons = modal.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Quantity controls
    const qtyInput = modal.querySelector('.qty-input');
    const minusBtn = modal.querySelector('.qty-btn.minus');
    const plusBtn = modal.querySelector('.qty-btn.plus');

    minusBtn.addEventListener('click', () => {
        const current = parseInt(qtyInput.value);
        if (current > 1) {
            qtyInput.value = current - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const current = parseInt(qtyInput.value);
        if (current < product.stock) {
            qtyInput.value = current + 1;
        }
    });

    // Add to cart
    const addToCartBtn = modal.querySelector('.add-to-cart-qv');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        const selectedSize = modal.querySelector('.size-btn.active')?.dataset.size;
        const selectedColor = modal.querySelector('.color-btn.active')?.dataset.color;

        const productToAdd = {
            ...product,
            quantity: quantity,
            selectedSize,
            selectedColor
        };

        // Add multiple quantities
        for (let i = 0; i < quantity; i++) {
            addToCartFromShop({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        closeQuickViewModal(modal);
        showNotification(`${quantity}x ${product.name} added to cart!`);
    });

    // Add to wishlist
    const wishlistBtn = modal.querySelector('.add-to-wishlist-qv');
    wishlistBtn.addEventListener('click', () => {
        addToWishlist(product.id);
        showNotification(`${product.name} added to wishlist!`);
    });
}

function closeQuickViewModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll (exclude limited products)
    const elementsToObserve = document.querySelectorAll('.category-card, .review-bubble, .social-frame, .product-card:not(.limited-products .product-card)');
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Ensure limited products are always visible
    const limitedProductCards = document.querySelectorAll('.limited-products .product-card');
    limitedProductCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add smooth hover effects to interactive elements
function initHoverEffects() {
    const interactiveElements = document.querySelectorAll('.category-card, .product-card, .review-bubble, .social-frame');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', initHoverEffects);

// Shop page functions
const sampleProducts = [
    {
        id: 1,
        name: "Giant Kuromi Plush",
        price: 45.99,
        originalPrice: 65.99,
        image: "🖤",
        category: "plushies"
    },
    {
        id: 2,
        name: "Kuromi's Nightmare Hoodie",
        price: 39.99,
        originalPrice: 55.99,
        image: "🦇",
        category: "clothing"
    },
    {
        id: 3,
        name: "Spooky Phone Case",
        price: 19.99,
        originalPrice: 29.99,
        image: "📱",
        category: "accessories"
    },
    {
        id: 4,
        name: "Devil Horns Headband",
        price: 24.99,
        originalPrice: 34.99,
        image: "😈",
        category: "accessories"
    },
    {
        id: 5,
        name: "Gothic Lolita Skirt",
        price: 42.99,
        originalPrice: 59.99,
        image: "👗",
        category: "clothing"
    },
    {
        id: 6,
        name: "Nightmare Tea Set",
        price: 89.99,
        originalPrice: 120.99,
        image: "🫖",
        category: "home"
    },
    {
        id: 7,
        name: "Sleepy Kuromi Pillow",
        price: 29.99,
        originalPrice: 39.99,
        image: "🛏️",
        category: "plushies"
    },
    {
        id: 8,
        name: "Gothic Choker Necklace",
        price: 15.99,
        originalPrice: 22.99,
        image: "📿",
        category: "accessories"
    },
    {
        id: 9,
        name: "Nightmare Pajama Set",
        price: 54.99,
        originalPrice: 74.99,
        image: "👘",
        category: "clothing"
    },
    {
        id: 10,
        name: "Cursed Coffee Mug",
        price: 12.99,
        originalPrice: 17.99,
        image: "☕",
        category: "home"
    }
];

function loadShopProducts() {
    // Load products by category
    displayProductsByCategory('plushies', sampleProducts.filter(p => p.category === 'plushies'), 'plushiesGrid');
    displayProductsByCategory('accessories', sampleProducts.filter(p => p.category === 'accessories'), 'accessoriesGrid');
    displayProductsByCategory('clothing', sampleProducts.filter(p => p.category === 'clothing'), 'clothingGrid');
    displayProductsByCategory('home', sampleProducts.filter(p => p.category === 'home'), 'homeGrid');
}

function displayProductsByCategory(category, products, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = products.map(product => createShopProductCard(product)).join('');

    // Add event listeners
    grid.querySelectorAll('.product-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCartFromShop(productId);
        });
    });
}

function createShopProductCard(product) {
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

    return `
        <div class="product-card">
            ${discountPercent > 0 ? `<div class="product-badge">🔥 ${discountPercent}% OFF!</div>` : ''}
            <div class="product-image">${product.image}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price-container">
                ${product.originalPrice > product.price ?
                    `<span class="original-price">$${product.originalPrice}</span>` : ''}
                <span class="product-price">$${product.price}</span>
            </div>
            <button class="product-btn" data-product-id="${product.id}">
                Add to Bag
            </button>
        </div>
    `;
}

function addToCartFromShop(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    saveCart();
    showCartAddedAnimation();
    showNotification(`${product.name} added to your bag!`);
}

function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sections = document.querySelectorAll('.category-section');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            // Show/hide sections
            sections.forEach(section => {
                if (category === 'all') {
                    section.style.display = 'block';
                } else {
                    const sectionId = section.id;
                    if (sectionId.includes(category)) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Shop page initialization
function initializeShopPage() {
    // Initialize all existing functionality
    initializeWebsite();
    setupEventListeners();
    updateCartUI();

    // Add category filtering for shop page
    setupShopCategoryFiltering();

    // Add product interactions
    setupProductInteractions();

    // Add sort functionality
    setupSortFunctionality();

    // Add related products
    loadRelatedProducts();
}

function setupShopCategoryFiltering() {
    const categoryCards = document.querySelectorAll('.category-card');
    const productCards = document.querySelectorAll('.product-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;

            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Filter products
            productCards.forEach(product => {
                const productCategory = product.dataset.category;

                if (category === 'all' || productCategory === category) {
                    product.classList.remove('hidden');
                } else {
                    product.classList.add('hidden');
                }
            });

            // Show notification
            showNotification(`Showing ${category === 'all' ? 'all' : category} products`);
        });
    });
}

function setupProductInteractions() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId || e.target.closest('.add-to-cart-btn').dataset.productId);
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.product-image');

            // Get image source or use placeholder
            let imageSrc = '🛍️';
            if (productImage && productImage.src && !productImage.src.includes('undefined')) {
                imageSrc = productImage.src;
            }

            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: imageSrc,
                quantity: 1
            };

            addToCartFromShop(product);
        });
    });

    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.querySelector('.add-to-cart-btn').dataset.productId);
            openQuickViewModal(productId);
        });
    });
}

function addToCartFromShop(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Ensure new items have proper structure with emoji mapping
        const cartItem = {
            ...product,
            quantity: 1,
            emoji: getEmojiForImage(product.image || product.emoji || '🖤')
        };
        cart.push(cartItem);
    }

    updateCartUI();
    saveCart();
    showCartAddedAnimation();
    showNotification(`${product.name} added to your bag!`);
}

function getEmojiForImage(image) {
    // If it's already an emoji, return it
    if (image && !image.includes('.')) {
        return image;
    }

    // Map file paths to emojis
    const imageToEmojiMap = {
        'hoodie.webp': '🖤',
        'croptop.webp': '💜',
        'jacket.webp': '🦇',
        'dress.jpg': '👗',
        'goth dress.jpeg': '��',
        'pants.jpeg': '����',
        'headband.webp': '🎀',
        'choker.jpeg': '⛓️',
        'clip.jpeg': '💎',
        'phone cae.webp': '📱',
        'bag charm.webp': '🔮',
        'sara.webp': '��',
        'notebook.webp': '📓',
        'pen.webp': '✒️',
        'sticker.webp': '✨',
        'planner.webp': '📅',
        'markers.webp': '🖊️',
        'wall art.webp': '🖼️',
        'fairy lights.webp': '💫',
        'pillow.webp': '🛏️',
        'candle.webp': '🕯️',
        'mirrors.webp': '🪞',
        'cur tins.webp': '🏠'
    };

    return imageToEmojiMap[image] || '🖤';
}

function setupSortFunctionality() {
    const sortSelect = document.getElementById('sortSelect');

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            const productGrid = document.getElementById('productsGrid');
            const products = Array.from(productGrid.querySelectorAll('.product-card'));

            products.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        return getProductPrice(a) - getProductPrice(b);
                    case 'price-high':
                        return getProductPrice(b) - getProductPrice(a);
                    case 'newest':
                        return a.querySelector('.new-badge') ? -1 : 1;
                    default:
                        return 0;
                }
            });

            // Reorder DOM elements
            products.forEach(product => {
                productGrid.appendChild(product);
            });

            showNotification(`Products sorted by ${sortValue.replace('-', ' ')}`);
        });
    }
}

function getProductPrice(productCard) {
    const priceText = productCard.querySelector('.current-price').textContent;
    return parseFloat(priceText.replace('$', ''));
}

// Export functions for potential external use
window.KuromiShop = {
    addToCart,
    toggleCart,
    performSearch,
    selectLanguage,
    showNotification,
    loadShopProducts,
    setupCategoryFilters,
    initializeShopPage,
    cart
};

// Enhanced search with keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }

    // Escape to close search
    if (e.key === 'Escape') {
        closeSearch();
    }
});

// Complete Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('kuromiWishlist')) || [];

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist();

        // Enhanced wishlist button animation
        const wishlistBtn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
        if (wishlistBtn) {
            // Add heartbeat animation
            wishlistBtn.classList.add('adding');

            // Create particle effect
            createWishlistParticles(wishlistBtn);

            // Remove animation class after completion
            setTimeout(() => {
                wishlistBtn.classList.remove('adding');
            }, 800);
        }

        updateWishlistUI();
        updateWishlistCounter();
        return true;
    }
    return false;
}

function removeFromWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist();
        updateWishlistUI();
        return true;
    }
    return false;
}

function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        removeFromWishlist(productId);
        return false;
    } else {
        addToWishlist(productId);
        return true;
    }
}

function saveWishlist() {
    localStorage.setItem('kuromiWishlist', JSON.stringify(wishlist));
}

function updateWishlistUI() {
    const wishlistNavCount = document.getElementById('wishlistNavCount');

    if (wishlistNavCount) {
        wishlistNavCount.textContent = wishlist.length;
        wishlistNavCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }

    // Update heart buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '♥'; // filled heart
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '♡'; // empty heart
        }
    });
}

function openWishlistModal() {
    const modal = createWishlistModal();
    document.body.appendChild(modal);

    setupWishlistEventListeners(modal);

    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createWishlistModal() {
    const modal = document.createElement('div');
    modal.className = 'wishlist-modal';

    const wishlistProducts = wishlist.map(id => enhancedProducts[id]).filter(p => p);

    modal.innerHTML = `
        <div class="wishlist-overlay"></div>
        <div class="wishlist-content">
            <div class="wishlist-header">
                <h2>My Wishlist (♥ ${wishlist.length})</h2>
                <button class="wishlist-close">&times;</button>
            </div>

            <div class="wishlist-body">
                ${wishlistProducts.length === 0 ? `
                    <div class="empty-wishlist">
                        <div class="empty-wishlist-icon">♡</div>
                        <h3>Your wishlist is empty</h3>
                        <p>Save items you love to keep track of them</p>
                        <button class="browse-products-btn">Browse Products</button>
                    </div>
                ` : `
                    <div class="wishlist-actions">
                        <button class="clear-wishlist-btn">Clear All</button>
                        <button class="add-all-to-cart-btn">Add All to Cart</button>
                    </div>
                    <div class="wishlist-grid">
                        ${wishlistProducts.map(product => createWishlistCard(product)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .wishlist-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10003;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .wishlist-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .wishlist-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .wishlist-content {
            position: relative;
            background: white;
            border-radius: 16px;
            max-width: 900px;
            width: 95%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .wishlist-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #eee;
        }

        .wishlist-header h2 {
            margin: 0;
            color: var(--midnight-black);
        }

        .wishlist-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .wishlist-close:hover {
            background-color: #f5f5f5;
        }

        .wishlist-body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .wishlist-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            justify-content: flex-end;
        }

        .clear-wishlist-btn,
        .add-all-to-cart-btn,
        .browse-products-btn {
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .clear-wishlist-btn {
            background: #dc3545;
            color: white;
            border: none;
        }

        .clear-wishlist-btn:hover {
            background: #c82333;
        }

        .add-all-to-cart-btn,
        .browse-products-btn {
            background: var(--deep-orchid);
            color: white;
            border: none;
        }

        .add-all-to-cart-btn:hover,
        .browse-products-btn:hover {
            background: var(--midnight-black);
        }

        .wishlist-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .wishlist-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-soft);
            transition: var(--transition-smooth);
            position: relative;
        }

        .wishlist-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-medium);
        }

        .wishlist-card-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }

        .wishlist-card-info {
            padding: 16px;
        }

        .wishlist-card-name {
            font-weight: 600;
            color: var(--midnight-black);
            margin-bottom: 8px;
            font-size: 16px;
        }

        .wishlist-card-price {
            color: var(--deep-orchid);
            font-weight: 500;
            font-size: 18px;
            margin-bottom: 12px;
        }

        .wishlist-card-actions {
            display: flex;
            gap: 8px;
        }

        .wishlist-card-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .move-to-cart-btn {
            background: var(--deep-orchid);
            color: white;
        }

        .move-to-cart-btn:hover {
            background: var(--midnight-black);
        }

        .remove-wishlist-btn {
            background: transparent;
            border: 1px solid #dc3545;
            color: #dc3545;
        }

        .remove-wishlist-btn:hover {
            background: #dc3545;
            color: white;
        }

        .empty-wishlist {
            text-align: center;
            padding: 60px 20px;
        }

        .empty-wishlist-icon {
            font-size: 64px;
            margin-bottom: 20px;
            color: #ddd;
        }

        .empty-wishlist h3 {
            color: var(--midnight-black);
            margin-bottom: 12px;
        }

        .empty-wishlist p {
            color: #666;
            margin-bottom: 24px;
        }

        @media (max-width: 768px) {
            .wishlist-grid {
                grid-template-columns: 1fr;
            }

            .wishlist-actions {
                flex-direction: column;
            }
        }
    `;

    modal.appendChild(style);
    return modal;
}

function createWishlistCard(product) {
    return `
        <div class="wishlist-card">
            <img src="${product.image}" alt="${product.name}" class="wishlist-card-image">
            <div class="wishlist-card-info">
                <div class="wishlist-card-name">${product.name}</div>
                <div class="wishlist-card-price">$${product.price.toFixed(2)}</div>
                <div class="wishlist-card-actions">
                    <button class="wishlist-card-btn move-to-cart-btn" data-product-id="${product.id}">
                        Add to Bag
                    </button>
                    <button class="wishlist-card-btn remove-wishlist-btn" data-product-id="${product.id}">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupWishlistEventListeners(modal) {
    // Close modal
    const closeBtn = modal.querySelector('.wishlist-close');
    const overlay = modal.querySelector('.wishlist-overlay');

    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', () => closeWishlistModal(modal));
    });

    // Clear all wishlist
    const clearBtn = modal.querySelector('.clear-wishlist-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your wishlist?')) {
                wishlist = [];
                saveWishlist();
                updateWishlistUI();
                closeWishlistModal(modal);
                showNotification('Wishlist cleared!');
            }
        });
    }

    // Add all to cart
    const addAllBtn = modal.querySelector('.add-all-to-cart-btn');
    if (addAllBtn) {
        addAllBtn.addEventListener('click', () => {
            const wishlistProducts = wishlist.map(id => enhancedProducts[id]).filter(p => p);
            wishlistProducts.forEach(product => {
                addToCartFromShop({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            });
            showNotification(`${wishlistProducts.length} items added to cart!`);
        });
    }

    // Browse products
    const browseBtn = modal.querySelector('.browse-products-btn');
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            closeWishlistModal(modal);
        });
    }

    // Individual item actions
    modal.querySelectorAll('.move-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.productId);
            const product = enhancedProducts[productId];
            if (product) {
                addToCartFromShop({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                showNotification(`${product.name} added to cart!`);
            }
        });
    });

    modal.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.productId);
            removeFromWishlist(productId);
            closeWishlistModal(modal);
            openWishlistModal(); // Refresh the modal
            showNotification('Item removed from wishlist');
        });
    });
}

function closeWishlistModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// Social Proof Elements
function initializeSocialProof() {
    showRecentlyPurchasedNotifications();
    // updateVisitorCounter(); // Removed visitor counter
    addStockIndicators();
}

function showRecentlyPurchasedNotifications() {
    // Only show on homepage and shop page, not on checkout
    if (window.location.pathname.includes('checkout.html')) {
        return;
    }

    const recentPurchases = [
        { name: 'Gothic Lolita Dress', location: 'Tokyo, Japan', time: '2 minutes ago' },
        { name: 'Devil Horn Headband', location: 'Los Angeles, CA', time: '5 minutes ago' },
        { name: 'Kuromi Gothic Hoodie', location: 'London, UK', time: '8 minutes ago' },
        { name: 'Mischief Crop Top', location: 'Seoul, Korea', time: '12 minutes ago' },
        { name: 'Gothic Choker Set', location: 'Paris, France', time: '15 minutes ago' }
    ];

    let currentIndex = 0;
    let notificationInterval;

    function showNextNotification() {
        // Remove any existing notifications first
        const existingNotifications = document.querySelectorAll('.recent-purchase-notification');
        existingNotifications.forEach(notification => {
            closeRecentPurchaseNotification(notification);
        });

        if (currentIndex < recentPurchases.length) {
            const purchase = recentPurchases[currentIndex];
            showRecentPurchaseNotification(purchase);
            currentIndex++;
        } else {
            currentIndex = 0; // Reset to loop
        }
    }

    // Show first notification after 5 seconds
    setTimeout(showNextNotification, 5000);

    // Show subsequent notifications every 30 seconds
    notificationInterval = setInterval(showNextNotification, 30000);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (notificationInterval) {
            clearInterval(notificationInterval);
        }
    });
}

function showRecentPurchaseNotification(purchase) {
    const notification = document.createElement('div');
    notification.className = 'recent-purchase-notification';
    notification.innerHTML = `
        <div class="recent-purchase-content">
            <div class="recent-purchase-icon">��️</div>
            <div class="recent-purchase-text">
                <div class="purchase-item">${purchase.name}</div>
                <div class="purchase-details">Recently purchased in ${purchase.location}</div>
                <div class="purchase-time">${purchase.time}</div>
            </div>
        </div>
        <button class="recent-purchase-close">&times;</button>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .recent-purchase-notification {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            max-width: 300px;
            transform: translateX(-100%);
            transition: transform 0.4s ease;
            border-left: 4px solid var(--deep-orchid);
        }

        .recent-purchase-notification.show {
            transform: translateX(0);
        }

        .recent-purchase-content {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
        }

        .recent-purchase-icon {
            font-size: 24px;
        }

        .recent-purchase-text {
            flex: 1;
        }

        .purchase-item {
            font-weight: 600;
            color: var(--midnight-black);
            font-size: 14px;
            margin-bottom: 2px;
        }

        .purchase-details {
            font-size: 12px;
            color: #666;
            margin-bottom: 2px;
        }

        .purchase-time {
            font-size: 11px;
            color: var(--deep-orchid);
            font-weight: 500;
        }

        .recent-purchase-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 16px;
            color: #999;
            cursor: pointer;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .recent-purchase-close:hover {
            background: #f5f5f5;
            color: #666;
        }

        @media (max-width: 768px) {
            .recent-purchase-notification {
                left: 10px;
                right: 10px;
                max-width: none;
                transform: translateY(100%);
            }

            .recent-purchase-notification.show {
                transform: translateY(0);
            }
        }
    `;

    notification.appendChild(style);
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Close button
    notification.querySelector('.recent-purchase-close').addEventListener('click', () => {
        closeRecentPurchaseNotification(notification);
    });

    // Auto close after 8 seconds
    setTimeout(() => {
        closeRecentPurchaseNotification(notification);
    }, 8000);
}

function closeRecentPurchaseNotification(notification) {
    if (notification && notification.parentNode) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode && document.body.contains(notification)) {
                try {
                    document.body.removeChild(notification);
                } catch (e) {
                    console.log('Notification already removed');
                }
            }
        }, 400);
    }
}

function updateVisitorCounter() {
    // Simulate visitor count
    let visitorCount = localStorage.getItem('kuromiVisitorCount');
    if (!visitorCount) {
        visitorCount = Math.floor(Math.random() * 500) + 1200; // Random number between 1200-1700
    } else {
        visitorCount = parseInt(visitorCount) + Math.floor(Math.random() * 3) + 1; // Increment by 1-3
    }

    localStorage.setItem('kuromiVisitorCount', visitorCount);

    // Create visitor counter element
    const counter = document.createElement('div');
    counter.className = 'visitor-counter';
    counter.innerHTML = `
        <div class="visitor-counter-content">
            <span class="visitor-icon">👁️</span>
            <span class="visitor-text">${visitorCount} people viewing</span>
            <span class="visitor-pulse"></span>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .visitor-counter {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            animation: slideInRight 0.5s ease;
        }

        .visitor-counter-content {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .visitor-pulse {
            width: 8px;
            height: 8px;
            background: #28a745;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes slideInRight {
            from {
                transform: translateY(-50%) translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateY(-50%) translateX(0);
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.5;
                transform: scale(1.2);
            }
        }

        @media (max-width: 768px) {
            .visitor-counter {
                position: fixed;
                top: auto;
                bottom: 100px;
                right: 10px;
                transform: none;
            }
        }
    `;

    counter.appendChild(style);
    document.body.appendChild(counter);

    // Update counter every 30-60 seconds
    setInterval(() => {
        const currentCount = parseInt(localStorage.getItem('kuromiVisitorCount'));
        const newCount = currentCount + Math.floor(Math.random() * 2); // Increment by 0-1
        localStorage.setItem('kuromiVisitorCount', newCount);
        counter.querySelector('.visitor-text').textContent = `${newCount} people viewing`;
    }, Math.random() * 30000 + 30000); // Random interval between 30-60 seconds
}

function addStockIndicators() {
    // Add stock indicators to product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const productId = parseInt(card.querySelector('.add-to-cart-btn')?.dataset.productId);
        const product = enhancedProducts[productId];

        if (product && product.stock) {
            let stockIndicator = '';
            let stockClass = '';

            if (product.stock <= 5) {
                stockIndicator = `⚠️ Only ${product.stock} left!`;
                stockClass = 'stock-urgent';
            } else if (product.stock <= 15) {
                stockIndicator = `🔥 ${product.stock} in stock`;
                stockClass = 'stock-low';
            } else if (Math.random() > 0.7) { // Show for 30% of products
                stockIndicator = `✅ In Stock`;
                stockClass = 'stock-good';
            }

            if (stockIndicator) {
                const indicator = document.createElement('div');
                indicator.className = `stock-indicator ${stockClass}`;
                indicator.textContent = stockIndicator;

                const productInfo = card.querySelector('.product-info');
                if (productInfo) {
                    productInfo.insertBefore(indicator, productInfo.querySelector('.add-to-cart-btn'));
                }
            }
        }
    });
}

// Related Products functionality
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (!relatedGrid) return;

    // Get current page category or random products
    const currentCategory = getCurrentPageCategory();
    const relatedProducts = getRelatedProducts(currentCategory);

    relatedGrid.innerHTML = relatedProducts.map(product => createRelatedProductCard(product)).join('');

    // Add event listeners
    setupRelatedProductsEventListeners(relatedGrid);
}

function getCurrentPageCategory() {
    // Determine current page context
    const path = window.location.pathname;
    if (path.includes('shop.html')) {
        return 'mixed'; // Show variety on shop page
    }
    return 'mixed';
}

function getRelatedProducts(category = 'mixed', limit = 4) {
    const allProducts = Object.values(enhancedProducts);

    if (category === 'mixed') {
        // Shuffle and return random products
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    }

    // Filter by category and return random selection
    const categoryProducts = allProducts.filter(p => p.category === category);
    const shuffled = categoryProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
}

function createRelatedProductCard(product) {
    return `
        <div class="related-product-card" data-product-id="${product.id}">
            <div class="related-product-image-container">
                <img src="${product.image}" alt="${product.name}" class="related-product-image">
                ${product.badge ? `<div class="related-product-badge">${product.badge}</div>` : ''}
                <div class="related-product-overlay">
                    <button class="related-quick-view" data-product-id="${product.id}" title="Quick View">👁️</button>
                    <button class="related-wishlist" data-product-id="${product.id}" title="Add to Wishlist">♡</button>
                </div>
            </div>
            <div class="related-product-info">
                <h3 class="related-product-name">${product.name}</h3>
                <div class="related-product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                ${product.rating ? `
                    <div class="related-product-rating">
                        <div class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                ` : ''}
                <button class="related-add-to-cart" data-product-id="${product.id}">
                    <span>Add to Bag</span>
                    <span class="btn-sparkle">���</span>
                </button>
            </div>
        </div>
    `;
}

function setupRelatedProductsEventListeners(grid) {
    // Add to cart buttons
    grid.querySelectorAll('.related-add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            const product = enhancedProducts[productId];
            if (product) {
                addToCartFromShop({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                showNotification(`${product.name} added to cart!`);
            }
        });
    });

    // Quick view buttons
    grid.querySelectorAll('.related-quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            openQuickViewModal(productId);
        });
    });

    // Wishlist buttons
    grid.querySelectorAll('.related-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            const wasAdded = toggleWishlist(productId);
            const product = enhancedProducts[productId];
            if (product) {
                btn.innerHTML = wishlist.includes(productId) ? '♥' : '♡';
                showNotification(
                    wasAdded
                        ? `${product.name} added to wishlist!`
                        : `${product.name} removed from wishlist!`
                );
            }
        });
    });

    // Card clicks for quick view
    grid.querySelectorAll('.related-product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.dataset.productId);
            openQuickViewModal(productId);
        });
    });
}

// "Customers who bought this also bought" functionality
function getRecommendedProducts(currentProductId, limit = 3) {
    const currentProduct = enhancedProducts[currentProductId];
    if (!currentProduct) return [];

    const allProducts = Object.values(enhancedProducts);

    // Filter products by same category, exclude current product
    let recommended = allProducts.filter(p =>
        p.id !== currentProductId &&
        p.category === currentProduct.category
    );

    // If not enough products in same category, add from other categories
    if (recommended.length < limit) {
        const otherProducts = allProducts.filter(p =>
            p.id !== currentProductId &&
            p.category !== currentProduct.category
        );
        recommended = [...recommended, ...otherProducts];
    }

    // Shuffle and return limited results
    return recommended.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// Order Tracking functionality
function openOrderTrackingModal() {
    const modal = createOrderTrackingModal();
    document.body.appendChild(modal);

    setupOrderTrackingEventListeners(modal);

    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function createOrderTrackingModal() {
    const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
    const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const modal = document.createElement('div');
    modal.className = 'order-tracking-modal';

    modal.innerHTML = `
        <div class="order-tracking-overlay"></div>
        <div class="order-tracking-content">
            <div class="order-tracking-header">
                <h2>Order History & Tracking</h2>
                <button class="order-tracking-close">&times;</button>
            </div>

            <div class="order-tracking-body">
                ${sortedOrders.length === 0 ? `
                    <div class="no-orders">
                        <div class="no-orders-icon">📦</div>
                        <h3>No orders yet</h3>
                        <p>Start shopping to see your orders here!</p>
                        <button class="browse-shop-btn">Browse Shop</button>
                    </div>
                ` : `
                    <div class="orders-list">
                        ${sortedOrders.map(order => createOrderCard(order)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .order-tracking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10004;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .order-tracking-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .order-tracking-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .order-tracking-content {
            position: relative;
            background: white;
            border-radius: 16px;
            max-width: 800px;
            width: 95%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .order-tracking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid #eee;
        }

        .order-tracking-header h2 {
            margin: 0;
            color: var(--midnight-black);
        }

        .order-tracking-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .order-tracking-close:hover {
            background-color: #f5f5f5;
        }

        .order-tracking-body {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .orders-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .order-card {
            background: white;
            border-radius: 12px;
            box-shadow: var(--shadow-soft);
            overflow: hidden;
            transition: var(--transition-smooth);
        }

        .order-card:hover {
            box-shadow: var(--shadow-medium);
        }

        .order-header {
            background: linear-gradient(45deg, var(--lavender-blush), #f8f6ff);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #eee;
        }

        .order-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .order-id {
            font-weight: 600;
            color: var(--midnight-black);
            font-size: 16px;
        }

        .order-date {
            font-size: 14px;
            color: #666;
        }

        .order-status {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-processing {
            background: #fff3cd;
            color: #856404;
        }

        .status-shipped {
            background: #cce5ff;
            color: #004085;
        }

        .status-delivered {
            background: #d4edda;
            color: #155724;
        }

        .order-body {
            padding: 20px;
        }

        .order-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .order-total {
            font-size: 18px;
            font-weight: 700;
            color: var(--deep-orchid);
        }

        .order-items-count {
            font-size: 14px;
            color: #666;
        }

        .order-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 16px;
        }

        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .order-item:last-child {
            border-bottom: none;
        }

        .order-item-name {
            font-weight: 500;
            color: var(--midnight-black);
        }

        .order-item-details {
            font-size: 14px;
            color: #666;
        }

        .order-item-price {
            font-weight: 600;
            color: var(--deep-orchid);
        }

        .order-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #eee;
        }

        .order-btn {
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .track-order-btn {
            background: var(--deep-orchid);
            color: white;
            border: none;
        }

        .track-order-btn:hover {
            background: var(--midnight-black);
        }

        .reorder-btn {
            background: transparent;
            border: 1px solid var(--deep-orchid);
            color: var(--deep-orchid);
        }

        .reorder-btn:hover {
            background: var(--deep-orchid);
            color: white;
        }

        .no-orders {
            text-align: center;
            padding: 60px 20px;
        }

        .no-orders-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .no-orders h3 {
            color: var(--midnight-black);
            margin-bottom: 12px;
        }

        .no-orders p {
            color: #666;
            margin-bottom: 24px;
        }

        .browse-shop-btn {
            background: var(--deep-orchid);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .browse-shop-btn:hover {
            background: var(--midnight-black);
        }

        @media (max-width: 768px) {
            .order-header {
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
            }

            .order-summary {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .order-actions {
                flex-direction: column;
            }
        }
    `;

    modal.appendChild(style);
    return modal;
}

function createOrderCard(order) {
    const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Simulate order status based on order age
    const daysSinceOrder = Math.floor((Date.now() - new Date(order.orderDate)) / (1000 * 60 * 60 * 24));
    let status = 'processing';
    let statusText = 'Processing';

    if (daysSinceOrder >= 7) {
        status = 'delivered';
        statusText = 'Delivered';
    } else if (daysSinceOrder >= 3) {
        status = 'shipped';
        statusText = 'Shipped';
    }

    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-id">Order ${order.orderId}</div>
                    <div class="order-date">Placed on ${orderDate}</div>
                </div>
                <div class="order-status status-${status}">${statusText}</div>
            </div>
            <div class="order-body">
                <div class="order-summary">
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                    <div class="order-items-count">${order.items.length} item${order.items.length !== 1 ? 's' : ''}</div>
                </div>
                <div class="order-items">
                    ${order.items.slice(0, 3).map(item => `
                        <div class="order-item">
                            <div>
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-details">Qty: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                    ${order.items.length > 3 ? `
                        <div class="order-item">
                            <div class="order-item-name">... and ${order.items.length - 3} more item${order.items.length - 3 !== 1 ? 's' : ''}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="order-actions">
                    <button class="order-btn track-order-btn" data-order-id="${order.orderId}">
                        Track Order
                    </button>
                    <button class="order-btn reorder-btn" data-order-id="${order.orderId}">
                        Reorder
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupOrderTrackingEventListeners(modal) {
    // Close modal
    const closeBtn = modal.querySelector('.order-tracking-close');
    const overlay = modal.querySelector('.order-tracking-overlay');

    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', () => closeOrderTrackingModal(modal));
    });

    // Browse shop button
    const browseBtn = modal.querySelector('.browse-shop-btn');
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            closeOrderTrackingModal(modal);
        });
    }

    // Track order buttons
    modal.querySelectorAll('.track-order-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            showOrderTrackingDetails(orderId);
        });
    });

    // Reorder buttons
    modal.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            reorderItems(orderId);
        });
    });
}

function closeOrderTrackingModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function showOrderTrackingDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        showNotification('Order not found');
        return;
    }

    // Simulate tracking info
    const trackingSteps = [
        { status: 'Order Placed', date: order.orderDate, completed: true },
        { status: 'Payment Confirmed', date: order.orderDate, completed: true },
        { status: 'Preparing for Shipment', date: new Date(Date.parse(order.orderDate) + 24*60*60*1000).toISOString(), completed: true },
        { status: 'Shipped', date: new Date(Date.parse(order.orderDate) + 72*60*60*1000).toISOString(), completed: Date.now() - Date.parse(order.orderDate) > 72*60*60*1000 },
        { status: 'Out for Delivery', date: new Date(Date.parse(order.orderDate) + 6*24*60*60*1000).toISOString(), completed: Date.now() - Date.parse(order.orderDate) > 6*24*60*60*1000 },
        { status: 'Delivered', date: new Date(Date.parse(order.orderDate) + 7*24*60*60*1000).toISOString(), completed: Date.now() - Date.parse(order.orderDate) > 7*24*60*60*1000 }
    ];

    const trackingHTML = `
        <div class="tracking-details">
            <h3>Tracking for Order ${orderId}</h3>
            <div class="tracking-timeline">
                ${trackingSteps.map((step, index) => `
                    <div class="tracking-step ${step.completed ? 'completed' : ''}">
                        <div class="step-indicator"></div>
                        <div class="step-content">
                            <div class="step-status">${step.status}</div>
                            <div class="step-date">${new Date(step.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    showNotification(trackingHTML, 'info', 10000);
}

function reorderItems(orderId) {
    const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        showNotification('Order not found');
        return;
    }

    // Add all items from the order back to cart
    order.items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            addToCartFromShop({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
    });

    showNotification(`${order.items.length} items from order ${orderId} added to cart!`);
}

// Initialize social proof on page load
document.addEventListener('DOMContentLoaded', initializeSocialProof);

console.log('🦇 Welcome to Kuromi\'s Fashion Empire! 💜');
console.log('Try the Konami code for a special surprise! ✨');

// Categories Slide Menu functionality
let categoriesMenuOpen = false;

function initializeCategoriesMenu() {
    const categoriesBtn = document.getElementById('categoriesBtn');
    const categoriesMenu = document.getElementById('categoriesMenu');
    const categoriesClose = document.getElementById('categoriesClose');
    const categoriesOverlay = document.getElementById('categoriesOverlay');
    const categoryItems = document.querySelectorAll('.category-item');

    // Categories button click
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', openCategoriesMenu);
    }

    // Close button click
    if (categoriesClose) {
        categoriesClose.addEventListener('click', closeCategoriesMenu);
    }

    // Overlay click
    if (categoriesOverlay) {
        categoriesOverlay.addEventListener('click', closeCategoriesMenu);
    }

    // Category item clicks
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            handleCategorySelection(category);
        });
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && categoriesMenuOpen) {
            closeCategoriesMenu();
        }
    });
}

function openCategoriesMenu() {
    const categoriesMenu = document.getElementById('categoriesMenu');
    const categoriesOverlay = document.getElementById('categoriesOverlay');

    if (categoriesMenu && categoriesOverlay) {
        categoriesMenu.classList.add('open');
        categoriesOverlay.classList.add('show');
        categoriesMenuOpen = true;
        document.body.style.overflow = 'hidden';

        // Add animation delay for category items
        const categoryItems = categoriesMenu.querySelectorAll('.category-item');
        categoryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'slideInLeft 0.3s ease forwards';
        });
    }
}

function closeCategoriesMenu() {
    const categoriesMenu = document.getElementById('categoriesMenu');
    const categoriesOverlay = document.getElementById('categoriesOverlay');

    if (categoriesMenu && categoriesOverlay) {
        categoriesMenu.classList.remove('open');
        categoriesOverlay.classList.remove('show');
        categoriesMenuOpen = false;
        document.body.style.overflow = '';
    }
}

function handleCategorySelection(category) {
    // If we're on the shop page, filter products
    if (window.location.pathname.includes('shop.html')) {
        filterProductsByCategory(category);
    } else {
        // Navigate to shop page with category filter
        window.location.href = `shop.html?category=${category}`;
    }

    closeCategoriesMenu();
    showNotification(`Showing ${category} products`);
}

function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card[data-category]');

    productCards.forEach(card => {
        const productCategory = card.dataset.category;

        if (category === 'all' || productCategory === category) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });

    // Update products header
    const productsTitle = document.querySelector('.products-section .section-title');
    if (productsTitle) {
        const categoryNames = {
            'clothing': 'Clothing',
            'accessories': 'Accessories',
            'stationery': 'Stationery',
            'room-decor': 'Room Decor',
            'all': 'All Products'
        };
        productsTitle.textContent = categoryNames[category] || 'All Products';
    }
}

// Initialize categories menu when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCategoriesMenu();

    // Check for category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    if (categoryFilter && window.location.pathname.includes('shop.html')) {
        setTimeout(() => {
            filterProductsByCategory(categoryFilter);
        }, 100);
    }
});

// Add slideInLeft animation to CSS
const categoriesAnimationStyle = document.createElement('style');
categoriesAnimationStyle.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(categoriesAnimationStyle);

// Product Detail Modal Functionality
let currentModalProduct = null;
let selectedSize = null;
let selectedColor = null;

function openProductModal(productId) {
    const product = enhancedProducts[productId];
    if (!product) return;

    currentModalProduct = product;
    selectedSize = product.sizes ? product.sizes[0] : null;
    selectedColor = product.colors ? product.colors[0] : null;

    const modal = document.getElementById('productModal');

    // Populate modal content
    populateModalContent(product);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Setup modal event listeners
    setupModalEventListeners();
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProduct = null;
    selectedSize = null;
    selectedColor = null;
}

function populateModalContent(product) {
    // Set product title
    document.getElementById('modalProductName').textContent = product.name;

    // Set rating
    const ratingElement = document.getElementById('modalRating');
    const reviewCountElement = document.getElementById('modalReviewCount');
    if (product.rating) {
        ratingElement.innerHTML = '★'.repeat(Math.floor(product.rating)) +
                                 (product.rating % 1 ? '☆' : '') +
                                 '☆'.repeat(5 - Math.ceil(product.rating));
        reviewCountElement.textContent = `(${product.reviews || 0} reviews)`;
    } else {
        ratingElement.innerHTML = '';
        reviewCountElement.textContent = '';
    }

    // Set pricing
    document.getElementById('modalCurrentPrice').textContent = `$${product.price}`;
    const originalPriceElement = document.getElementById('modalOriginalPrice');
    const discountElement = document.getElementById('modalDiscount');

    if (product.originalPrice && product.originalPrice > product.price) {
        originalPriceElement.textContent = `$${product.originalPrice}`;
        originalPriceElement.style.display = 'inline';
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discountElement.textContent = `-${discount}%`;
        discountElement.style.display = 'inline';
    } else {
        originalPriceElement.style.display = 'none';
        discountElement.style.display = 'none';
    }

    // Set stock info
    const stockElement = document.getElementById('modalStock');
    if (product.stock) {
        if (product.stock > 10) {
            stockElement.textContent = 'In Stock';
            stockElement.className = 'stock-indicator in-stock';
        } else if (product.stock > 0) {
            stockElement.textContent = `Only ${product.stock} left!`;
            stockElement.className = 'stock-indicator low-stock';
        } else {
            stockElement.textContent = 'Out of Stock';
            stockElement.className = 'stock-indicator out-of-stock';
        }
    } else {
        stockElement.textContent = 'In Stock';
        stockElement.className = 'stock-indicator in-stock';
    }

    // Set description
    document.getElementById('modalDescription').textContent = product.description || 'No description available.';

    // Set features
    const featuresElement = document.getElementById('modalFeatures');
    if (product.features && product.features.length > 0) {
        featuresElement.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    } else {
        featuresElement.innerHTML = '<li>Premium quality</li><li>Fast shipping</li><li>Satisfaction guaranteed</li>';
    }

    // Set images
    setupModalImages(product);

    // Set size options
    setupSizeOptions(product);

    // Set color options
    setupColorOptions(product);

    // Update price in button
    updateModalButtonPrice();
}

function setupModalImages(product) {
    const mainImage = document.getElementById('modalMainImage');
    const thumbnailContainer = document.getElementById('modalThumbnails');

    // Set main image
    if (product.image) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    } else {
        mainImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
        mainImage.alt = 'No image available';
    }

    // Set thumbnails
    thumbnailContainer.innerHTML = '';
    const images = product.images || [product.image];

    if (images && images.length > 1) {
        images.forEach((img, index) => {
            if (img) {
                const thumbnail = document.createElement('img');
                thumbnail.src = img;
                thumbnail.alt = `${product.name} view ${index + 1}`;
                thumbnail.className = `thumbnail-image ${index === 0 ? 'active' : ''}`;
                thumbnail.addEventListener('click', () => {
                    mainImage.src = img;
                    thumbnailContainer.querySelectorAll('.thumbnail-image').forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                thumbnailContainer.appendChild(thumbnail);
            }
        });
    }
}

function setupSizeOptions(product) {
    const sizeSelector = document.getElementById('modalSizeSelector');
    const sizesContainer = document.getElementById('modalSizes');

    if (product.sizes && product.sizes.length > 0) {
        sizeSelector.style.display = 'block';
        sizesContainer.innerHTML = '';

        product.sizes.forEach((size, index) => {
            const sizeOption = document.createElement('div');
            sizeOption.className = `size-option ${index === 0 ? 'selected' : ''}`;
            sizeOption.textContent = size;
            sizeOption.addEventListener('click', () => {
                sizesContainer.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                sizeOption.classList.add('selected');
                selectedSize = size;
            });
            sizesContainer.appendChild(sizeOption);
        });
    } else {
        sizeSelector.style.display = 'none';
    }
}

function setupColorOptions(product) {
    const colorSelector = document.getElementById('modalColorSelector');
    const colorsContainer = document.getElementById('modalColors');

    if (product.colors && product.colors.length > 0) {
        colorSelector.style.display = 'block';
        colorsContainer.innerHTML = '';

        product.colors.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = `color-option ${index === 0 ? 'selected' : ''}`;
            colorOption.textContent = color;
            colorOption.addEventListener('click', () => {
                colorsContainer.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                colorOption.classList.add('selected');
                selectedColor = color;
            });
            colorsContainer.appendChild(colorOption);
        });
    } else {
        colorSelector.style.display = 'none';
    }
}

function updateModalButtonPrice() {
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    const totalPrice = (currentModalProduct.price * quantity).toFixed(2);
    document.getElementById('modalBtnPrice').textContent = `$${totalPrice}`;
}

function setupModalEventListeners() {
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const quantityInput = document.getElementById('modalQuantity');
    const decrementBtn = document.getElementById('modalDecrement');
    const incrementBtn = document.getElementById('modalIncrement');
    const addToCartBtn = document.getElementById('modalAddToCart');

    // Close modal events
    modalClose.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', closeProductModal);

    // Quantity controls
    decrementBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value) || 1;
        if (current > 1) {
            quantityInput.value = current - 1;
            updateModalButtonPrice();
        }
    });

    incrementBtn.addEventListener('click', () => {
        const current = parseInt(quantityInput.value) || 1;
        const maxStock = currentModalProduct.stock || 10;
        if (current < Math.min(10, maxStock)) {
            quantityInput.value = current + 1;
            updateModalButtonPrice();
        }
    });

    quantityInput.addEventListener('input', () => {
        const value = parseInt(quantityInput.value) || 1;
        const maxStock = currentModalProduct.stock || 10;
        quantityInput.value = Math.max(1, Math.min(Math.min(10, maxStock), value));
        updateModalButtonPrice();
    });

    // Add to cart from modal
    addToCartBtn.addEventListener('click', () => {
        if (!currentModalProduct) return;

        const quantity = parseInt(quantityInput.value) || 1;
        const productData = {
            ...currentModalProduct,
            selectedSize,
            selectedColor,
            quantity
        };

        // Add to cart with selected options
        addToCartWithOptions(productData);

        // Show success notification
        showNotification(`${productData.name} added to your bag! ✨`);

        // Close modal after adding
        setTimeout(() => {
            closeProductModal();
        }, 500);
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProductModal();
        }
    });
}

function addToCartWithOptions(productData) {
    const existingItemIndex = cart.findIndex(item =>
        item.id === productData.id &&
        item.selectedSize === productData.selectedSize &&
        item.selectedColor === productData.selectedColor
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += productData.quantity;
    } else {
        cart.push(productData);
    }

    updateCartUI();
    saveCart();
    showCartAddedAnimation();
}

// Make openProductModal globally available
window.openProductModal = openProductModal;

// Add click handlers to existing product cards
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to product cards for modal
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // Don't open modal if clicking on add to cart button
                if (e.target.closest('.add-to-cart-btn') || e.target.closest('.quick-view-btn')) {
                    return;
                }

                const productId = this.dataset.productId;
                if (!productId) {
                    // Try to get product ID from add to cart button
                    const addToCartBtn = this.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                        const btnProductId = addToCartBtn.dataset.productId;
                        if (btnProductId) {
                            openProductModal(parseInt(btnProductId));
                        }
                    }
                } else {
                    openProductModal(parseInt(productId));
                }
            });
        });
    }, 500);
});
