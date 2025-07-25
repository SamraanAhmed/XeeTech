// Global variables
let currentSlide = 0;
let cart = JSON.parse(localStorage.getItem('kuromiCart')) || [];
let products = [];
let trendingProducts = [];
let chatbotOpen = false;
let cartOpen = false;
let currentTrendingIndex = 0;

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Giant Kuromi Plush — Not Cursed (Probably)",
        price: 45.99,
        originalPrice: 65.99,
        image: "🖤",
        category: "plushies",
        trending: true,
        almostSoldOut: true
    },
    {
        id: 2,
        name: "Kuromi's Nightmare Hoodie",
        price: 39.99,
        originalPrice: 55.99,
        image: "👕",
        category: "clothing",
        trending: false,
        almostSoldOut: false
    },
    {
        id: 3,
        name: "Spooky Kawaii Phone Case",
        price: 19.99,
        originalPrice: 29.99,
        image: "📱",
        category: "accessories",
        trending: true,
        almostSoldOut: true
    },
    {
        id: 4,
        name: "Kuromi's Devil Horns Headband",
        price: 24.99,
        originalPrice: 34.99,
        image: "👹",
        category: "accessories",
        trending: false,
        almostSoldOut: false
    },
    {
        id: 5,
        name: "Gothic Lolita Mini Skirt",
        price: 42.99,
        originalPrice: 59.99,
        image: "👗",
        category: "clothing",
        trending: true,
        almostSoldOut: false
    },
    {
        id: 6,
        name: "Nightmare Tea Set",
        price: 89.99,
        originalPrice: 120.99,
        image: "🫖",
        category: "home",
        trending: false,
        almostSoldOut: true
    }
];

// Chatbot responses
const chatbotResponses = {
    greetings: [
        "Nyahaha~ Welcome to my nightmare shop! 🦇",
        "Looking for something spooky today? 😈",
        "What kind of chaos can I help you find? 💜"
    ],
    help: [
        "I can help you find products, track orders, or share some secrets! What do you need?",
        "Need help navigating my spooky store? Just ask!",
        "I'm here to make your shopping nightmare... I mean dream come true!"
    ],
    bestsellers: [
        "Our hellspawns are obsessed with the Giant Kuromi Plush and the Nightmare Hoodie! 🔥",
        "The Spooky Phone Case is flying off the shelves like a bat! 🦇",
        "Everyone's going crazy for our Gothic Lolita collection!"
    ],
    secret: [
        "Psst... type 'nightmare' for a secret discount code! 🤫",
        "Want a spooky surprise? There might be a hidden code around here...",
        "The best secrets are hidden in plain sight... try typing 'nightmare' 😉"
    ],
    nightmare: [
        "🎉 CONGRATS! Use code NIGHTMARE30 for 30% off your next order! This is our little secret~ 😈",
        "You found it! NIGHTMARE30 is your secret discount code! Don't tell anyone... except everyone! 💜"
    ],
    default: [
        "Hmm, I'm not sure about that! But I bet you'll find something spooky you'll love! 🖤",
        "That's beyond my nightmare powers, but feel free to browse our cursed collection!",
        "I might be a little devil, but I don't know everything! Try asking about our products! 😈"
    ]
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    loadProducts();
    updateCartUI();
    startHeroSlideshow();
    checkKonamiCode();
});

function initializeWebsite() {
    products = [...sampleProducts];
    trendingProducts = sampleProducts.filter(product => product.trending);

    // Show chatbot notification after 3 seconds
    setTimeout(() => {
        showChatNotification();
    }, 3000);

    // Auto-dismiss seasonal banner after 10 seconds
    setTimeout(() => {
        dismissSeasonalBanner();
    }, 10000);
}

function setupEventListeners() {
    // Seasonal banner close
    const bannerClose = document.getElementById('bannerClose');
    if (bannerClose) {
        bannerClose.addEventListener('click', dismissSeasonalBanner);
    }

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on nav links
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !navMenu.contains(e.target) &&
                !mobileToggle.contains(e.target) &&
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Search functionality
    const searchToggle = document.getElementById('searchToggle');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');

    if (searchToggle && searchDropdown) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSearchDropdown();
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchDropdown.contains(e.target) && !searchToggle.contains(e.target)) {
                closeSearchDropdown();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
                closeSearchDropdown();
            }
        });
    }

    if (searchSubmit) {
        searchSubmit.addEventListener('click', () => {
            performSearch(searchInput.value);
            closeSearchDropdown();
        });
    }

    // Hero navigation
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    if (heroPrev && heroNext) {
        heroPrev.addEventListener('click', () => changeSlide(-1));
        heroNext.addEventListener('click', () => changeSlide(1));
    }

    // Hero dots
    const heroDots = document.querySelectorAll('.hero-dot');
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Cart functionality
    const cartContainer = document.getElementById('cartContainer');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartContainer) {
        cartContainer.addEventListener('click', toggleCart);
    }
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendChatMessage);
    }
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }

    // Trending carousel
    const trendingPrev = document.getElementById('trendingPrev');
    const trendingNext = document.getElementById('trendingNext');
    if (trendingPrev && trendingNext) {
        trendingPrev.addEventListener('click', () => moveTrendingCarousel(-1));
        trendingNext.addEventListener('click', () => moveTrendingCarousel(1));
    }

    // Smooth scrolling for navigation links
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

    // Handle dropdown toggle on mobile
    setupMobileDropdown();
}

// Hero slideshow functionality
function startHeroSlideshow() {
    setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (slides.length === 0) return;

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Calculate new slide index
    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (slides.length === 0) return;

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Set new slide index
    currentSlide = index;

    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Product loading and display
function loadProducts() {
    displayBestsellers();
    displayTrending();
}

function displayBestsellers() {
    const bestsellersGrid = document.getElementById('bestsellersGrid');
    if (!bestsellersGrid) return;

    const bestsellers = products.slice(0, 6); // Show first 6 products as bestsellers

    bestsellersGrid.innerHTML = bestsellers.map(product =>
        createProductCard(product)
    ).join('');

    // Add event listeners to "Add to Cart" buttons
    bestsellersGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        });
    });
}

function displayTrending() {
    const trendingItems = document.getElementById('trendingItems');
    if (!trendingItems) return;

    trendingItems.innerHTML = trendingProducts.map(product =>
        createTrendingCard(product)
    ).join('');

    // Add event listeners to "Add to Cart" buttons
    trendingItems.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        });
    });
}

function createProductCard(product) {
    const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

    return `
        <div class="enhanced-home-product-card" data-product-id="${product.id}">
            <div class="card-magical-bg"></div>
            <div class="card-shimmer"></div>

            ${discountPercent > 0 ? `<div class="enhanced-sale-badge">🔥 ${discountPercent}% OFF!</div>` : ''}
            ${product.trending ? '<div class="trending-indicator">⭐ TRENDING</div>' : ''}
            ${product.almostSoldOut ? '<div class="stock-warning">⚡ LIMITED STOCK</div>' : ''}

            <div class="enhanced-product-image-container">
                <div class="image-magical-glow"></div>
                <div class="image-sparkle-effect"></div>
                <div class="enhanced-product-image">${product.image}</div>
                <div class="image-hover-overlay"></div>
            </div>

            <div class="enhanced-product-content">
                <h3 class="enhanced-product-title">${product.name}</h3>

                <div class="product-rating-home">
                    <div class="stars">★★★★★</div>
                    <span class="review-count">(${Math.floor(Math.random() * 200) + 50} reviews)</span>
                </div>

                <div class="enhanced-price-container">
                    ${product.originalPrice > product.price ?
                        `<span class="original-price-home">$${product.originalPrice}</span>` : ''}
                    <span class="enhanced-price-home">$${product.price}</span>
                </div>

                <div class="product-features-home">
                    <span class="feature-tag">💜 Premium</span>
                    <span class="feature-tag">🦇 Limited</span>
                </div>

                <button class="enhanced-home-add-to-cart add-to-cart" data-product-id="${product.id}">
                    <span class="btn-text">Add to Nightmare Bag</span>
                    <span class="btn-magic">✨</span>
                    <div class="btn-ripple-effect"></div>
                </button>
            </div>
        </div>
    `;
}

function createTrendingCard(product) {
    return `
        <div class="trending-item">
            ${product.almostSoldOut ? '<div class="almost-sold-out">Almost Sold Out!</div>' : ''}
            <div class="product-image">${product.image}</div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Trending carousel functionality
function moveTrendingCarousel(direction) {
    const trendingItems = document.getElementById('trendingItems');
    const itemWidth = 300; // 280px width + 20px gap
    const maxIndex = Math.max(0, trendingProducts.length - 3); // Show 3 items at once

    currentTrendingIndex += direction;
    if (currentTrendingIndex > maxIndex) currentTrendingIndex = 0;
    if (currentTrendingIndex < 0) currentTrendingIndex = maxIndex;

    const translateX = -currentTrendingIndex * itemWidth;
    trendingItems.style.transform = `translateX(${translateX}px)`;
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
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
                    <span class="empty-icon">👜</span>
                    <p>Your nightmare bag is empty</p>
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
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
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
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartOpen) {
        closeCart();
    } else {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        cartOpen = true;
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    cartOpen = false;
}

function saveCart() {
    localStorage.setItem('kuromiCart', JSON.stringify(cart));
}

function showCartAddedAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.animation = 'cartBounce 0.5s ease';
        setTimeout(() => {
            cartIcon.style.animation = '';
        }, 500);
    }
}

// Chatbot functionality
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatNotification = document.getElementById('chatNotification');

    if (chatbotOpen) {
        closeChatbot();
    } else {
        chatbotWindow.classList.add('active');
        chatbotOpen = true;
        if (chatNotification) {
            chatNotification.style.display = 'none';
        }
    }
}

function closeChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    chatbotWindow.classList.remove('active');
    chatbotOpen = false;
}

function sendChatMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const message = chatbotInput.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');

    // Clear input
    chatbotInput.value = '';

    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;

    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    if (message.includes('nightmare')) {
        return getRandomResponse(chatbotResponses.nightmare);
    } else if (message.includes('help') || message.includes('?')) {
        return getRandomResponse(chatbotResponses.help);
    } else if (message.includes('bestseller') || message.includes('popular') || message.includes('trending')) {
        return getRandomResponse(chatbotResponses.bestsellers);
    } else if (message.includes('secret') || message.includes('discount') || message.includes('code')) {
        return getRandomResponse(chatbotResponses.secret);
    } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(chatbotResponses.greetings);
    } else {
        return getRandomResponse(chatbotResponses.default);
    }
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function showChatNotification() {
    const chatNotification = document.getElementById('chatNotification');
    if (chatNotification && !chatbotOpen) {
        chatNotification.style.display = 'flex';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (!chatbotOpen) {
                chatNotification.style.display = 'none';
            }
        }, 5000);
    }
}

// Search functionality
let searchOpen = false;

function toggleSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchOpen) {
        closeSearchDropdown();
    } else {
        openSearchDropdown();
    }
}

function openSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');

    searchDropdown.classList.add('active');
    searchOpen = true;

    // Focus on input after animation
    setTimeout(() => {
        searchInput.focus();
    }, 100);
}

function closeSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');

    searchDropdown.classList.remove('active');
    searchOpen = false;
    searchInput.value = '';
}

function performSearch(query) {
    if (!query.trim()) return;

    const searchResults = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    // For demo purposes, just show an alert
    alert(`Found ${searchResults.length} spooky results for "${query}"! In a real implementation, this would show a search results page.`);
}

// Newsletter signup
function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('.newsletter-input').value;

    if (email) {
        // Simulate newsletter signup
        alert(`Welcome to Kuromi's cult... I mean club! 🦇 You'll receive spooky updates at ${email}`);
        e.target.reset();
    }
}

// Seasonal banner
function dismissSeasonalBanner() {
    const seasonalBanner = document.getElementById('seasonalBanner');
    if (seasonalBanner) {
        seasonalBanner.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            seasonalBanner.style.display = 'none';
        }, 300);
    }
}

// Konami Code Easter Egg
function checkKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
    ];
    let userInput = [];

    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        userInput = userInput.slice(-konamiCode.length);

        if (userInput.join(',') === konamiCode.join(',')) {
            launchKuromiBatGame();
        }
    });
}

function launchKuromiBatGame() {
    alert('🦇 KONAMI CODE ACTIVATED! 🦇\n\nKuromi\'s Bat Dodge Game would launch here!\n\nIn a full implementation, this would open a fun mini-game where you dodge flying bats and collect Kuromi items for discount codes!');
}

// Utility functions
function addCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Add some additional animations
addCSS(`
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`);

// Mock AR Try-On functionality (for demonstration)
function initARTryOn() {
    // This would integrate with camera APIs in a real implementation
    console.log('AR Try-On feature would be implemented here with WebRTC camera access');
}

// Track user interactions for analytics (mock)
function trackEvent(eventName, eventData) {
    console.log(`Event tracked: ${eventName}`, eventData);
    // In a real implementation, this would send data to analytics services
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        trackEvent('page_load_time', { time: loadTime });
    });

    // Monitor scroll behavior
    let scrollDepth = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (currentScroll > scrollDepth) {
            scrollDepth = currentScroll;
            if (scrollDepth % 25 === 0) {
                trackEvent('scroll_depth', { depth: scrollDepth });
            }
        }
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Mobile dropdown functionality
function setupMobileDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdown && dropdownMenu) {
        let isDropdownOpen = false;

        // Toggle dropdown on mobile
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                isDropdownOpen = !isDropdownOpen;

                if (isDropdownOpen) {
                    dropdownMenu.style.display = 'block';
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                } else {
                    dropdownMenu.style.display = 'none';
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                }
            }
        });

        // Reset dropdown on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                dropdownMenu.style.display = '';
                dropdownMenu.style.opacity = '';
                dropdownMenu.style.visibility = '';
                isDropdownOpen = false;
            }
        });
    }
}

// Shop page functions
function loadShopProducts() {
    const allProducts = [
        ...sampleProducts,
        // Add more products for each category
        {
            id: 7,
            name: "Sleepy Kuromi Pillow",
            price: 29.99,
            originalPrice: 39.99,
            image: "🛏️",
            category: "plushies",
            trending: false,
            almostSoldOut: false
        },
        {
            id: 8,
            name: "Gothic Choker Necklace",
            price: 15.99,
            originalPrice: 22.99,
            image: "📿",
            category: "accessories",
            trending: false,
            almostSoldOut: true
        },
        {
            id: 9,
            name: "Nightmare Pajama Set",
            price: 54.99,
            originalPrice: 74.99,
            image: "🩱",
            category: "clothing",
            trending: false,
            almostSoldOut: false
        },
        {
            id: 10,
            name: "Cursed Coffee Mug",
            price: 12.99,
            originalPrice: 17.99,
            image: "☕",
            category: "home",
            trending: false,
            almostSoldOut: false
        }
    ];

    // Load products by category
    displayProductsByCategory('plushies', allProducts.filter(p => p.category === 'plushies'), 'plushiesGrid');
    displayProductsByCategory('accessories', allProducts.filter(p => p.category === 'accessories'), 'accessoriesGrid');
    displayProductsByCategory('clothing', allProducts.filter(p => p.category === 'clothing'), 'clothingGrid');
    displayProductsByCategory('home', allProducts.filter(p => p.category === 'home'), 'homeGrid');
}

function displayProductsByCategory(category, products, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = products.map(product => createProductCard(product)).join('');

    // Add event listeners
    grid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        });
    });
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

function loadTrendingPageProducts() {
    // Get top 3 trending products
    const trendingProducts = sampleProducts.filter(p => p.trending).slice(0, 3);

    const showcase = document.getElementById('trendingShowcase');
    if (!showcase) return;

    showcase.innerHTML = trendingProducts.map((product, index) =>
        createEnhancedProductCard(product, index + 1)
    ).join('');

    // Add event listeners for enhanced cards
    showcase.querySelectorAll('.enhanced-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);

            // Add success animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });

    // Add advanced interactions for enhanced cards
    addEnhancedCardInteractions();
}

function createEnhancedProductCard(product, rank) {
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return `
        <div class="enhanced-product-card" data-product-id="${product.id}">
            <div class="card-particles"></div>
            <div class="card-glow-effect"></div>

            <div class="trending-rank">#${rank}</div>
            <div class="trending-badge ${product.almostSoldOut ? 'almost-gone' : ''}">
                ${product.almostSoldOut ? '⚡ ALMOST GONE' : '🔥 HOT'}
            </div>

            ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}

            <div class="enhanced-product-image">
                <div class="image-sparkles"></div>
                <div class="image-glow"></div>
                <span class="product-emoji">${product.image}</span>
                <div class="image-reflection"></div>
            </div>

            <div class="product-details">
                <h3 class="enhanced-product-title">${product.name}</h3>

                <div class="price-container">
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    <span class="enhanced-product-price">$${product.price}</span>
                </div>

                <div class="product-rating">
                    <div class="stars">★★★★★</div>
                    <span class="review-count">(${Math.floor(Math.random() * 500) + 100} reviews)</span>
                </div>

                <div class="product-features">
                    <span class="feature">✨ Premium Quality</span>
                    <span class="feature">🦇 Limited Edition</span>
                    <span class="feature">💜 Kuromi Certified</span>
                </div>
            </div>

            <button class="enhanced-add-to-cart add-to-cart" data-product-id="${product.id}">
                <span class="btn-text">Add to Nightmare Bag</span>
                <span class="btn-icon">🛒</span>
                <div class="btn-ripple"></div>
            </button>
        </div>
    `;
}

function displayTrendingGrid(gridId, products) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = products.map(product => createProductCard(product)).join('');

    // Add event listeners
    grid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        });
    });
}

// Update navigation highlighting based on current page
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown .nav-link)');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage.includes('shop') && href.includes('shop')) ||
            (currentPage.includes('trending') && href.includes('trending')) ||
            (currentPage.includes('about') && href.includes('about'))) {
            link.classList.add('active');
        }
    });
}

// Initialize based on current page
function initializePage() {
    updateActiveNavigation();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'shop.html':
            loadShopProducts();
            setupCategoryFilters();
            break;
        case 'trending.html':
            loadTrendingPageProducts();
            break;
        case 'about.html':
            // About page specific initialization if needed
            break;
        default:
            // Homepage initialization
            break;
    }
}

// Call initialization on page load
document.addEventListener('DOMContentLoaded', initializePage);

// Enhanced Card Interactions
function addEnhancedCardInteractions() {
    const cards = document.querySelectorAll('.enhanced-product-card');

    cards.forEach(card => {
        // Mouse follow effect for glow
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `
                translateY(-25px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.08)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        // Ripple effect on click
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';

            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;

            card.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Particle burst on hover
        let particleTimeout;
        card.addEventListener('mouseenter', () => {
            clearTimeout(particleTimeout);
            createParticleBurst(card);
        });

        card.addEventListener('mouseleave', () => {
            particleTimeout = setTimeout(() => {
                const particles = card.querySelectorAll('.hover-particle');
                particles.forEach(p => p.remove());
            }, 1000);
        });
    });
}

function createParticleBurst(card) {
    const colors = ['#9d7cff', '#ff9dd2', '#a0ffb3'];
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'hover-particle';

        const angle = (360 / particleCount) * i;
        const distance = 150 + Math.random() * 50;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;

        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: particleBurst 2s ease-out forwards;
            animation-delay: ${i * 0.1}s;
            box-shadow: 0 0 10px currentColor;
            z-index: 5;
            pointer-events: none;
        `;

        particle.style.setProperty('--end-x', x + 'px');
        particle.style.setProperty('--end-y', y + 'px');

        card.appendChild(particle);
    }
}

// Add CSS animations for particles and ripples
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    @keyframes particleBurst {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
            opacity: 0;
        }
    }

    .enhanced-product-card:hover {
        animation-play-state: paused;
    }
`;
document.head.appendChild(enhancedStyles);

// Export functions for potential external use
window.KuromiShop = {
    addToCart,
    toggleCart,
    toggleChatbot,
    performSearch,
    trackEvent,
    loadShopProducts,
    loadTrendingPageProducts,
    setupCategoryFilters,
    addEnhancedCardInteractions
};

console.log('🦇 Welcome to Kuromi\'s Nightmare Shop! 🖤');
console.log('Try typing "nightmare" in the chatbot for a secret surprise! 😈');
console.log('🔧 Navbar and dropdown functionality optimized for all devices! 📱💻');
