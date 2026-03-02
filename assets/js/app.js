// ===================================
// APP.JS - Main Application Logic, Timer & Game Flow
// ===================================

// Game state
let gameState = {
    score: 0,
    consecutiveCorrect: 0,
    currentQuestion: null,
    currentCategory: null,
    currentPoints: 0,
    usedQuestions: {},
    questionsData: null,
    timerInterval: null,
    timeRemaining: 30
};

// Constants to change timer 
const TIMER_DURATION = 30;
const TIMER_WARNING_THRESHOLD = 10;
const TIMER_CRITICAL_THRESHOLD = 5;

/**
 * Load questions from JSON file
 */
async function loadQuestionsData() {
    try {
        console.log('[App] Loading questions data...');
        const response = await fetch('assets/data/questions.json');
        gameState.questionsData = await response.json();
        console.log('[App] Questions loaded successfully');
        
        // Initialize used questions tracker
        Object.keys(gameState.questionsData).forEach(category => {
            gameState.usedQuestions[category] = [];
        });
        
    } catch (error) {
        console.error('[App] Failed to load questions:', error);
        alert('Failed to load questions. Please refresh the page.');
    }
}

/**
 * Get a random unused question from a category
 * @param {string} category - The category name
 * @returns {object|null}
 */
function getRandomQuestion(category) {
    if (!gameState.questionsData || !gameState.questionsData[category]) {
        console.error('[App] Category not found:', category);
        return null;
    }
    
    const categoryQuestions = gameState.questionsData[category];
    const usedIds = gameState.usedQuestions[category] || [];
    
    // Filter unused questions
    const availableQuestions = categoryQuestions.filter(q => !usedIds.includes(q.id));
    
    // If all questions used, reset for this category
    if (availableQuestions.length === 0) {
        console.log('[App] All questions used in category, resetting:', category);
        gameState.usedQuestions[category] = [];
        return getRandomQuestion(category);
    }
    
    // Select random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    
    // Mark as used
    gameState.usedQuestions[category].push(question.id);
    
    return question;
}

/**
 * Load and display a question
 * @param {string} category - The category name
 * @param {number} points - The points value
 */
function loadQuestion(category, questionNum) {
    console.log('[App] Loading question:', category, questionNum);
    
    // Get random question
    const question = getRandomQuestion(category);
    if (!question) {
        alert('No questions available for this category.');
        return;
    }
    
    // Update game state
    gameState.currentQuestion = question;
    gameState.currentCategory = category;
    gameState.currentPoints = questionNum * 10;
    
    // Hide selection section
    hideSection('selectionSection');
    
    // Show question section
    showSection('questionSection');
    
    // Update question display
    document.getElementById('questionCategoryBadge').textContent = category;
    document.getElementById('questionPointsBadge').textContent = `Q #${questionNum}`;  // was: ${points} pts
    document.getElementById('questionTextEn').textContent = question.question_en;
    document.getElementById('questionTextMr').textContent = question.question_mr;
    
    // Display options
    displayOptions(question);
    
    // Hide feedback section
    const feedbackSection = document.getElementById('feedbackSection');
    if (feedbackSection) {
        feedbackSection.style.display = 'none';
        feedbackSection.className = 'feedback-section';
    }
    
    // Start timer
    startTimer();
}

/**
 * Display answer options
 * @param {object} question
 */
function displayOptions(question) {
    const container = document.getElementById('optionsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    question.options_en.forEach((optionEn, index) => {
        const optionMr = question.options_mr[index];
        
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.dataset.index = index;
        
        // Add title attribute for accessibility (shows full text on hover)
        button.title = `${optionEn} / ${optionMr}`;
        
        // Add aria-label for screen readers
        button.setAttribute('aria-label', `Option ${index + 1}: ${optionEn}`);
        
        button.innerHTML = `
            <span class="option-text option-text-en">${optionEn}</span>
            <span class="option-text option-text-mr">${optionMr}</span>
        `;
        
        button.addEventListener('click', () => handleAnswer(index));
        
        container.appendChild(button);
    });
}

/**
 * Start the countdown timer
 */
function startTimer() {
    console.log('[App] Starting timer...');
    
    // Reset timer state
    gameState.timeRemaining = TIMER_DURATION;
    
    // Reset timer visual
    const timerText = document.getElementById('timerText');
    const timerProgress = document.getElementById('timerProgress');
    const timerCircle = document.querySelector('.timer-circle');
    
    if (timerText) timerText.textContent = TIMER_DURATION;
    if (timerProgress) {
        timerProgress.style.strokeDashoffset = '0';
        timerProgress.style.stroke = '#6764f6';
    }
    if (timerCircle) {
        timerCircle.classList.remove('timer-warning', 'timer-critical');
    }
    
    // Play background music
    playLoopingSound('timer-background');
    
    // Clear any existing interval
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Start countdown
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        
        // Update display
        if (timerText) {
            timerText.textContent = gameState.timeRemaining;
        }
        
        // Update progress circle
        if (timerProgress) {
            const progress = gameState.timeRemaining / TIMER_DURATION;
            const offset = 283 * (1 - progress);
            timerProgress.style.strokeDashoffset = offset;
        }
        
        // Warning at 10 seconds
        if (gameState.timeRemaining === TIMER_WARNING_THRESHOLD) {
            console.log('[App] Timer warning threshold reached');
            //stopSound('timer-background');
            playSound('timer-ticking');
            
            if (timerCircle) {
                timerCircle.classList.add('timer-warning');
            }
        }
        
        // Critical at 5 seconds
        if (gameState.timeRemaining === TIMER_CRITICAL_THRESHOLD) {
            console.log('[App] Timer critical threshold reached');
            playSound('timer-warning');
            
            if (timerCircle) {
                timerCircle.classList.remove('timer-warning');
                timerCircle.classList.add('timer-critical');
            }
        }
        
        // Time's up
        if (gameState.timeRemaining <= 0) {
            console.log('[App] Time is up!');
            stopTimer();
            handleTimeout();
        }
    }, 1000);
    //stopSound('timer-background');

}

/**
 * Stop the timer
 */
function stopTimer() {
    console.log('[App] Stopping timer...');
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // Stop all timer sounds
    stopSound('timer-background');
    stopSound('timer-ticking');
    stopSound('timer-warning');
}

/**
 * Handle answer selection
 * @param {number} selectedIndex
 */
function handleAnswer(selectedIndex) {
    console.log('[App] Answer selected:', selectedIndex);
    
    // Stop timer
    stopTimer();
    
    // Disable all option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);
    
    // Check if correct
    const isCorrect = selectedIndex === gameState.currentQuestion.correct;
    
    if (isCorrect) {
        handleCorrectAnswer(selectedIndex);
    } else {
        handleWrongAnswer(selectedIndex);
    }
}

/**
 * Handle correct answer
 * @param {number} selectedIndex
 */
function handleCorrectAnswer(selectedIndex) {
    console.log('[App] Correct answer!');
    
    // Update score
    gameState.score += gameState.currentPoints;
    gameState.consecutiveCorrect++;
    
    updateScore(gameState.score);
    
    // Highlight correct answer
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons[selectedIndex].classList.add('correct');
    
    // Play applause sound
    playSound('applause-sound');
    
    // Show feedback
    showFeedback('correct', 'Correct! Well done! 🎉');
    
    // Check for consecutive correct
    if (gameState.consecutiveCorrect === 2) {
        setTimeout(() => {
            showCongratsOverlay();
            gameState.consecutiveCorrect = 0; // Reset after showing
        }, 1000);
    }
}

/**
 * Handle wrong answer
 * @param {number} selectedIndex
 */
function handleWrongAnswer(selectedIndex) {
    console.log('[App] Wrong answer!');
    
    // Reset consecutive correct
    gameState.consecutiveCorrect = 0;
    
    // Highlight wrong and correct answers
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons[selectedIndex].classList.add('wrong');
    optionButtons[gameState.currentQuestion.correct].classList.add('correct');
    
    // Play wrong sound
    playSound('wrong-sound');
    
    // Show feedback
    const correctAnswerEn = gameState.currentQuestion.options_en[gameState.currentQuestion.correct];
    showFeedback('wrong', `Wrong! The correct answer is: ${correctAnswerEn}`);
}

/**
 * Handle timeout
 */
function handleTimeout() {
    console.log('[App] Timeout!');
    
    // Reset consecutive correct
    gameState.consecutiveCorrect = 0;
    
    // Disable all option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);
    
    // Highlight correct answer with timeout style
    optionButtons[gameState.currentQuestion.correct].classList.add('timeout');
    
    // Play timeout sound
    playSound('timeout-sound');
    
    // Show feedback
    const correctAnswerEn = gameState.currentQuestion.options_en[gameState.currentQuestion.correct];
    showFeedback('timeout', `Time's up! The correct answer is: ${correctAnswerEn}`);
}

/**
 * Show feedback message
 * @param {string} type - 'correct', 'wrong', or 'timeout'
 * @param {string} message
 */
function showFeedback(type, message) {
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (feedbackSection && feedbackMessage) {
        feedbackSection.className = `feedback-section ${type}`;
        feedbackMessage.textContent = message;
        feedbackSection.style.display = 'block';
    }
}

/**
 * Handle next question
 */
function handleNextQuestion() {
    console.log('[App] Loading next question...');
    
    // Reset wheels
    resetWheels();
    
    // Hide question section
    hideSection('questionSection');
}

/**
 * Reset game state
 */
function resetGameState() {
    console.log('[App] Resetting game state...');
    
    // Stop timer
    stopTimer();
    
    // Reset state
    gameState.score = 0;
    gameState.consecutiveCorrect = 0;
    gameState.currentQuestion = null;
    gameState.currentCategory = null;
    gameState.currentPoints = 0;
    
    // Clear used questions
    Object.keys(gameState.usedQuestions).forEach(category => {
        gameState.usedQuestions[category] = [];
    });
    
    // Update score display
    updateScore(0);
    
    // Reset wheels
    resetWheels();
    
    // Hide question section
    hideSection('questionSection');
    
    console.log('[App] Game state reset complete');
}

/**
 * Initialize game page
 */
function initGamePage() {
    console.log('[App] Initializing game page...');
    
    // Begin game button
    const beginGameBtn = document.getElementById('beginGameBtn');
    if (beginGameBtn) {
        beginGameBtn.addEventListener('click', () => {
            showPage('gamePage');
            resetWheels();
        });
    }
    
    // Back to home button
    const backHomeBtn = document.getElementById('backHomeBtn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            stopTimer();
            showPage('homePage');
        });
    }
    
    // Next question button
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', handleNextQuestion);
    }
    
    // Reset game button
    const resetGameBtn = document.getElementById('resetGameBtn');
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game? Your score will be lost.')) {
                resetGameState();
            }
        });
    }
    
    console.log('[App] Game page initialized');
}

/**
 * Initialize the application
 */
async function initApp() {
    console.log('[App] Initializing application...');
    
    // Load questions data
    await loadQuestionsData();
    
    // Initialize game page
    initGamePage();
    
    console.log('[App] Application initialized successfully');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ===== FORCE QUESTION CARD TO THE LEFT =====
function forceCardPositioning() {
    const card = document.querySelector('.question-card');
    if (card) {
        card.style.setProperty('margin-left', '0.5vw', 'important');
        card.style.setProperty('margin-right', '6.5vw', 'important');
        console.log('✅ Card forced to left');
    }
}

// Run when question is displayed
const originalDisplayQuestion = window.displayQuestion;
if (originalDisplayQuestion) {
    window.displayQuestion = function(...args) {
        const result = originalDisplayQuestion.apply(this, args);
        setTimeout(forceCardPositioning, 100);
        return result;
    };
}

// Run on page load
document.addEventListener('DOMContentLoaded', forceCardPositioning);

// Watch for card appearing
const observer = new MutationObserver(() => {
    if (document.querySelector('.question-card')) {
        forceCardPositioning();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Export functions to global scope
window.loadQuestion = loadQuestion;
window.resetGameState = resetGameState;
window.gameState = gameState;

