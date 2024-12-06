const gameBoard = document.getElementById('game-board');
const turnIndicator = document.getElementById('turn-indicator');
const restartButton = document.getElementById('restart');
const humanVsHumanButton = document.getElementById('human-vs-human');
const humanVsAIButton = document.getElementById('human-vs-ai');

// Audio elements
const clickSound = document.getElementById('click-sound');
const buttonSound = document.getElementById('button-sound');
const winSound = document.getElementById('win-sound');

// Score elements
const scoreXElement = document.getElementById('score-x');
const scoreTiesElement = document.getElementById('score-ties');
const scoreOElement = document.getElementById('score-o');

let board = Array(16).fill('');
let currentPlayer = 'X';
let isGameOver = false;
let mode = 'human-vs-human'; // Default mode
let scoreX = 0;
let scoreO = 0;
let scoreTies = 0;

const boardSize = 4;
const winLength = 4;

// Create the game board
function createBoard() {
  gameBoard.innerHTML = '';
  board = Array(16).fill('');
  isGameOver = false;

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    gameBoard.appendChild(cell);
    cell.addEventListener('click', handleClick);
  }
}

// Handle cell click
function handleClick(event) {
  if (isGameOver) return;

  const cell = event.target;
  const index = cell.dataset.index;

  if (board[index]) return;

  playSound(clickSound);
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  const winner = checkWinner();
  if (winner) {
    handleGameOver(winner);
    return;
  }

  if (mode === 'human-vs-human') {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.textContent =
      currentPlayer === 'X' ? "Player 1's TURN" : "Player 2's TURN";
  } else if (mode === 'human-vs-ai') {
    currentPlayer = 'O';
    turnIndicator.textContent = "O's TURN";
    setTimeout(aiMove, 500);
  }
}

// AI move for Human vs AI mode
function aiMove() {
  const emptyCells = board
    .map((value, index) => (value === '' ? index : null))
    .filter((value) => value !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomIndex] = 'O';
  const cell = gameBoard.children[randomIndex];
  cell.textContent = 'O';
  cell.classList.add('taken');

  const winner = checkWinner();
  if (winner) {
    handleGameOver(winner);
    return;
  }

  currentPlayer = 'X';
  turnIndicator.textContent = "X's TURN";
}

// Check for a winner
function checkWinner() {
  // Rows, columns, and diagonals
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j <= boardSize - winLength; j++) {
      if (
        checkLine(i * boardSize + j, 1) ||
        checkLine(j * boardSize + i, boardSize)
      ) {
        return currentPlayer;
      }
    }
  }
  // Diagonals
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = 0; j <= boardSize - winLength; j++) {
      if (
        checkLine(i * boardSize + j, boardSize + 1) ||
        checkLine(i * boardSize + (boardSize - 1) - j, boardSize - 1)
      ) {
        return currentPlayer;
      }
    }
  }
  return board.includes('') ? null : 'Draw';
}

// Check line for a win
function checkLine(start, step) {
  let count = 0;
  for (let i = 0; i < winLength; i++) {
    if (board[start + i * step] === currentPlayer) count++;
    else break;
  }
  return count === winLength;
}

// Handle game over
function handleGameOver(winner) {
  isGameOver = true;
  playSound(winSound);

  if (winner === 'Draw') {
    scoreTies++;
    scoreTiesElement.textContent = scoreTies;
    turnIndicator.textContent = "IT'S A TIE!";
  } else {
    if (currentPlayer === 'X') {
      scoreX++;
      scoreXElement.textContent = scoreX;
    } else {
      scoreO++;
      scoreOElement.textContent = scoreO;
    }
    turnIndicator.textContent = `${currentPlayer} WINS!`;
  }
}

// Play a sound
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Restart the game
function restartGame() {
  currentPlayer = 'X';
  turnIndicator.textContent =
    mode === 'human-vs-human' ? "Player 1's TURN" : "X's TURN";
  createBoard();
}

// Set game mode
function setMode(newMode) {
  mode = newMode;
  playSound(buttonSound);

  if (newMode === 'human-vs-human') {
    humanVsHumanButton.classList.add('active');
    humanVsAIButton.classList.remove('active');
  } else {
    humanVsAIButton.classList.add('active');
    humanVsHumanButton.classList.remove('active');
  }

  restartGame();
}

// Event listeners
restartButton.addEventListener('click', restartGame);
humanVsHumanButton.addEventListener('click', () => setMode('human-vs-human'));
humanVsAIButton.addEventListener('click', () => setMode('human-vs-ai'));

// Initialize the game
createBoard();
