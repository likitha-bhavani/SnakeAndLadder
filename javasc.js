
const board = document.getElementById("board");
const dice = document.getElementById("dice");
const diceResult = document.getElementById("dice-result");
const turnText = document.getElementById("turn");

const player1Token = document.createElement("div");
const player2Token = document.createElement("div");
player1Token.className = "token";
player2Token.className = "token";
player1Token.innerText = "⚫"; // Player 1
player2Token.innerText = "🔴"; // Player 2

let player1Position = 1;
let player2Position = 1;
let currentPlayer = "player1";

const snakes = {
  97: 85, 94: 88, 83: 64, 72: 68, 62: 42,
  66: 46, 57: 43, 53: 32, 34: 27, 37: 17,
  19: 4, 14: 9
};

const ladders = {
  10: 29, 15: 36, 20: 39, 54: 74, 71: 91,
  76: 95, 80: 99
};

const cells = [];

const diceRollSound = new Audio('sounds/dice-roll.mp3');
const snakeBiteSound = new Audio('sounds/snake.mp3');
const ladderMoveSound = new Audio('sounds/ladder.mp3');
const coinMoveSound = new Audio('sounds/coins.mp3');

for (let row = 9; row >= 0; row--) {
  for (let col = 0; col < 10; col++) {
    const num = row % 2 === 0 ? row * 10 + col + 1 : row * 10 + (9 - col) + 1;
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = num;
    board.appendChild(cell);
    cells[num] = cell;
  }
}

cells[1].appendChild(player1Token);
cells[1].appendChild(player2Token);

dice.addEventListener("click", rollDice);

function moveToken(token, oldPos, steps) {
  let newPos = oldPos + steps;
  if (newPos > 100) return oldPos;

  if (snakes[newPos]) {
    snakeBiteSound.play();
    newPos = snakes[newPos];
  } else if (ladders[newPos]) {
    ladderMoveSound.play();
    newPos = ladders[newPos];
  }

  coinMoveSound.play();
  token.remove();
  cells[newPos].appendChild(token);
  return newPos;
}

function rollDice() {
  const roll = Math.floor(Math.random() * 6) + 1;
  diceRollSound.play();
  dice.classList.add("roll-animate");

  setTimeout(() => {
    dice.classList.remove("roll-animate");
    dice.src = `images/dice${roll}.png`;
    diceResult.innerText = `${currentPlayer === "player1" ? "Player 1" : "Player 2"} rolled a ${roll}`;

    if (currentPlayer === "player1") {
      player1Position = moveToken(player1Token, player1Position, roll);
      if (player1Position === 100) return showWinner("Player 1");
      currentPlayer = "player2";
      turnText.innerText = "Player 2's Turn 🔴";
    } else {
      player2Position = moveToken(player2Token, player2Position, roll);
      if (player2Position === 100) return showWinner("Player 2");
      currentPlayer = "player1";
      turnText.innerText = "Player 1's Turn ⚫";
    }
  }, 400);
}

function showWinner(winner) {
  document.getElementById("winner-text").innerText = `🎉 ${winner} Wins!`;
  document.getElementById("winner-screen").style.display = "flex";
}

function replayGame() {
  window.location.reload();
}
function quitGame() {
    window.location.href = "player.html"; 
  }

  document.getElementById("quit-bottom-button").addEventListener("click", function() {
    window.location.href = "player.html";
  });
  
