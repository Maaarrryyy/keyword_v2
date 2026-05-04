"use strict";
const elements = {
    input: document.getElementById('input'),
    resetBtn: document.getElementById('reset-btn'),
    checkBtn: document.getElementById('check-btn'),
    result: document.getElementById('result'),
};
const CONFIG = {
    MIN: 1,
    MAX: 100,
    ATTEMPTS: 5
};
function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const gameState = {
    gameStatus: 'playing',
    randomNum: generateRandom(CONFIG.MIN, CONFIG.MAX),
    attemptsLeft: CONFIG.ATTEMPTS,
    message: 'Start guessing!'
};
function validateInput(value) {
    const trimmed = value.trim();
    if (trimmed === '') {
        return { isValid: false, data: null, error: 'Type a number!' };
    }
    const num = Number(trimmed);
    if (isNaN(num)) {
        return { isValid: false, data: null, error: 'Invalid number!' };
    }
    if (num > CONFIG.MAX || num < CONFIG.MIN) {
        return {
            isValid: false,
            data: null,
            error: `Range: ${CONFIG.MIN}-${CONFIG.MAX}`
        };
    }
    return { isValid: true, data: num };
}
function getFeedback(guess, target) {
    if (guess > target)
        return 'Too high! ↓';
    if (guess < target)
        return 'Too low! ↑';
    return 'Bingo! 🎉';
}
function render() {
    elements.result.textContent = gameState.message;
    const isOver = gameState.gameStatus !== 'playing';
    elements.input.disabled = isOver;
    elements.checkBtn.classList.toggle('hidden', isOver);
    elements.resetBtn.classList.toggle('hidden', !isOver);
    if (gameState.gameStatus === 'won') {
        elements.result.style.color = '#16a34a';
    }
    else if (gameState.gameStatus === 'lost') {
        elements.result.style.color = '#dc2626';
    }
    else {
        elements.result.style.color = 'inherit';
    }
}
function handleGuess() {
    if (gameState.gameStatus !== 'playing')
        return;
    const validation = validateInput(elements.input.value);
    if (!validation.isValid) {
        gameState.message = validation.error;
        render();
        return;
    }
    const guess = validation.data;
    gameState.attemptsLeft--;
    const feedback = getFeedback(guess, gameState.randomNum);
    if (guess === gameState.randomNum) {
        gameState.gameStatus = 'won';
        gameState.message = `Bingo! The number was ${gameState.randomNum}`;
    }
    else if (gameState.attemptsLeft === 0) {
        gameState.gameStatus = 'lost';
        gameState.message = `Game Over! It was ${gameState.randomNum}`;
    }
    else {
        gameState.message = `${feedback} (Attempts left: ${gameState.attemptsLeft})`;
    }
    elements.input.value = '';
    render();
    elements.input.focus();
}
function resetGame() {
    gameState.gameStatus = 'playing';
    gameState.randomNum = generateRandom(CONFIG.MIN, CONFIG.MAX);
    gameState.attemptsLeft = CONFIG.ATTEMPTS;
    gameState.message = 'Start guessing!';
    elements.input.value = '';
    render();
    elements.input.focus();
}
elements.checkBtn.addEventListener('click', handleGuess);
elements.resetBtn.addEventListener('click', resetGame);
elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter')
        handleGuess();
});
render();
