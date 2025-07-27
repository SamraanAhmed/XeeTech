// Simple Checkout functionality
let cart = [];
let appliedPromoCode = null;
let promoDiscount = 0;

// Promo codes
const promoCodes = {
    'NIGHTMARE30': { discount: 0.30, type: 'percentage' },
    'MISCHIEF10': { discount: 0.10, type: 'percentage' },
    'WELCOME15': { discount: 0.15, type: 'percentage' },
    'FREESHIP': { discount: 5.99, type: 'fixed' }
};

// Function to refresh cart from localStorage
function refreshCart() {
    try {
        const storedCart = localStorage.getItem('kuromiCart');
        cart = storedCart ? JSON.parse(storedCart) : [];
        console.log('Cart refreshed:', cart);
        return cart;
    } catch (e) {
        console.error('Error refreshing cart:', e);
        cart = [];
        return cart;
    }
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    // Refresh cart from localStorage
    refreshCart();

    initializeCheckout();
    setupEventListeners();
    updateOrderTotals();
});

function initializeCheckout() {
    // Debug cart contents
    console.log('Cart contents:', cart);
    console.log('Cart length:', cart.length);

    // Check if cart is empty
    if (cart.length === 0) {
        showEmptyCartMessage();
        return;
    }

    // Set up mobile menu
    setupMobileMenu();

    // Populate order items
    populateOrderItems();

    // Update totals
    updateOrderTotals();
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Promo code application
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }

    // Enter key for promo code
    const promoInput = document.getElementById('promoCode');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }

    // Confirm order button
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', confirmOrder);
    }
}

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

function showEmptyCartMessage() {
    const checkoutContent = document.querySelector('.checkout-content');
    checkoutContent.innerHTML = `
        <div class="empty-cart">
            <div class="empty-icon">🛍️</div>
            <h2>Your cart is empty</h2>
            <p>Add some mischievous fashion to your cart before checking out!</p>
            <a href="shop.html" class="shop-btn">
                <span>Continue Shopping</span>
                <span>✨</span>
            </a>
        </div>
    `;
}

function populateOrderItems() {
    const orderItems = document.getElementById('orderItems');
    console.log('Order items element:', orderItems);

    if (!orderItems) {
        console.error('orderItems element not found!');
        return;
    }

    console.log('Populating order items for cart:', cart);

    const itemsHTML = cart.map(item => {
        console.log('Processing item:', item);
        const itemTotal = (item.price * item.quantity).toFixed(2);

        return `
            <div class="order-item">
                <div class="item-image">
                    ${item.emoji || '🖤'}
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">$${itemTotal}</div>
            </div>
        `;
    }).join('');

    console.log('Generated HTML:', itemsHTML);
    orderItems.innerHTML = itemsHTML;
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateOrderTotals() {
    const subtotal = calculateSubtotal();
    const shipping = 5.99;
    const discount = promoDiscount;
    const total = subtotal + shipping - discount;
    
    // Update subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update final total
    const finalTotal = document.getElementById('finalTotal');
    const btnTotal = document.getElementById('btnTotal');
    
    if (finalTotal) finalTotal.textContent = `$${total.toFixed(2)}`;
    if (btnTotal) btnTotal.textContent = `$${total.toFixed(2)}`;
    
    // Show/hide discount
    const orderTotals = document.querySelector('.order-totals');
    const existingDiscount = orderTotals.querySelector('.discount-row');
    
    if (discount > 0) {
        if (!existingDiscount) {
            const discountRow = document.createElement('div');
            discountRow.className = 'total-row discount-row';
            discountRow.innerHTML = `
                <span>Discount (${appliedPromoCode}):</span>
                <span>-$${discount.toFixed(2)}</span>
            `;
            orderTotals.insertBefore(discountRow, orderTotals.querySelector('.total-final'));
        } else {
            existingDiscount.innerHTML = `
                <span>Discount (${appliedPromoCode}):</span>
                <span>-$${discount.toFixed(2)}</span>
            `;
        }
    } else if (existingDiscount) {
        existingDiscount.remove();
    }
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a promo code', 'error');
        return;
    }
    
    if (appliedPromoCode === code) {
        showNotification('This promo code is already applied', 'info');
        return;
    }
    
    if (promoCodes[code]) {
        const promo = promoCodes[code];
        const subtotal = calculateSubtotal();
        
        if (promo.type === 'percentage') {
            promoDiscount = subtotal * promo.discount;
        } else {
            promoDiscount = promo.discount;
        }
        
        appliedPromoCode = code;
        promoInput.value = code;
        promoInput.disabled = true;
        
        const applyBtn = document.getElementById('applyPromo');
        applyBtn.textContent = 'Applied ✓';
        applyBtn.disabled = true;
        applyBtn.style.background = '#28a745';
        
        updateOrderTotals();
        showNotification(`Promo code applied! You saved $${promoDiscount.toFixed(2)}`, 'success');
    } else {
        showNotification('Invalid promo code', 'error');
        promoInput.focus();
    }
}

function confirmOrder() {
    // Validate form
    const form = document.getElementById('checkoutForm');
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    
    if (!name) {
        showNotification('Please enter your name', 'error');
        document.getElementById('customerName').focus();
        return;
    }
    
    if (!email) {
        showNotification('Please enter your email', 'error');
        document.getElementById('customerEmail').focus();
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        document.getElementById('customerEmail').focus();
        return;
    }
    
    // Show processing state
    const confirmBtn = document.getElementById('confirmOrderBtn');
    const originalHTML = confirmBtn.innerHTML;
    
    confirmBtn.innerHTML = '<span>Processing... ⏳</span>';
    confirmBtn.disabled = true;
    confirmBtn.style.background = 'linear-gradient(45deg, #9932CC, #FFB6C1)';
    confirmBtn.style.opacity = '0.8';
    
    // Process order
    setTimeout(() => {
        processOrder();
    }, 2000);
}

function processOrder() {
    // Generate order ID
    const orderId = 'KUR-' + Date.now();
    
    // Collect order data
    const orderData = {
        orderId,
        items: [...cart],
        customer: {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        },
        pricing: {
            subtotal: calculateSubtotal(),
            shipping: 5.99,
            discount: promoDiscount,
            total: calculateSubtotal() + 5.99 - promoDiscount
        },
        promoCode: appliedPromoCode,
        orderDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('kuromiOrders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('kuromiCart');
    
    // Show confetti
    createConfetti();
    
    // Show success page
    setTimeout(() => {
        showOrderSuccess(orderData);
    }, 1500);
}

function showOrderSuccess(orderData) {
    document.body.innerHTML = `
        <div class="order-success">
            <div class="success-container">
                <div class="success-animation">
                    <div class="success-icon">🎉</div>
                    <div class="kuromi-celebration">🖤💜</div>
                </div>
                
                <h1 class="success-title">Order Confirmed!</h1>
                <p class="success-message">Thank you ${orderData.customer.name}! Your mischievous order has been placed successfully.</p>
                
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-row">
                        <span>Order ID:</span>
                        <span class="order-id">${orderData.orderId}</span>
                    </div>
                    <div class="summary-row">
                        <span>Items:</span>
                        <span>${orderData.items.length} item(s)</span>
                    </div>
                    <div class="summary-row">
                        <span>Total:</span>
                        <span class="total-amount">$${orderData.pricing.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <p class="confirmation-email">A confirmation email will be sent to ${orderData.customer.email}</p>
                
                <div class="success-actions">
                    <a href="index.html" class="btn-primary">Back to Home</a>
                    <a href="shop.html" class="btn-secondary">Continue Shopping</a>
                </div>
            </div>
        </div>
    `;
    
    // Add success page styles
    addSuccessPageStyles();
}

function addSuccessPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Success Page Styles */
        body {
            margin: 0;
            font-family: 'Quicksand', sans-serif;
            background: linear-gradient(135deg, #F8E6F2 0%, #FFFFFF 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .order-success {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .success-container {
            background: white;
            border-radius: 20px;
            padding: 50px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(153, 50, 204, 0.1);
            animation: slideUp 0.6s ease-out;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .success-animation {
            margin-bottom: 30px;
        }
        
        .success-icon {
            font-size: 4em;
            margin-bottom: 10px;
            animation: bounce 1s ease-in-out infinite;
        }
        
        .kuromi-celebration {
            font-size: 2em;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .success-title {
            color: #2E2E2E;
            font-size: 2.5em;
            margin-bottom: 15px;
            font-family: 'Creepster', cursive;
        }
        
        .success-message {
            color: #2E2E2E;
            font-size: 1.2em;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .order-summary {
            background: #F8E6F2;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
        }
        
        .order-summary h3 {
            color: #9932CC;
            margin-bottom: 20px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
        }
        
        .order-id {
            font-family: monospace;
            background: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        
        .total-amount {
            font-weight: 700;
            color: #9932CC;
            font-size: 1.1em;
        }
        
        .confirmation-email {
            color: #666;
            font-size: 0.9em;
            margin: 20px 0;
        }
        
        .success-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        }
        
        .btn-primary, .btn-secondary {
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #9932CC, #FFB6C1);
            color: white;
        }
        
        .btn-secondary {
            background: transparent;
            color: #9932CC;
            border: 2px solid #9932CC;
        }
        
        .btn-primary:hover, .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(153, 50, 204, 0.3);
        }
        
        @media (max-width: 768px) {
            .success-container {
                padding: 30px 20px;
            }
            
            .success-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
    document.body.appendChild(confettiContainer);

    // Kuromi-themed confetti
    const confettiColors = ['#9932CC', '#FFB6C1', '#000000', '#FFFFFF'];
    const confettiShapes = ['🎀', '🖤', '💜', '✨', '🦇', '💫'];

    function createConfettiPiece() {
        const piece = document.createElement('div');
        const isEmoji = Math.random() > 0.3;

        if (isEmoji) {
            piece.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            piece.style.fontSize = (Math.random() * 20 + 15) + 'px';
        } else {
            piece.style.width = piece.style.height = (Math.random() * 8 + 4) + 'px';
            piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            piece.style.borderRadius = '50%';
        }

        piece.style.cssText += `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;

        return piece;
    }

    // Create confetti burst
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const piece = createConfettiPiece();
            confettiContainer.appendChild(piece);

            setTimeout(() => {
                if (piece.parentNode) {
                    piece.parentNode.removeChild(piece);
                }
            }, 5000);
        }, i * 30);
    }

    // Add CSS animation
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-20px) rotateZ(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotateZ(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Clean up
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 8000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const colors = {
        success: 'linear-gradient(45deg, #28a745, #20c997)',
        error: 'linear-gradient(45deg, #dc3545, #fd7e14)',
        info: 'linear-gradient(45deg, #9932CC, #FFB6C1)'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Initialize cart count
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
