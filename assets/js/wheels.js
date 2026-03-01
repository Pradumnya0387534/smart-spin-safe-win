// ===================================
// WHEELS.JS - Wheel Drawing and Spinning Logic
// UPDATED: New categories with backup visual styling
// ===================================

// Configuration
const WHEEL_RADIUS = 140;  // Match backup radius
const CENTER_CIRCLE_RADIUS = 30;
const ARROW_LENGTH = 30;

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

// Category icons (emojis for visual appeal like backup)
const categoryIcons = {
    'Fire Safety': '🔥',
    'Electrical Safety': '⚡',
    'Road Safety': '🚗',
    'Lockout Tagout': '🔒',
    'Material Handling': '📦',
    'Working at Height': '🪜',
    'First Aid': '🏥',
    'Machine Guarding': '⚙️',
    'Chemical Safety': '🧪',
    'Sustainability': '♻️'
};

// Colors for wheel segments (matching backup style)
const colors = [
    '#FF000F',  // ABB Red - Bright
    '#6764f6',  // ABB Lilac - Bright
    '#ff957e',  // ABB Red 1
    '#93a1ff',  // ABB Lilac 1
    '#FF4444',  // Bright Red
    '#7B77FF',  // Medium Lilac
    '#FF5722',  // Orange - Medium
    '#9C27B0',  // Purple - Medium
    '#FF6B6B',  // Coral Red
    '#8B85FF'   // Light Purple
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
    
    console.log('[Wheels] Canvas elements found successfully');
    
    // Get 2D contexts
    categoryWheel.ctx = categoryWheel.canvas.getContext('2d');
    questionWheel.ctx = questionWheel.canvas.getContext('2d');
    
    // Draw initial wheels
    drawCategoryWheel();
    drawQuestionWheel();
    
    // Setup spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.addEventListener('click', spinWheels);
        console.log('[Wheels] Spin button connected');
    }
    
    console.log('[Wheels] Wheels initialized successfully');
}

/**
 * Draw category wheel (with icons like backup)
 */
function drawCategoryWheel() {
    const ctx = categoryWheel.ctx;
    const canvas = categoryWheel.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const segmentAngle = (2 * Math.PI) / categories.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Rotate canvas
    ctx.translate(centerX, centerY);
    ctx.rotate((categoryWheel.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Draw segments
    categories.forEach((category, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, WHEEL_RADIUS, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
       // Draw category name (instead of icon)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + segmentAngle / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';  // White text
    ctx.font = 'bold 12px Arial';  // Smaller font for text

    // Split long category names into 2 lines
    const words = category.split(' ');
    if (words.length > 2) {
        // 3+ words: split into 2 lines
        ctx.fillText(words.slice(0, 2).join(' '), WHEEL_RADIUS * 0.65, -8);
        ctx.fillText(words.slice(2).join(' '), WHEEL_RADIUS * 0.65, 8);
    } else if (words.length === 2) {
        // 2 words: one per line
        ctx.fillText(words[0], WHEEL_RADIUS * 0.65, -5);
        ctx.fillText(words[1], WHEEL_RADIUS * 0.65, 5);
    } else {
        // 1 word: single line
        ctx.fillText(category, WHEEL_RADIUS * 0.65, 0);
    }

    ctx.restore();

    });
    
    // Restore context
    ctx.restore();
    
    // Draw center circle (match backup style)
    ctx.beginPath();
    ctx.arc(centerX, centerY, CENTER_CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#FF000F';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw "ABB" text in center (like backup)
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF000F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ABB', centerX, centerY);
    
    // Draw arrow pointing RIGHT (like backup)
    // drawArrowRight(ctx, centerX, centerY, '#FF000F'); // Removed - using static HTML pointer
}

/**
 * Draw question wheel (with numbers like backup)
 */
function drawQuestionWheel() {
    const ctx = questionWheel.ctx;
    const canvas = questionWheel.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const segmentAngle = (2 * Math.PI) / 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Rotate canvas
    ctx.translate(centerX, centerY);
    ctx.rotate((questionWheel.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
    
    // Draw segments
    for (let i = 0; i < 10; i++) {
        const startAngle = i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, WHEEL_RADIUS, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw question number (like backup)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 32px Arial';  // Match backup number size
        ctx.fillStyle = '#ffffff';
        ctx.fillText(i + 1, WHEEL_RADIUS * 0.65, 0);
        ctx.restore();
    }
    
    // Restore context
    ctx.restore();
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, CENTER_CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#FF000F';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw "ABB" text in center
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF000F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ABB', centerX, centerY);
    
    // Draw arrow pointing RIGHT (lilac color like backup)
    // drawArrowRight(ctx, centerX, centerY, '#6764f6'); // Removed - using static HTML pointer
}

/**
 * Draw arrow pointing RIGHT from center (like backup)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {string} color - Arrow color
 */
/* DEPRECATED - Now using static HTML pointer
function drawArrowRight(ctx, centerX, centerY, color) {
    ctx.beginPath();
    ctx.moveTo(centerX + 35, centerY);        // Start from center circle edge
    ctx.lineTo(centerX + 65, centerY);        // Horizontal line to the right
    ctx.lineTo(centerX + 60, centerY - 10);   // Arrow head top
    ctx.lineTo(centerX + 65, centerY);        // Back to tip
    ctx.lineTo(centerX + 60, centerY + 10);   // Arrow head bottom
    ctx.lineTo(centerX + 65, centerY);        // Back to tip
    ctx.lineTo(centerX + 35, centerY);        // Back to start
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

/**
 * Spin both wheels
 */
function spinWheels() {
    if (categoryWheel.isSpinning || questionWheel.isSpinning) {
        console.log('[Wheels] Already spinning');
        return;
    }
    
    console.log('[Wheels] Spinning wheels...');
    
    // Mark as spinning
    categoryWheel.isSpinning = true;
    questionWheel.isSpinning = true;
    
    // Disable spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.textContent = 'Spinning...';
    }
    
    // Play spin sound
    if (typeof playSound === 'function') {
        playSound('spin-sound');
    }
    
    // Unlock audio
    if (!window.audioUnlocked) {
        window.audioUnlocked = true;
        console.log('[Audio] Audio unlocked via spin button');
    }
    
    // Random rotations
    const categorySpins = 5 + Math.random() * 3;
    const questionSpins = 5 + Math.random() * 3;
    
    const categoryTarget = categoryWheel.rotation + (categorySpins * 360) + Math.random() * 360;
    const questionTarget = questionWheel.rotation + (questionSpins * 360) + Math.random() * 360;
    
    const duration = 4000;  // Match backup duration
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Update rotations
        categoryWheel.rotation = categoryWheel.rotation + (categoryTarget - categoryWheel.rotation) * easeOut * 0.1;
        questionWheel.rotation = questionWheel.rotation + (questionTarget - questionWheel.rotation) * easeOut * 0.1;
        
        // Redraw wheels
        drawCategoryWheel();
        drawQuestionWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete
            categoryWheel.rotation = categoryTarget;
            questionWheel.rotation = questionTarget;
            
            drawCategoryWheel();
            drawQuestionWheel();
            
            // Stop spin sound
            if (typeof stopSound === 'function') {
                stopSound('spin-sound');
            }
            
            // Play tick sound
            if (typeof playSound === 'function') {
                playSound('tick-sound');
            }
            
            // Calculate selections
            calculateSelection(categoryWheel, categories.length);
            calculateSelection(questionWheel, 10);
            
            // Show selection after delay
            setTimeout(showSelection, 500);
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
    // Arrow points RIGHT (0 degrees position)
    const normalizedRotation = ((wheel.rotation % 360) + 360) % 360;
    const segmentAngle = 360 / segments;
    
    // Calculate which segment is at the arrow position
    let selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments;
    
    wheel.selectedIndex = selectedIndex;
    
    console.log(`[Wheels] ${wheel === categoryWheel ? 'Category' : 'Question'} rotation: ${normalizedRotation.toFixed(2)} Selected index: ${selectedIndex}`);
}

/**
 * Show the selected category and question
 */
function showSelection() {
    console.log('[Wheels] Showing selection...');
    
    const selectedCategory = categories[categoryWheel.selectedIndex];
    const selectedQuestionNum = questionWheel.selectedIndex + 1;
    
    console.log(`[Wheels] Selected: ${selectedCategory} Question #${selectedQuestionNum}`);
    
    // Update selection display if elements exist
    const categoryIcon = document.getElementById('selectedCategoryIcon');
    const categoryName = document.getElementById('selectedCategoryName');
    const points = document.getElementById('selectedPoints');
    
    if (categoryIcon) categoryIcon.textContent = categoryIcons[selectedCategory] || '📋';
    if (categoryName) categoryName.textContent = selectedCategory;
    if (points) points.textContent = selectedQuestionNum;
    
    // Hide wheels section
    if (typeof hideSection === 'function') {
        hideSection('wheelsSection');
    }
    
    // Show selection section
    if (typeof showSection === 'function') {
        showSection('selectionSection');
    }
    
    // Load question after delay
    setTimeout(() => {
        if (typeof loadQuestion === 'function') {
            loadQuestion(selectedCategory, selectedQuestionNum);
        }
    }, 2000);
    
    // Reset spinning state
    categoryWheel.isSpinning = false;
    questionWheel.isSpinning = false;
    
    // Re-enable spin button
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.textContent = 'Spin Both Wheels';
    }
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
    
    drawCategoryWheel();
    drawQuestionWheel();
    
    // Show wheels section
    if (typeof showSection === 'function') {
        showSection('wheelsSection');
    }
    
    // Hide selection section
    if (typeof hideSection === 'function') {
        hideSection('selectionSection');
    }
}

// Initialize wheels when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initWheels, 100);
    });
} else {
    setTimeout(initWheels, 100);
}

// Export to global scope
window.spinWheels = spinWheels;
window.resetWheels = resetWheels;
window.categories = categories;
window.CATEGORIES = categories;  // For compatibility

console.log('[Wheels] Script loaded');
