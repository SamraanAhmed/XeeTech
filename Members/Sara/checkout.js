// Checkout page functionality
let cart = JSON.parse(localStorage.getItem('kuromiCart')) || [];
let selectedShipping = 'standard';
let selectedPayment = 'credit-card';
let appliedPromoCode = null;
let promoDiscount = 0;

// Shipping costs
const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99
};

// Promo codes
const promoCodes = {
    'NIGHTMARE30': { discount: 0.30, type: 'percentage' },
    'MISCHIEF10': { discount: 0.10, type: 'percentage' },
    'WELCOME15': { discount: 0.15, type: 'percentage' },
    'FREESHIP': { discount: 5.99, type: 'fixed' }
};

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    setupEventListeners();
    updateOrderSummary();
});

function initializeCheckout() {
    // Check if cart is empty
    if (cart.length === 0) {
        showEmptyCartMessage();
        return;
    }

    // Set up mobile menu functionality
    setupMobileMenu();
    
    // Populate order summary
    populateOrderSummary();
    
    // Auto-fill customer info if available
    loadSavedCustomerInfo();
    
    // Set default shipping method
    updateShippingCost();
    
    // Show/hide payment forms based on selection
    togglePaymentForm();
    
    // Format card number input
    formatCardInputs();
}

function setupEventListeners() {
    // Mobile order summary toggle
    const orderToggle = document.getElementById('orderToggle');
    if (orderToggle) {
        orderToggle.addEventListener('click', toggleMobileOrderSummary);
    }

    // Shipping method selection
    document.querySelectorAll('input[name="shipping"]').forEach(input => {
        input.addEventListener('change', function() {
            selectedShipping = this.value;
            updateShippingCost();
            updateOrderSummary();
        });
    });

    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach(input => {
        input.addEventListener('change', function() {
            selectedPayment = this.value;
            togglePaymentForm();
        });
    });

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

    // Complete order button
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', processOrder);
    }

    // Form validation on input
    setupFormValidation();
    
    // Country selection
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countrySelect.addEventListener('change', updateTaxCalculation);
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
    const checkoutMain = document.querySelector('.checkout-main');
    checkoutMain.innerHTML = `
        <div class="container">
            <div class="empty-checkout">
                <div class="empty-icon">🛍️</div>
                <h2>Your cart is empty</h2>
                <p>Add some mischievous fashion to your cart before checking out!</p>
                <a href="shop.html" class="shop-btn">
                    <span>Continue Shopping</span>
                    <span>✨</span>
                </a>
            </div>
        </div>
    `;
    
    // Add styles for empty cart
    const style = document.createElement('style');
    style.textContent = `
        .empty-checkout {
            text-align: center;
            padding: 80px 20px;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .empty-icon {
            font-size: 4em;
            margin-bottom: 20px;
        }
        
        .empty-checkout h2 {
            color: var(--midnight-black);
            margin-bottom: 15px;
            font-size: 1.8em;
        }
        
        .empty-checkout p {
            color: var(--midnight-black);
            opacity: 0.7;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .shop-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(45deg, var(--deep-orchid), var(--bubblegum-pink));
            color: var(--soft-white);
            padding: 15px 30px;
            border-radius: var(--radius-large);
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition-smooth);
        }
        
        .shop-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--glow-effect);
        }
    `;
    document.head.appendChild(style);
}

function populateOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const orderDetailsMobile = document.getElementById('orderDetailsMobile');
    
    const itemsHTML = cart.map(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const options = [];
        if (item.selectedSize) options.push(`Size: ${item.selectedSize}`);
        if (item.selectedColor) options.push(`Color: ${item.selectedColor}`);
        
        return `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.style.display='none'">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    ${options.length > 0 ? `<div class="item-options">${options.join(', ')}</div>` : ''}
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">$${itemTotal}</div>
            </div>
        `;
    }).join('');
    
    if (summaryItems) {
        summaryItems.innerHTML = itemsHTML;
    }
    
    if (orderDetailsMobile) {
        orderDetailsMobile.innerHTML = itemsHTML;
    }
}

function toggleMobileOrderSummary() {
    const orderToggle = document.getElementById('orderToggle');
    const orderDetailsMobile = document.getElementById('orderDetailsMobile');
    
    orderToggle.classList.toggle('active');
    orderDetailsMobile.classList.toggle('active');
}

function updateShippingCost() {
    const shippingCostElement = document.getElementById('shippingCost');
    const cost = shippingCosts[selectedShipping];
    
    if (shippingCostElement) {
        shippingCostElement.textContent = `$${cost.toFixed(2)}`;
    }
}

function updateTaxCalculation() {
    const country = document.getElementById('country').value;
    const subtotal = calculateSubtotal();
    let taxRate = 0;
    
    // Simple tax calculation based on country
    switch (country) {
        case 'US':
            taxRate = 0.08; // 8% average sales tax
            break;
        case 'CA':
            taxRate = 0.13; // 13% HST
            break;
        case 'UK':
            taxRate = 0.20; // 20% VAT
            break;
        case 'AU':
            taxRate = 0.10; // 10% GST
            break;
        case 'DE':
        case 'FR':
            taxRate = 0.19; // 19% VAT
            break;
        default:
            taxRate = 0;
    }
    
    const taxAmount = subtotal * taxRate;
    const taxAmountElement = document.getElementById('taxAmount');
    
    if (taxAmountElement) {
        taxAmountElement.textContent = `$${taxAmount.toFixed(2)}`;
    }
    
    updateOrderSummary();
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTax() {
    const taxElement = document.getElementById('taxAmount');
    if (taxElement) {
        const taxText = taxElement.textContent.replace('$', '');
        return parseFloat(taxText) || 0;
    }
    return 0;
}

function updateOrderSummary() {
    const subtotal = calculateSubtotal();
    const shipping = shippingCosts[selectedShipping];
    const tax = calculateTax();
    const discount = promoDiscount;
    const total = subtotal + shipping + tax - discount;
    
    // Update subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update discount
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    if (discount > 0) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = `-$${discount.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }
    
    // Update total
    const orderTotal = document.getElementById('orderTotal');
    const finalTotal = document.getElementById('finalTotal');
    const orderTotalMobile = document.getElementById('orderTotalMobile');
    
    if (orderTotal) orderTotal.textContent = `$${total.toFixed(2)}`;
    if (finalTotal) finalTotal.textContent = `$${total.toFixed(2)}`;
    if (orderTotalMobile) orderTotalMobile.textContent = `$${total.toFixed(2)}`;
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a promo code');
        return;
    }
    
    if (appliedPromoCode === code) {
        showNotification('This promo code is already applied');
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
        
        updateOrderSummary();
        showNotification(`Promo code applied! You saved $${promoDiscount.toFixed(2)}`);
    } else {
        showNotification('Invalid promo code');
        promoInput.focus();
    }
}

function togglePaymentForm() {
    const cardForm = document.getElementById('cardForm');
    
    if (selectedPayment === 'credit-card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

function formatCardInputs() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

function setupFormValidation() {
    // Real-time validation for required fields
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function validateEmail(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
    
    // Add error styles
    if (!document.getElementById('validation-styles')) {
        const style = document.createElement('style');
        style.id = 'validation-styles';
        style.textContent = `
            .form-group input.error,
            .form-group select.error {
                border-color: #dc3545;
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
            }
            
            .field-error {
                color: #dc3545;
                font-size: 0.8em;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function validateAllForms() {
    let isValid = true;
    
    // Validate customer information
    const customerForm = document.getElementById('customerForm');
    const requiredCustomerFields = customerForm.querySelectorAll('input[required], select[required]');
    
    requiredCustomerFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email
    const emailField = document.getElementById('email');
    if (!validateEmail(emailField)) {
        isValid = false;
    }
    
    // Validate shipping address
    const shippingForm = document.getElementById('shippingForm');
    const requiredShippingFields = shippingForm.querySelectorAll('input[required], select[required]');
    
    requiredShippingFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate payment method
    if (selectedPayment === 'credit-card') {
        const cardForm = document.getElementById('cardForm');
        const requiredCardFields = cardForm.querySelectorAll('input[required]');
        
        requiredCardFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate card number
        const cardNumber = document.getElementById('cardNumber');
        const cardValue = cardNumber.value.replace(/\s/g, '');
        if (cardValue.length < 13 || cardValue.length > 19) {
            showFieldError(cardNumber, 'Please enter a valid card number');
            isValid = false;
        }
        
        // Validate expiry date
        const expiryDate = document.getElementById('expiryDate');
        const expiryValue = expiryDate.value;
        if (expiryValue.length !== 5) {
            showFieldError(expiryDate, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }
        
        // Validate CVV
        const cvv = document.getElementById('cvv');
        const cvvValue = cvv.value;
        if (cvvValue.length < 3 || cvvValue.length > 4) {
            showFieldError(cvv, 'Please enter a valid CVV');
            isValid = false;
        }
    }
    
    return isValid;
}

function processOrder() {
    // Validate all forms
    if (!validateAllForms()) {
        showNotification('Please correct the errors in the form');

        // Scroll to first error
        const firstError = document.querySelector('.field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Add immediate button celebration on click
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    completeOrderBtn.classList.add('btn-celebration');

    // Mini confetti burst on button click
    createMiniConfetti(completeOrderBtn);
    
    // Show processing state with celebration
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    const originalText = completeOrderBtn.innerHTML;

    // Add processing animation
    completeOrderBtn.innerHTML = '<span>Processing Order...</span> ⏳';
    completeOrderBtn.disabled = true;
    completeOrderBtn.style.background = 'linear-gradient(45deg, #9932CC, #FFB6C1, #9932CC, #FFB6C1)';
    completeOrderBtn.style.backgroundSize = '400% 400%';
    completeOrderBtn.style.animation = 'processingGradient 1s ease-in-out infinite';

    // Add processing animation CSS if not exists
    if (!document.getElementById('processing-styles')) {
        const style = document.createElement('style');
        style.id = 'processing-styles';
        style.textContent = `
            @keyframes processingGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            .btn-celebration {
                animation: btnCelebrate 0.6s ease-in-out;
            }

            @keyframes btnCelebrate {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.1) rotate(-2deg); }
                75% { transform: scale(1.1) rotate(2deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Collect order data
    const orderData = collectOrderData();
    
    // Simulate order processing
    setTimeout(() => {
        // Generate order ID
        const orderId = 'KUR-' + Date.now();

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
        orders.push({
            ...orderData,
            orderId,
            orderDate: new Date().toISOString(),
            status: 'confirmed'
        });
        localStorage.setItem('kuromiOrders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('kuromiCart');

        // 🎉 TRIGGER CONFETTI CELEBRATION! 🎉
        triggerOrderConfetti();

        // Show success page after confetti starts
        setTimeout(() => {
            showOrderSuccess(orderId, orderData);
        }, 1500);

    }, 2000);
}

function collectOrderData() {
    const subtotal = calculateSubtotal();
    const shipping = shippingCosts[selectedShipping];
    const tax = calculateTax();
    const discount = promoDiscount;
    const total = subtotal + shipping + tax - discount;
    
    return {
        items: [...cart],
        customer: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        },
        shipping: {
            country: document.getElementById('country').value,
            address: document.getElementById('address').value,
            apartment: document.getElementById('apartment').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            method: selectedShipping
        },
        payment: {
            method: selectedPayment
        },
        pricing: {
            subtotal,
            shipping,
            tax,
            discount,
            total
        },
        promoCode: appliedPromoCode,
        notes: document.getElementById('orderNotes').value
    };
}

function showOrderSuccess(orderId, orderData) {
    // Replace page content with success message
    document.body.innerHTML = `
        <div class="order-success">
            <div class="success-container">
                <div class="success-icon">🎉</div>
                <h1 class="success-title">Order Confirmed!</h1>
                <p class="success-message">Thank you ${orderData.customer.firstName}! Your mischievous order has been placed successfully.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <div class="detail-row">
                        <span>Order ID:</span>
                        <span>${orderId}</span>
                    </div>
                    <div class="detail-row">
                        <span>Total:</span>
                        <span>$${orderData.pricing.total.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Items:</span>
                        <span>${orderData.items.length} item(s)</span>
                    </div>
                    <div class="detail-row">
                        <span>Shipping Method:</span>
                        <span>${orderData.shipping.method}</span>
                    </div>
                </div>
                
                <p class="confirmation-note">A confirmation email will be sent to ${orderData.customer.email}</p>
                
                <div class="success-actions">
                    <a href="index.html" class="btn-primary">Continue Shopping</a>
                    <a href="shop.html" class="btn-secondary">View Products</a>
                </div>
            </div>
        </div>
    `;
    
    // Add success page styles
    const style = document.createElement('style');
    style.textContent = `
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
        }
        
        .success-icon {
            font-size: 5em;
            margin-bottom: 20px;
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
        
        .order-details {
            background: #F8E6F2;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: left;
        }
        
        .order-details h3 {
            color: #9932CC;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(153, 50, 204, 0.1);
        }
        
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .confirmation-note {
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

function loadSavedCustomerInfo() {
    // Load any saved customer information from localStorage
    const savedInfo = JSON.parse(localStorage.getItem('kuromiCustomerInfo') || '{}');
    
    Object.keys(savedInfo).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = savedInfo[key];
        }
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'checkout-notification';
    notification.innerHTML = `
        <div class="notification-content">
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Confetti Animation Function
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.id = 'confetti-container';
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

    // Kuromi-themed confetti colors and shapes
    const confettiColors = ['#9932CC', '#FFB6C1', '#000000', '#FFFFFF', '#F8E6F2'];
    const confettiShapes = ['🎀', '🖤', '💜', '✨', '🦇', '💫', '⭐', '🌟'];
    const confettiTypes = ['circle', 'square', 'emoji'];

    function createConfettiPiece() {
        const piece = document.createElement('div');
        const type = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];

        if (type === 'emoji') {
            piece.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            piece.style.fontSize = (Math.random() * 20 + 15) + 'px';
        } else {
            piece.style.width = piece.style.height = (Math.random() * 10 + 5) + 'px';
            piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            if (type === 'square') {
                piece.style.borderRadius = '2px';
            } else {
                piece.style.borderRadius = '50%';
            }
        }

        piece.style.cssText += `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;

        return piece;
    }

    // Create confetti burst
    function confettiBurst() {
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                if (document.getElementById('confetti-container')) {
                    const piece = createConfettiPiece();
                    confettiContainer.appendChild(piece);

                    // Remove piece after animation
                    setTimeout(() => {
                        if (piece.parentNode) {
                            piece.parentNode.removeChild(piece);
                        }
                    }, 5000);
                }
            }, i * 20);
        }
    }

    // Add CSS animation for falling confetti
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-20px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotateX(360deg) rotateY(180deg) rotateZ(360deg);
                    opacity: 0;
                }
            }

            @keyframes confettiSpin {
                0% { transform: rotateZ(0deg); }
                100% { transform: rotateZ(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Start confetti burst
    confettiBurst();

    // Add extra bursts for more celebration
    setTimeout(confettiBurst, 300);
    setTimeout(confettiBurst, 600);

    // Clean up container after animation
    setTimeout(() => {
        if (document.getElementById('confetti-container')) {
            document.body.removeChild(confettiContainer);
        }
    }, 8000);
}

// Enhanced Order Success with Confetti
function triggerOrderConfetti() {
    // Create multiple confetti bursts
    createConfetti();

    // Add extra celebration effects
    setTimeout(createConfetti, 1000);

    // Show celebration notification
    setTimeout(() => {
        showNotification('🎉 Congratulations! Your order is confirmed! 🦇');
    }, 500);
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
updateCartCount();
