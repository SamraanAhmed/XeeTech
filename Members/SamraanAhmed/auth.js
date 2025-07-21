// Form validation and authentication logic
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
            
            // Real-time validation
            const inputs = signupForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }

        // Signin form
        const signinForm = document.getElementById('signinForm');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignin(e));
            
            // Real-time validation
            const inputs = signinForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }

        // Social auth buttons
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialAuth(e));
        });
    }

    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullName':
                if (value.length < 2) {
                    errorMessage = 'Full name must be at least 2 characters long';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Full name can only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (fieldName === 'email' && this.emailExists(value)) {
                    errorMessage = 'This email is already registered';
                    isValid = false;
                }
                break;

            case 'password':
                if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters long';
                    isValid = false;
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                    isValid = false;
                }
                break;

            case 'confirmPassword':
                const password = document.getElementById('password')?.value;
                if (value !== password) {
                    errorMessage = 'Passwords do not match';
                    isValid = false;
                }
                break;
        }

        this.showError(input, errorMessage);
        return isValid;
    }

    showError(input, message) {
        const errorElement = document.getElementById(input.name + 'Error') || 
                           document.getElementById('signin' + input.name.charAt(0).toUpperCase() + input.name.slice(1) + 'Error');
        
        if (errorElement) {
            errorElement.textContent = message;
            input.style.borderColor = message ? '#ef4444' : '#e1e5e9';
        }
    }

    clearError(input) {
        const errorElement = document.getElementById(input.name + 'Error') || 
                           document.getElementById('signin' + input.name.charAt(0).toUpperCase() + input.name.slice(1) + 'Error');
        
        if (errorElement) {
            errorElement.textContent = '';
            input.style.borderColor = '#e1e5e9';
        }
    }

    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            fullName: formData.get('fullName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            terms: formData.get('terms')
        };

        // Validate all fields
        let isFormValid = true;
        const inputs = e.target.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        // Check terms acceptance
        if (!userData.terms) {
            this.showNotification('Please accept the terms of service', 'error');
            isFormValid = false;
        }

        if (!isFormValid) {
            return;
        }

        // Create user account
        const newUser = {
            id: Date.now(),
            fullName: userData.fullName,
            email: userData.email,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        this.showNotification('Account created successfully! Redirecting to sign in...', 'success');
        
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 2000);
    }

    handleSignin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email').trim().toLowerCase();
        const password = formData.get('password');
        const remember = formData.get('remember');

        // Find user
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            this.showError(document.getElementById('signinEmail'), 'No account found with this email');
            return;
        }

        if (!this.verifyPassword(password, user.password)) {
            this.showError(document.getElementById('signinPassword'), 'Incorrect password');
            return;
        }

        // Successful login
        this.currentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        this.showNotification('Welcome back! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    handleSocialAuth(e) {
        e.preventDefault();
        const provider = e.currentTarget.textContent.includes('Google') ? 'Google' : 'GitHub';
        
        this.showNotification(`${provider} authentication would be implemented here`, 'info');
    }

    hashPassword(password) {
        // Simple hash function for demo purposes
        // In production, use proper hashing like bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        `;

        switch (type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'info':
                notification.style.background = '#3b82f6';
                break;
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 5000);
    }
}

// Initialize the auth manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to form inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.auth-btn, .social-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});