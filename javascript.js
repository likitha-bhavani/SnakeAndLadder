const board = document.getElementById("board");
const dice = document.getElementById("dice");
const diceResult = document.getElementById("dice-result");
const turnText = document.getElementById("turn");

const playerToken = document.createElement("div");
const computerToken = document.createElement("div");
playerToken.className = "token";
computerToken.className = "token";
playerToken.innerText = "⚫";
computerToken.innerText = "🔵";

let playerPosition = 1;
let computerPosition = 1;
let currentPlayer = "player";

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

cells[1].appendChild(playerToken);
cells[1].appendChild(computerToken);

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
    diceResult.innerText = `You rolled a ${roll}`;

    if (currentPlayer === "player") {
      playerPosition = moveToken(playerToken, playerPosition, roll);
      if (playerPosition === 100) return showWinner("Player");
      currentPlayer = "computer";
      turnText.innerText = "Computer's Turn 🔵";
      setTimeout(computerTurn, 1000);
    }
  }, 400);
}
function computerTurn() {
    turnText.innerText = "Computer is thinking";
  
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      diceRollSound.play();
      dice.src = `images/dice${roll}.png`;
      diceResult.innerText = `Computer rolled a ${roll}`;
  
      setTimeout(() => {
        const oldPos = computerPosition;
        computerPosition = moveToken(computerToken, oldPos, roll);
  
        if (computerPosition === 100) {
          showWinner("Computer");
        } else {
          currentPlayer = "player";
          turnText.innerText = "Player's Turn ⚫";
        }
      }, 800);
    }, 1000);
  }


dice.addEventListener("click", () => {
  if (currentPlayer === "player") {
    rollDice();
  }
});

function showWinner(winnerName) {
    document.getElementById("winner-text").innerText = `🎉 ${winnerName} Wins!`;
  
    const winnerImage = document.getElementById("winner-image");
  
    if (winnerName.toLowerCase() === "player") {
      winnerImage.src = "win.gif"; 
      winnerImage.alt = "Player Wins";
    } else if (winnerName.toLowerCase() === "computer") {
      winnerImage.src = "computer-winner.gif"; 
      winnerImage.alt = "Computer Wins";
    }
  
    document.getElementById("winner-screen").style.display = "flex";
  }
  

function replayGame() {
  playerPosition = 1;
  computerPosition = 1;
  currentPlayer = "player";
  turnText.innerText = "Player's Turn ⚫";
  diceResult.innerText = "";
  dice.src = "images/dice6.png";

  playerToken.remove();
  computerToken.remove();
  cells[1].appendChild(playerToken);
  cells[1].appendChild(computerToken);

  document.getElementById("winner-screen").style.display = "none";
}

function quitGame() {
    window.location.href = "player.html"; 
  }
  
  document.getElementById("quit-bottom-button").addEventListener("click", function() {
    window.location.href = "player.html";
  });
  