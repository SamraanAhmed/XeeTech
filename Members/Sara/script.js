// Global variables
let cart = JSON.parse(localStorage.getItem('kuromiCart')) || [];
let searchOpen = false;
let cartOpen = false;

// Sample limited edition products
const limitedProducts = [
    {
        id: 1,
        name: "Kuromi Devil Wings Jacket",
        price: 89.99,
        image: "🦇",
        badge: "Limited Edition"
    },
    {
        id: 2,
        name: "Mischievous Heart Necklace",
        price: 45.99,
        image: "💜",
        badge: "Almost Gone"
    },
    {
        id: 3,
        name: "Gothic Lolita Dress Set",
        price: 129.99,
        image: "👗",
        badge: "New Arrival"
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    loadLimitedProducts();
    updateCartUI();
});

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
            document.querySelector('.category-preview').scrollIntoView({
                behavior: 'smooth'
            });
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
        // Close search dropdown
        if (!e.target.closest('.search-dropdown') && !e.target.closest('#searchBtn')) {
            closeSearch();
        }

        // Close mobile menu
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
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
    
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');
    
    navMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
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
    
    searchDropdown.classList.add('active');
    searchOpen = true;
    
    // Focus on input after animation
    setTimeout(() => {
        searchInput.focus();
    }, 150);
}

function closeSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    
    searchDropdown.classList.remove('active');
    searchOpen = false;
    searchInput.value = '';
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // In a real implementation, this would perform actual search
    alert(`Searching for "${query}"... In a real implementation, this would show search results!`);
    closeSearch();
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
    if (!limitedProductsContainer) return;

    limitedProductsContainer.innerHTML = limitedProducts.map(product => 
        createProductCard(product)
    ).join('');

    // Add event listeners to product buttons
    limitedProductsContainer.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId || e.target.closest('.add-to-cart-btn').dataset.productId);
            addToCart(productId);
        });
    });
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-badge">${product.badge}</div>
            <div class="product-image-container">
                <img src="placeholder-product.jpg" alt="${product.name}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="product-image-placeholder" style="display: flex;">
                    <span class="placeholder-icon">${product.image}</span>
                </div>
                <button class="quick-view-btn" title="Quick View">👁️</button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <span class="btn-text">Add to Bag</span>
                    <span class="btn-sparkle">✨</span>
                </button>
            </div>
        </div>
    `;
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
    return `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-item" data-product-id="${item.id}">Remove</button>
                </div>
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
    if (cartOpen) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    cartOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

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

    // Observe elements that should animate on scroll
    const elementsToObserve = document.querySelectorAll('.category-card, .product-card, .review-bubble, .social-frame');
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
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

            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productCard.querySelector('.placeholder-icon').textContent,
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
            const productName = productCard.querySelector('.product-title').textContent;
            showNotification(`Quick view for ${productName} would open here!`);
        });
    });
}

function addToCartFromShop(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    updateCartUI();
    saveCart();
    showCartAddedAnimation();
    showNotification(`${product.name} added to your bag!`);
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

console.log('🦇 Welcome to Kuromi\'s Fashion Empire! 💜');
console.log('Try the Konami code for a special surprise! ✨');
