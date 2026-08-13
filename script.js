const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let winningLine = null;

const score = { X: 0, O: 0, draws: 0 };

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawsEl = document.getElementById('score-draws');

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.setAttribute('aria-label', `Casa ${i + 1}`);
    cell.addEventListener('click', () => handleCellClick(i));
    boardEl.appendChild(cell);
  }
}

function renderBoard() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value ?? '';
    cell.classList.toggle('taken', value !== null);
    cell.classList.toggle('player-x', value === 'X');
    cell.classList.toggle('player-o', value === 'O');
    cell.classList.toggle('winner', winningLine !== null && winningLine.includes(index));
  });
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function updateScore() {
  scoreXEl.textContent = score.X;
  scoreOEl.textContent = score.O;
  scoreDrawsEl.textContent = score.draws;
}

function checkWinner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winningLine = line;
      return board[a];
    }
  }
  return null;
}

function isDraw() {
  return board.every((cell) => cell !== null);
}

function handleCellClick(index) {
  if (gameOver || board[index] !== null) return;

  board[index] = currentPlayer;
  renderBoard();

  const winner = checkWinner();
  if (winner) {
    gameOver = true;
    score[winner]++;
    updateScore();
    renderBoard();
    updateStatus(`Vencedor: ${winner}`);
    return;
  }

  if (isDraw()) {
    gameOver = true;
    score.draws++;
    updateScore();
    updateStatus('Velha! Empate.');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Vez de: ${currentPlayer}`);
}

function resetBoard() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winningLine = null;
  renderBoard();
  updateStatus('Vez de: X');
}

resetBtn.addEventListener('click', resetBoard);

createBoard();
renderBoard();
