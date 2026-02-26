// ===================================
// UI.JS - Page Switching & UI Utilities
// ===================================

/**
 * Show a specific page and hide all others
 * @param {string} pageId - The ID of the page to show
 */
function showPage(pageId) {
    console.log(`[UI] Switching to page: ${pageId}`);
    
    // Hide all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Hide login container
    const loginContainer = document.getElementById('loginPage');
    if (loginContainer) {
        loginContainer.classList.remove('active');
    }
    
    // Show the requested page
    if (pageId === 'loginPage') {
        if (loginContainer) {
            loginContainer.classList.add('active');
        }
    } else {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            console.error(`[UI] Page not found: ${pageId}`);
        }
    }
    
    // Update URL hash
    const hashMap = {
        'loginPage': '#/login',
        'homePage': '#/home',
        'gamePage': '#/game'
    };
    
    if (hashMap[pageId]) {
        window.location.hash = hashMap[pageId];
    }
}

/**
 * Show a section within a page
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

/**
 * Hide a section within a page
 * @param {string} sectionId - The ID of the section to hide
 */
function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}

/**
 * Update score display
 * @param {number} score - The current score
 */
function updateScore(score) {
    const scoreElement = document.getElementById('scoreValue');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

/**
 * Show congratulations overlay
 */
function showCongratsOverlay() {
    const overlay = document.getElementById('congratsOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        
        // Play applause sound
        playSound('applause-sound');
        
        // Hide after 2.5 seconds
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2500);
    }
}

/**
 * Play a sound effect
 * @param {string} soundId - The ID of the audio element
 */
function playSound(soundId) {
    if (isMuted) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
        // Check if already playing
        if (!sound.paused) {
            sound.pause();
        }
        
        // Reset to beginning
                // Play with promise handling
        // Reset to beginning
        sound.currentTime = 0;

        // Small delay to prevent interruption
        setTimeout(() => {
            // Play with promise handling
            const playPromise = sound.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('[Audio] Playing:', soundId);
            })
            .catch(err => {
                console.log('[Audio] Failed to play ' + soundId + ':', err.message);
            });
    }
}, 10);

        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('[Audio] Playing:', soundId);
                })
                .catch(err => {
                    console.log('[Audio] Failed to play ' + soundId + ':', err.message);
                });
        }
    }
}

/**
 * Play looping background sound (for timer and continuous sounds)
 * @param {string} soundId - The ID of the audio element
 */
function playLoopingSound(soundId) {
    if (isMuted) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
        // Only start if not already playing
        if (sound.paused) {
            // Set to loop
            sound.loop = true;
            sound.currentTime = 0;
            
            // Small delay to prevent interruption
            setTimeout(() => {
                const playPromise = sound.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('[Audio] Playing looping:', soundId);
                        })
                        .catch(err => {
                            console.log('[Audio] Failed to play looping ' + soundId + ':', err.message);
                        });
                }
            }, 10);
        }
    }
}


/**
 * Stop a sound effect
 * @param {string} soundId - The ID of the audio element
 */
function stopSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.loop = false;  // Reset loop
    }
}


/**
 * Stop all sounds
 */
function stopAllSounds() {
    const sounds = [
        'timer-background',
        'timer-ticking',
        'timer-warning',
        'spin-sound',
        'tick-sound'
    ];
    
    sounds.forEach(soundId => stopSound(soundId));
}

/**
 * Toggle mute state
 */
function toggleMute() {
    window.isMuted = !window.isMuted;
    
    // Update mute button icons
    const muteBtns = document.querySelectorAll('#muteBtn .icon-sound, #muteBtnGame .icon-sound');
    muteBtns.forEach(btn => {
        btn.textContent = window.isMuted ? '🔇' : '🔊';
    });
    
    // Stop all sounds if muting
    if (window.isMuted) {
        stopAllSounds();
    }
    
    console.log(`[Audio] Mute toggled: ${window.isMuted}`);
}

/**
 * Initialize mute buttons
 */
function initMuteButtons() {
    const muteBtn = document.getElementById('muteBtn');
    const muteBtnGame = document.getElementById('muteBtnGame');
    
    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }
    
    if (muteBtnGame) {
        muteBtnGame.addEventListener('click', toggleMute);
    }
}

/**
 * Handle hash-based routing
 */
function handleRouting() {
    const hash = window.location.hash;
    
    const routeMap = {
        '#/login': 'loginPage',
        '#/home': 'homePage',
        '#/game': 'gamePage',
        '': 'loginPage'
    };
    
    const pageId = routeMap[hash] || 'loginPage';
    
    // Check authentication for protected pages
    if ((pageId === 'homePage' || pageId === 'gamePage') && !isAuthenticated()) {
        showPage('loginPage');
    } else {
        showPage(pageId);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[UI] Initializing UI utilities...');
    
    // Initialize mute state
    window.isMuted = false;
    
    // Initialize mute buttons
    initMuteButtons();
    
    // Handle initial routing
    handleRouting();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleRouting);
    
    console.log('[UI] UI utilities initialized');
});
// Enable audio on first user interaction
let audioInitialized = false;

document.addEventListener('click', function initAudio() {
    if (!audioInitialized) {
        console.log('[Audio] Initializing audio context...');
        
        // Touch all audio elements to unlock them
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(() => {
                // Ignore errors during initialization
            });
        });
        
        audioInitialized = true;
        console.log('[Audio] Audio context initialized');
    }
}, { once: true });


// Export functions to global scope
window.showPage = showPage;
window.showSection = showSection;
window.hideSection = hideSection;
window.updateScore = updateScore;
window.showCongratsOverlay = showCongratsOverlay;
window.playSound = playSound;
window.stopSound = stopSound;
window.playLoopingSound = playLoopingSound;  // NEW
window.stopAllSounds = stopAllSounds;
window.toggleMute = toggleMute;
// Enable audio on first user interaction
