// ===================================
// AUTH.JS - Authentication & Session Management
// ===================================

// Demo credentials
const DEMO_USERNAME = 'ABB_Host';
const DEMO_PASSWORD = 'Safe_win_2026';

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
    return sessionStorage.getItem('authenticated') === 'true';
}

/**
 * Set authentication status
 * @param {boolean} status
 */
function setAuthenticated(status) {
    sessionStorage.setItem('authenticated', status.toString());
}

/**
 * Handle login form submission
 * @param {Event} event
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('[Auth] Login attempt:', username);
    
    // Validate credentials
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        console.log('[Auth] Login successful');
        
        // Set authenticated status
        setAuthenticated(true);
        
        // Store username
        sessionStorage.setItem('username', username);
        
        // Navigate to home page
        showPage('homePage');
    } else {
        console.log('[Auth] Login failed');
        alert('Invalid credentials. Please use demo/abb2024');
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    console.log('[Auth] Logging out...');
    
    // Clear session
    sessionStorage.clear();
    
    // Reset game state
    if (window.resetGameState) {
        window.resetGameState();
    }
    
    // Navigate to login page
    showPage('loginPage');
}

/**
 * Initialize authentication
 */
function initAuth() {
    console.log('[Auth] Initializing authentication...');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Check if already authenticated
    if (isAuthenticated()) {
        console.log('[Auth] User already authenticated');
        showPage('homePage');
    } else {
        console.log('[Auth] User not authenticated');
        showPage('loginPage');
    }
    
    console.log('[Auth] Authentication initialized');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

// Export functions to global scope
window.isAuthenticated = isAuthenticated;
window.setAuthenticated = setAuthenticated;
window.handleLogout = handleLogout;
