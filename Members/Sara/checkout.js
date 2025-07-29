// Single Page Checkout System - Simple & Clean
class SinglePageCheckout {
    constructor() {
        this.cart = [];
        this.promoCode = null;
        this.discount = 0;
        this.taxRate = 0.08; // 8% default tax
        this.shippingCost = 5.99;
        
        // Promo codes
        this.promoCodes = {
            'NIGHTMARE30': { discount: 0.30, type: 'percentage', description: '30% off' },
            'MISCHIEF10': { discount: 0.10, type: 'percentage', description: '10% off' },
            'WELCOME15': { discount: 0.15, type: 'percentage', description: '15% off' },
            'FREESHIP': { discount: 5.99, type: 'fixed', description: 'Free shipping' }
        };
        
        this.init();
    }
    
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.validateCartAndRedirect();
        this.updateCartCount();
        this.populateOrderItems();
        this.calculateTotals();
    }
    
    loadCart() {
        try {
            const cartData = localStorage.getItem('kuromiCart');
            if (cartData) {
                this.cart = JSON.parse(cartData);
                // Ensure all items have required properties
                this.cart = this.cart.map(item => ({
                    id: item.id || Date.now(),
                    name: item.name || 'Unknown Item',
                    price: parseFloat(item.price) || 0,
                    quantity: parseInt(item.quantity) || 1,
                    image: this.getItemEmoji(item),
                    category: this.formatCategory(item.category || 'misc')
                }));
                console.log('Cart loaded successfully:', this.cart);
            } else {
                this.cart = [];
                console.log('No cart data found');
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
        }
    }
    
    getItemEmoji(item) {
        // If item already has emoji, use it
        if (item.emoji && !item.emoji.includes('.')) {
            return item.emoji;
        }
        
        // Map file paths to emojis
        const imageToEmojiMap = {
            'hoodie.webp': '🖤',
            'croptop.webp': '💜',
            'jacket.webp': '🦇',
            'dress.jpg': '👗',
            'goth dress.jpeg': '🖤',
            'pants.jpeg': '👖',
            'headband.webp': '🎀',
            'choker.jpeg': '⛓️',
            'clip.jpeg': '💎',
            'phone cae.webp': '📱',
            'bag charm.webp': '🔮',
            'sara.webp': '🧸',
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
        
        // Check if item.image is a file path
        if (item.image && item.image.includes('.')) {
            return imageToEmojiMap[item.image] || '🖤';
        }
        
        // Fallback to item.image or default emoji
        return item.image || '🖤';
    }
    
    validateCartAndRedirect() {
        if (this.cart.length === 0) {
            this.showEmptyCart();
            return false;
        }
        return true;
    }
    
    showEmptyCart() {
        document.querySelector('.single-page-layout').innerHTML = `
            <div class="empty-cart-container">
                <div class="empty-cart-content">
                    <div class="empty-icon">🛍️</div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any mischievous items to your cart yet!</p>
                    <a href="shop.html" class="btn-primary">
                        <span>Start Shopping</span>
                        <span>✨</span>
                    </a>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }
        
        // Promo code
        const promoToggle = document.getElementById('promoToggle');
        const applyPromo = document.getElementById('applyPromo');
        const promoCodeInput = document.getElementById('promoCode');
        
        if (promoToggle) {
            promoToggle.addEventListener('click', () => this.togglePromoCode());
        }
        
        if (applyPromo) {
            applyPromo.addEventListener('click', () => this.applyPromoCode());
        }
        
        if (promoCodeInput) {
            promoCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }
        
        // Place order
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => this.placeOrder());
        }
        
        // Form validation
        this.setupFormValidation();
        
        // Country/state change for tax calculation
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.addEventListener('change', () => this.calculateTotals());
        }
    }
    
    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
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
        field.classList.add('error');
        
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateAllFields() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    populateOrderItems() {
        const orderReview = document.getElementById('orderReview');
        const summaryItems = document.getElementById('summaryItems');
        
        if (this.cart.length === 0) {
            return;
        }
        
        const itemsHTML = this.cart.map(item => `
            <div class="order-item">
                <div class="item-image">${item.image}</div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-category">${item.category}</p>
                    <div class="item-quantity">
                        <button class="qty-btn" onclick="checkout.updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="checkout.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="item-price">
                    <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <span class="unit-price">$${item.price.toFixed(2)} each</span>
                </div>
                <button class="remove-item" onclick="checkout.removeItem(${item.id})" title="Remove item">×</button>
            </div>
        `).join('');
        
        const summaryHTML = this.cart.map(item => `
            <div class="summary-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">Qty: ${item.quantity}</span>
                </div>
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        if (orderReview) {
            orderReview.innerHTML = itemsHTML;
        }
        
        if (summaryItems) {
            summaryItems.innerHTML = summaryHTML;
        }
    }
    
    updateQuantity(itemId, change) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        this.cart[itemIndex].quantity += change;
        
        if (this.cart[itemIndex].quantity <= 0) {
            this.cart.splice(itemIndex, 1);
        }
        
        this.saveCart();
        this.populateOrderItems();
        this.calculateTotals();
        this.updateCartCount();
        
        if (this.cart.length === 0) {
            this.showEmptyCart();
        }
    }
    
    removeItem(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const item = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            this.saveCart();
            this.populateOrderItems();
            this.calculateTotals();
            this.updateCartCount();
            this.showNotification(`${item.name} removed from cart`, 'success');
            
            if (this.cart.length === 0) {
                this.showEmptyCart();
            }
        }
    }
    
    saveCart() {
        localStorage.setItem('kuromiCart', JSON.stringify(this.cart));
    }
    
    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    calculateTax() {
        const subtotal = this.calculateSubtotal();
        const discountedSubtotal = subtotal - this.discount;
        return Math.max(0, discountedSubtotal) * this.taxRate;
    }
    
    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax();
        const shipping = this.cart.length > 0 ? this.shippingCost : 0;
        return subtotal + tax + shipping - this.discount;
    }
    
    calculateTotals() {
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax();
        const shipping = this.cart.length > 0 ? this.shippingCost : 0;
        const total = this.calculateTotal();

        // Update DOM elements
        this.updateElement('subtotalAmount', `$${subtotal.toFixed(2)}`);
        this.updateElement('shippingAmount', `$${shipping.toFixed(2)}`);
        this.updateElement('taxAmount', `$${tax.toFixed(2)}`);
        this.updateElement('totalAmount', `$${total.toFixed(2)}`);
        this.updateElement('finalTotalAmount', `$${total.toFixed(2)}`); // Update final total display

        // Show/hide discount
        const discountLine = document.getElementById('discountLine');
        if (this.discount > 0) {
            discountLine.style.display = 'flex';
            this.updateElement('discountAmount', `-$${this.discount.toFixed(2)}`);
        } else {
            discountLine.style.display = 'none';
        }
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    togglePromoCode() {
        const promoInput = document.getElementById('promoInput');
        const toggleIcon = document.querySelector('.toggle-icon');
        
        if (promoInput.style.display === 'none') {
            promoInput.style.display = 'block';
            toggleIcon.textContent = '−';
            document.getElementById('promoCode').focus();
        } else {
            promoInput.style.display = 'none';
            toggleIcon.textContent = '+';
        }
    }
    
    applyPromoCode() {
        const codeInput = document.getElementById('promoCode');
        const code = codeInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showPromoMessage('Please enter a promo code', 'error');
            return;
        }
        
        if (this.promoCode === code) {
            this.showPromoMessage('This promo code is already applied', 'info');
            return;
        }
        
        if (this.promoCodes[code]) {
            const promo = this.promoCodes[code];
            const subtotal = this.calculateSubtotal();
            
            if (promo.type === 'percentage') {
                this.discount = subtotal * promo.discount;
            } else {
                this.discount = promo.discount;
            }
            
            this.promoCode = code;
            codeInput.value = code;
            codeInput.disabled = true;
            
            const applyBtn = document.getElementById('applyPromo');
            applyBtn.textContent = 'Applied ✓';
            applyBtn.disabled = true;
            applyBtn.classList.add('applied');
            
            this.calculateTotals();
            this.showPromoMessage(`${promo.description} applied! You saved $${this.discount.toFixed(2)}`, 'success');
            this.showNotification(`Promo code applied! You saved $${this.discount.toFixed(2)}`, 'success');
        } else {
            this.showPromoMessage('Invalid promo code', 'error');
        }
    }
    
    showPromoMessage(message, type) {
        const messageElement = document.getElementById('promoMessage');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `promo-message ${type}`;
        }
    }
    
    async placeOrder() {
        if (!this.validateAllFields()) {
            this.showNotification('Please fill in all required fields', 'error');
            // Scroll to first error
            const firstError = document.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show loading
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const btnContent = placeOrderBtn.querySelector('.btn-content');
        const btnLoading = placeOrderBtn.querySelector('.btn-loading');
        
        btnContent.style.display = 'none';
        btnLoading.style.display = 'flex';
        placeOrderBtn.disabled = true;
        
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';
        
        try {
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Collect order data
            const orderData = this.collectOrderData();
            
            // Generate order number
            const orderNumber = 'KUR-' + Date.now();
            
            // Save order
            const orders = JSON.parse(localStorage.getItem('kuromiOrders') || '[]');
            orders.push({
                ...orderData,
                orderNumber,
                orderDate: new Date().toISOString(),
                status: 'confirmed'
            });
            localStorage.setItem('kuromiOrders', JSON.stringify(orders));
            
            // Clear cart
            localStorage.removeItem('kuromiCart');
            
            // Hide loading overlay
            loadingOverlay.style.display = 'none';
            
            // Show success
            this.showSuccessModal(orderNumber);
            
            // Trigger confetti
            this.createConfetti();
            
        } catch (error) {
            console.error('Order processing error:', error);
            
            // Hide loading
            loadingOverlay.style.display = 'none';
            btnContent.style.display = 'flex';
            btnLoading.style.display = 'none';
            placeOrderBtn.disabled = false;
            
            this.showNotification('There was an error processing your order. Please try again.', 'error');
        }
    }
    
    collectOrderData() {
        return {
            items: this.cart,
            customer: {
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value
            },
            shipping: {
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            },
            pricing: {
                subtotal: this.calculateSubtotal(),
                shipping: this.shippingCost,
                tax: this.calculateTax(),
                discount: this.discount,
                total: this.calculateTotal()
            },
            promoCode: this.promoCode
        };
    }
    
    showSuccessModal(orderNumber) {
        const modal = document.getElementById('successModal');
        const orderNumberElement = document.getElementById('orderNumber');
        
        if (orderNumberElement) {
            orderNumberElement.textContent = orderNumber;
        }
        
        modal.style.display = 'flex';
        
        // Animate the checkmark
        setTimeout(() => {
            const checkmark = modal.querySelector('.checkmark');
            if (checkmark) {
                checkmark.style.animation = 'checkmarkPop 0.6s ease-out';
            }
        }, 100);
    }
    
    createConfetti() {
        const colors = ['#9932CC', '#FFB6C1', '#000000', '#FFFFFF'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
        
        // Add confetti animation if not exists
        if (!document.getElementById('confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes checkmarkPop {
                    0% { transform: scale(0) rotate(0deg); }
                    50% { transform: scale(1.2) rotate(180deg); }
                    100% { transform: scale(1) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#9932CC'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-weight: 500;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
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
}

// Initialize single page checkout system
let checkout;
document.addEventListener('DOMContentLoaded', () => {
    checkout = new SinglePageCheckout();
});

// Global functions for onclick handlers
window.checkout = checkout;
