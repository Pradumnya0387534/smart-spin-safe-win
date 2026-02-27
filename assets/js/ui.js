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
    if (window.isMuted) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
        // Stop if already playing
        if (!sound.paused) {
            sound.pause();
        }
        
        // Reset to beginning
        sound.currentTime = 0;
        
        // Play with promise handling
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                // Silently handle autoplay errors
                console.log('[Audio] Playback prevented:', soundId);
            });
        }
    }
}

/**
 * Play looping background sound (for timer and continuous sounds)
 * @param {string} soundId - The ID of the audio element
 */
function playLoopingSound(soundId) {
    if (window.isMuted) return;
    
    const sound = document.getElementById(soundId);
    if (!sound) {
        console.error('[Audio] Sound element not found:', soundId);
        return;
    }
    
    // Check if audio is loaded
    if (sound.readyState < 2) {
        console.warn('[Audio] Sound not ready:', soundId, 'ReadyState:', sound.readyState);
        // Retry after a short delay
        setTimeout(() => playLoopingSound(soundId), 200);
        return;
    }
    
    // Only play if not already playing
    if (!sound.paused) {
        console.log('[Audio] Sound already playing:', soundId);
        return;
    }
    
    // Set to loop
    sound.loop = true;
    sound.currentTime = 0;
    
    // Use setTimeout to avoid race condition with pause()
    setTimeout(() => {
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('[Audio] Playing looping:', soundId);
                })
                .catch(err => {
                    console.log('[Audio] Looping playback prevented:', soundId, '-', err.message);
                });
        }
    }, 50);
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
        sound.loop = false;
    }
}

/**
 * Stop all sounds
 */
function stopAllSounds() {
    const sounds = [
        'spin-sound',
        'applause-sound',
        'wrong-sound',
        'timeout-sound',
        'celebration-sound',
        'click-sound'
        // Note: timer-background is NOT included - it's managed by timer functions
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
    
    // When unmuting, play a test sound to unlock audio context
    if (!window.isMuted) {
        // Try to play a short sound to unlock audio
        const unlockSound = document.getElementById('click-sound');
        if (unlockSound) {
            unlockSound.volume = 0.3; // Lower volume for unlock sound
            const unlockPromise = unlockSound.play();
            
            if (unlockPromise !== undefined) {
                unlockPromise
                    .then(() => {
                        // Successfully unlocked audio
                        console.log('[Audio] Audio unlocked successfully');
                        // Pause the unlock sound after a moment
                        setTimeout(() => {
                            unlockSound.pause();
                            unlockSound.currentTime = 0;
                        }, 100);
                    })
                    .catch(err => {
                        console.log('[Audio] Could not unlock audio:', err.message);
                    });
            }
        }
    } else {
        // Stop all sounds if muting
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
    window.isMuted = true;
    
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
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {
                    // Ignore initialization errors
                });
            }
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
window.playLoopingSound = playLoopingSound;
window.stopSound = stopSound;
window.stopAllSounds = stopAllSounds;
window.toggleMute = toggleMute;
