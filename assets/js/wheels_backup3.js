// ===================================
// WHEELS.JS - Wheel Drawing and Spinning Logic
// ===================================

// Configuration
const WHEEL_RADIUS = 150;
const ARROW_SIZE = 30;

// NEW CATEGORIES from updated question bank
const categories = [
    'Fire Safety',
    'Electrical Safety',
    'Road Safety',
    'Lockout Tagout',
    'Material Handling',
    'Working at Height',
    'First Aid',
    'Machine Guarding',
    'Chemical Safety',
    'Sustainability'
];

// Colors for wheel segments (medium-tone, high contrast)
const colors = [
    '#FF000F',  // ABB Red - Vibrant
    '#6764f6',  // ABB Lilac - Vibrant
    '#FF4444',  // Bright Red
    '#8B85FF',  // Light Purple
    '#FF6B6B',  // Coral Red
    '#7B77FF',  // Medium Lilac
    '#FF3333',  // Vivid Red
    '#9D99FF',  // Soft Purple
    '#FF5252',  // Light Red
    '#A29EFF'   // Pale Lilac
];

// Wheel state
let categoryWheel = {
    canvas: null,
    ctx: null,
    rotation: 0,
    isSpinning: false,
    selectedIndex: -1
};

let questionWheel = {
    canvas: null,
    ctx: null,
    rotation: 0,
    isSpinning: false,
    selectedIndex: -1
};

/**
 * Initialize wheels
 */
function initWheels() {
    console.log('[Wheels] Initializing wheels...');
    
    // Get canvas elements
    categoryWheel.canvas = document.getElementById('categoryWheel');
    questionWheel.canvas = document.getElementById('questionWheel');
    
    if (!categoryWheel.canvas || !questionWheel.canvas) {
        console.error('[Wheels] Canvas elements not found');
        return;
    }
    
    // Get 2D contexts
    categoryWheel.ctx = categoryWheel.canvas.getContext('2d');
    questionWheel.ctx = questionWheel.canvas.getContext('2d');
    
    // Draw initial wheels
    drawWheel(categoryWheel, categories.length);
    drawWheel(questionWheel, 10); // 10 questions per category
    
    console.log('[Wheels] Wheels initialized');
}

/**
 * Draw a wheel
 * @param {Object} wheel - Wheel object (categoryWheel or questionWheel)
 * @param {number} segments - Number of segments
 */
function drawWheel(wheel, segments) {
    const ctx = wheel.ctx;
    const canvas = wheel.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const anglePerSegment = (2 * Math.PI) / segments;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Translate to center and apply rotation
    ctx.translate(centerX, centerY);
    ctx.rotate((wheel.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Draw segments
    for (let i = 0; i < segments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;
        const color = colors[i % colors.length];
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, WHEEL_RADIUS, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        
        // Display category name or question number
        if (wheel === categoryWheel) {
            // For category wheel, display category name
            const categoryName = categories[i];
            // Split long names into multiple lines
            const words = categoryName.split(' ');
            if (words.length > 2) {
                ctx.fillText(words.slice(0, 2).join(' '), WHEEL_RADIUS * 0.6, -5);
                ctx.fillText(words.slice(2).join(' '), WHEEL_RADIUS * 0.6, 10);
            } else {
                ctx.fillText(categoryName, WHEEL_RADIUS * 0.6, 0);
            }
        } else {
            // For question wheel, display question number
            ctx.fillText(`Q ${i + 1}`, WHEEL_RADIUS * 0.7, 0);
        }
        
        ctx.restore();
    }
    
    // Restore context
    ctx.restore();
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#FF000F';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw arrow pointing left
    drawArrow(ctx, centerX, centerY);
}

/**
 * Draw arrow pointing left from center
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 */
function drawArrow(ctx, centerX, centerY) {
    ctx.save();
    
    // Arrow points to the left (9 o'clock position)
    const arrowX = centerX - WHEEL_RADIUS - 10;
    const arrowY = centerY;
    
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX + ARROW_SIZE, arrowY - ARROW_SIZE / 2);
    ctx.lineTo(arrowX + ARROW_SIZE, arrowY + ARROW_SIZE / 2);
    ctx.closePath();
    
    ctx.fillStyle = '#FF000F';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
}

/**
 * Spin both wheels
 */
function spinWheels() {
    if (categoryWheel.isSpinning || questionWheel.isSpinning) {
        return;
    }
    
    console.log('[Wheels] Spinning wheels...');
    
    // Reset selection
    categoryWheel.selectedIndex = -1;
    questionWheel.selectedIndex = -1;
    
    // Mark as spinning
    categoryWheel.isSpinning = true;
    questionWheel.isSpinning = true;
    
    // Play spin sound
    playSound('spin-sound');
    
    // Unlock audio on first interaction
    if (!window.audioUnlocked) {
        window.audioUnlocked = true;
        console.log('[Audio] Audio unlocked via spin button');
    }
    
    // Random rotations (multiple full spins + random angle)
    const categorySpins = 5 + Math.random() * 3; // 5-8 full spins
    const questionSpins = 5 + Math.random() * 3;
    
    const categoryFinalAngle = categorySpins * 360 + Math.random() * 360;
    const questionFinalAngle = questionSpins * 360 + Math.random() * 360;
    
    // Animate spins
    animateSpin(categoryWheel, categoryFinalAngle, 3000, () => {
        categoryWheel.isSpinning = false;
        calculateSelection(categoryWheel, categories.length);
        checkBothWheelsStopped();
    });
    
    animateSpin(questionWheel, questionFinalAngle, 3000, () => {
        questionWheel.isSpinning = false;
        calculateSelection(questionWheel, 10);
        checkBothWheelsStopped();
    });
}

/**
 * Animate wheel spin
 * @param {Object} wheel - Wheel object
 * @param {number} finalAngle - Final rotation angle
 * @param {number} duration - Animation duration in ms
 * @param {Function} callback - Callback when animation completes
 */
function animateSpin(wheel, finalAngle, duration, callback) {
    const startAngle = wheel.rotation % 360;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        wheel.rotation = startAngle + (finalAngle * easeOut);
        drawWheel(wheel, wheel === categoryWheel ? categories.length : 10);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheel.rotation = wheel.rotation % 360;
            callback();
        }
    }
    
    animate();
}

/**
 * Calculate which segment was selected
 * @param {Object} wheel - Wheel object
 * @param {number} segments - Number of segments
 */
function calculateSelection(wheel, segments) {
    // Arrow points left (270 degrees or 9 o'clock)
    const arrowAngle = 270;
    
    // Adjust for wheel rotation
    const adjustedAngle = (arrowAngle - wheel.rotation + 360) % 360;
    
    // Calculate segment
    const anglePerSegment = 360 / segments;
    const selectedIndex = Math.floor(adjustedAngle / anglePerSegment);
    
    wheel.selectedIndex = selectedIndex;
    
    console.log(`[Wheels] ${wheel === categoryWheel ? 'Category' : 'Question'} rotation: ${wheel.rotation} Selected index: ${selectedIndex}`);
}

/**
 * Check if both wheels have stopped spinning
 */
function checkBothWheelsStopped() {
    if (!categoryWheel.isSpinning && !questionWheel.isSpinning &&
        categoryWheel.selectedIndex >= 0 && questionWheel.selectedIndex >= 0) {
        
        showSelection();
    }
}

/**
 * Show the selected category and question
 */
function showSelection() {
    console.log('[Wheels] Showing selection...');
    
    const selectedCategory = categories[categoryWheel.selectedIndex];
    const selectedQuestionNum = questionWheel.selectedIndex + 1;
    
    console.log(`[Wheels] Selected: ${selectedCategory} Question #${selectedQuestionNum}`);
    
    // Play tick sound
    playSound('tick-sound');
    
    // Load the question
    loadQuestion(selectedCategory, selectedQuestionNum);
}

/**
 * Reset wheels
 */
function resetWheels() {
    console.log('[Wheels] Resetting wheels...');
    
    categoryWheel.rotation = 0;
    categoryWheel.isSpinning = false;
    categoryWheel.selectedIndex = -1;
    
    questionWheel.rotation = 0;
    questionWheel.isSpinning = false;
    questionWheel.selectedIndex = -1;
    
    drawWheel(categoryWheel, categories.length);
    drawWheel(questionWheel, 10);
}

// Initialize wheels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(initWheels, 100);
});

// Export functions to global scope
window.spinWheels = spinWheels;
window.resetWheels = resetWheels;
window.categories = categories;
