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

// Constants
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
function loadQuestion(category, points) {
    console.log('[App] Loading question:', category, points);
    
    // Get random question
    const question = getRandomQuestion(category);
    if (!question) {
        alert('No questions available for this category.');
        return;
    }
    
    // Update game state
    gameState.currentQuestion = question;
    gameState.currentCategory = category;
    gameState.currentPoints = points;
    
    // Hide selection section
    hideSection('selectionSection');
    
    // Show question section
    showSection('questionSection');
    
    // Update question display
    document.getElementById('questionCategoryBadge').textContent = category;
    document.getElementById('questionPointsBadge').textContent = `${points} pts`;
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
    playSound('timer-background');
    
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
            stopSound('timer-background');
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
