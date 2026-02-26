// ===================================
// WHEELS.JS - Wheel Spinning Logic & Animations
// UPDATED: Question Numbers (1-10) + Inverted Arrows
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
    
    // Draw pointer (INVERTED - points down)
    ctx.beginPath();
    ctx.moveTo(centerX, 290);           // Bottom point
    ctx.lineTo(centerX - 15, 260);      // Top left
    ctx.lineTo(centerX + 15, 260);      // Top right
    ctx.closePath();
    ctx.fillStyle = '#FF000F';
    ctx.fill();
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
    const colors = ['#FF000F', '#6764f6', '#ff957e', '#93a1ff', '#ffdccd', '#FF000F', '#6764f6', '#ff957e', '#93a1ff', '#ffdccd'];
    
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
    ctx.strokeStyle = '#6764f6';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Restore context
    ctx.restore();
    
    // Draw pointer (INVERTED - points down)
    ctx.beginPath();
    ctx.moveTo(centerX, 290);           // Bottom point
    ctx.lineTo(centerX - 15, 260);      // Top left
    ctx.lineTo(centerX + 15, 260);      // Top right
    ctx.closePath();
    ctx.fillStyle = '#6764f6';
    ctx.fill();
}

/**
 * Get selected category based on rotation
 * @returns {object}
 */
function getSelectedCategory() {
    const normalizedRotation = (360 - (categoryWheelRotation % 360)) % 360;
    const segmentAngle = 360 / CATEGORIES.length;
    const index = Math.floor(normalizedRotation / segmentAngle);
    return CATEGORIES[index % CATEGORIES.length];
}

/**
 * Get selected question number based on rotation
 * @returns {number}
 */
function getSelectedQuestionNumber() {
    const normalizedRotation = (360 - (pointsWheelRotation % 360)) % 360;
    const segmentAngle = 360 / QUESTION_NUMBERS.length;
    const index = Math.floor(normalizedRotation / segmentAngle);
    return QUESTION_NUMBERS[index % QUESTION_NUMBERS.length];
}

/**
 * Spin both wheels simultaneously
 */
function spinWheels() {
    if (isSpinning) return;
    
    console.log('[Wheels] Spinning wheels...');
    isSpinning = true;
    
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
    
    console.log('[Wheels] Selected:', selectedCategory.name, selectedQuestionNum);
    
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
