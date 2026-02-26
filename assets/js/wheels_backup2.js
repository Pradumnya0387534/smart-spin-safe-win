// ===================================
// WHEELS.JS - Wheel Spinning Logic & Animations
// UPDATED: Arrow attached to center, pointing right
// ===================================

// Wheel configuration
const CATEGORIES = [
    { name: 'Electrical Safety', icon: '⚡', color: '#FF000F' },
    { name: 'PPE', icon: '🦺', color: '#6764f6' },
    { name: 'Fire Safety', icon: '🔥', color: '#ff957e' },
    { name: 'Chemical Safety', icon: '🧪', color: '#93a1ff' },
    { name: 'Machine Safety', icon: '⚙️', color: '#FF000F' },
    { name: 'Emergency Response', icon: '🚨', color: '#6764f6' },
    { name: 'Workplace Ergonomics', icon: '🪑', color: '#ff957e' },
    { name: 'Lockout/Tagout', icon: '🔒', color: '#93a1ff' }
];

const QUESTION_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Wheel state
let categoryWheelRotation = 0;
let pointsWheelRotation = 0;
let isSpinning = false;

/**
 * Draw the category wheel
 */
function drawCategoryWheel() {
    const canvas = document.getElementById('categoryWheel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Rotate canvas
    ctx.translate(centerX, centerY);
    ctx.rotate((categoryWheelRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Draw segments
    const segmentAngle = (2 * Math.PI) / CATEGORIES.length;
    
    CATEGORIES.forEach((category, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = category.color;
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw icon
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '32px Arial';
        ctx.fillText(category.icon, radius * 0.65, 0);
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#FF000F';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Restore context
    ctx.restore();
    
    // Draw "ABB" text in center
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF000F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ABB', centerX, centerY);
    
    // Draw pointer (ATTACHED TO CENTER, pointing RIGHT)
    // Arrow starts from center circle edge and points outward
    ctx.beginPath();
    ctx.moveTo(centerX + 35, centerY);        // Start from center circle edge (radius 30 + 5 gap)
    ctx.lineTo(centerX + 65, centerY);        // Horizontal line to the right
    ctx.lineTo(centerX + 60, centerY - 10);   // Arrow head top
    ctx.lineTo(centerX + 65, centerY);        // Back to tip
    ctx.lineTo(centerX + 60, centerY + 10);   // Arrow head bottom
    ctx.lineTo(centerX + 65, centerY);        // Back to tip
    ctx.lineTo(centerX + 35, centerY);        // Back to start
    ctx.closePath();
    ctx.fillStyle = '#FF000F';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Draw the question numbers wheel
 */
function drawPointsWheel() {
    const canvas = document.getElementById('pointsWheel');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Rotate canvas
    ctx.translate(centerX, centerY);
    ctx.rotate((pointsWheelRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Draw segments
    const segmentAngle = (2 * Math.PI) / QUESTION_NUMBERS.length;
const colors = [
    // Red Family (3 shades)
    '#FF000F',  // ABB Red - Bright
    '#CC0000',  // ABB Red - Medium Dark
    '#FF4444',  // ABB Red - Light
    
    // Purple/Lilac Family (3 shades)
    '#6764f6',  // ABB Lilac - Bright
    '#4B47C4',  // ABB Lilac - Medium Dark
    '#9D99FF',  // ABB Lilac - Light
    
    // Orange Family (2 shades)
    '#FF5722',  // Orange - Medium
    '#FF7043',  // Orange - Light
    
    // Deep Purple (2 shades)
    '#7B1FA2',  // Purple - Dark
    '#9C27B0'   // Purple - Medium
];



    
    QUESTION_NUMBERS.forEach((questionNum, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw question number text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(questionNum, radius * 0.65, 0);
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#FF000F' ;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Restore context
    ctx.restore();
    
    // Draw "ABB" text in center
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF000F' ;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ABB', centerX, centerY);
    
    // Draw pointer (ATTACHED TO CENTER, pointing RIGHT)
    // Arrow starts from center circle edge and points outward
    ctx.beginPath();
    ctx.moveTo(centerX + 35, centerY);        // Start from center circle edge (radius 30 + 5 gap)
    ctx.lineTo(centerX + 65, centerY);        // Horizontal line to the right
    ctx.lineTo(centerX + 60, centerY - 10);   // Arrow head top
    ctx.lineTo(centerX + 65, centerY);        // Back to tip
    ctx.lineTo(centerX + 60, centerY + 10);   // Arrow head bottom
    ctx.lineTo(centerX + 65, centerY);        // Back to tip
    ctx.lineTo(centerX + 35, centerY);        // Back to start
    ctx.closePath();
    ctx.fillStyle = '#6764f6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Get selected category based on rotation
 * @returns {object}
 */
function getSelectedCategory() {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((categoryWheelRotation % 360) + 360) % 360;
    
    // Arrow is on the RIGHT (0 degrees position)
    const segmentAngle = 360 / CATEGORIES.length;
    
    // Calculate which segment is at the arrow position
    let selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % CATEGORIES.length;
    
    console.log('[Wheels] Category rotation:', normalizedRotation, 'Selected index:', selectedIndex);
    
    return CATEGORIES[selectedIndex];
}

/**
 * Get selected question number based on rotation
 * @returns {number}
 */
function getSelectedQuestionNumber() {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((pointsWheelRotation % 360) + 360) % 360;
    
    // Arrow is on the RIGHT (0 degrees position)
    const segmentAngle = 360 / QUESTION_NUMBERS.length;
    
    // Calculate which segment is at the arrow position
    let selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % QUESTION_NUMBERS.length;
    
    console.log('[Wheels] Question rotation:', normalizedRotation, 'Selected index:', selectedIndex);
    
    return QUESTION_NUMBERS[selectedIndex];
}

/**
 * Spin both wheels simultaneously
 */
function spinWheels() {
    if (isSpinning) return;
    
    console.log('[Wheels] Spinning wheels...');
    isSpinning = true;
        // Unlock audio on first spin
    if (!window.audioUnlocked) {
        const unlockSound = document.getElementById('click-sound');
        if (unlockSound) {
            unlockSound.volume = 0.01; // Very quiet
            unlockSound.play().then(() => {
                unlockSound.pause();
                unlockSound.currentTime = 0;
                window.audioUnlocked = true;
                console.log('[Audio] Audio unlocked via spin button');
            }).catch(() => {});
        }
    }

    
    // Disable spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.textContent = 'Spinning...';
    }
    
    // Play spin sound
    playSound('spin-sound');
    
    // Random target rotations
    const categorySpins = 5 + Math.random() * 3; // 5-8 full spins
    const pointsSpins = 5 + Math.random() * 3;
    
    const categoryTarget = categoryWheelRotation + (categorySpins * 360) + Math.random() * 360;
    const pointsTarget = pointsWheelRotation + (pointsSpins * 360) + Math.random() * 360;
    
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    
    // Animation function
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Update rotations
        categoryWheelRotation = categoryWheelRotation + (categoryTarget - categoryWheelRotation) * easeOut * 0.1;
        pointsWheelRotation = pointsWheelRotation + (pointsTarget - pointsWheelRotation) * easeOut * 0.1;
        
        // Redraw wheels
        drawCategoryWheel();
        drawPointsWheel();
        
        // Continue animation
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete
            categoryWheelRotation = categoryTarget;
            pointsWheelRotation = pointsTarget;
            
            drawCategoryWheel();
            drawPointsWheel();
            
            // Stop spin sound
            stopSound('spin-sound');
            
            // Play tick sound
            playSound('tick-sound');
            
            // Show selection
            setTimeout(() => {
                showSelection();
            }, 500);
        }
    }
    
    animate();
}

/**
 * Show the selected category and question number
 */
function showSelection() {
    console.log('[Wheels] Showing selection...');
    
    const selectedCategory = getSelectedCategory();
    const selectedQuestionNum = getSelectedQuestionNumber();
    
    console.log('[Wheels] Selected:', selectedCategory.name, 'Question #' + selectedQuestionNum);
    
    // Update selection display
    document.getElementById('selectedCategoryIcon').textContent = selectedCategory.icon;
    document.getElementById('selectedCategoryName').textContent = selectedCategory.name;
    document.getElementById('selectedPoints').textContent = selectedQuestionNum;
    
    // Hide wheels section
    hideSection('wheelsSection');
    
    // Show selection section
    showSection('selectionSection');
    
    // Load question after 2 seconds
    setTimeout(() => {
        if (window.loadQuestion) {
            window.loadQuestion(selectedCategory.name, selectedQuestionNum);
        }
    }, 2000);
    
    isSpinning = false;
    
    // Re-enable spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.textContent = 'Spin Both Wheels';
    }
}

/**
 * Reset wheels for next question
 */
function resetWheels() {
    console.log('[Wheels] Resetting wheels...');
    
    // Show wheels section
    showSection('wheelsSection');
    
    // Hide selection section
    hideSection('selectionSection');
    
    // Redraw wheels
    drawCategoryWheel();
    drawPointsWheel();
}

/**
 * Initialize wheels
 */
function initWheels() {
    console.log('[Wheels] Initializing wheels...');
    
    // Draw initial wheels
    drawCategoryWheel();
    drawPointsWheel();
    
    // Spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.addEventListener('click', spinWheels);
    }
    
    console.log('[Wheels] Wheels initialized');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for page to be visible
    setTimeout(initWheels, 100);
});

// Export functions to global scope
window.initWheels = initWheels;
window.spinWheels = spinWheels;
window.resetWheels = resetWheels;
window.getSelectedCategory = getSelectedCategory;
window.getSelectedQuestionNumber = getSelectedQuestionNumber;
window.CATEGORIES = CATEGORIES;
