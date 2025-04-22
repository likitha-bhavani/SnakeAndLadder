const board = document.getElementById("board");
const dice = document.getElementById("dice");
const diceResult = document.getElementById("dice-result");
const turnText = document.getElementById("turn");

const player1Token = createToken("⚫");
const player2Token = createToken("🔴");
const player3Token = createToken("🔵");
const player4Token = createToken("🟢");

let player1Position = 1;
let player2Position = 1;
let player3Position = 1;
let player4Position = 1;

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

const sounds = {
  dice: new Audio('sounds/dice-roll.mp3'),
  snake: new Audio('sounds/snake.mp3'),
  ladder: new Audio('sounds/ladder.mp3'),
  move: new Audio('sounds/coins.mp3')
};

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
cells[1].appendChild(player3Token);
cells[1].appendChild(player4Token);

function createToken(symbol) {
  const token = document.createElement("div");
  token.className = "token";
  token.innerText = symbol;
  return token;
}

dice.addEventListener("click", rollDice);

function rollDice() {
  dice.removeEventListener("click", rollDice); // disable repeated clicks

  const roll = Math.floor(Math.random() * 6) + 1;
  sounds.dice.play();
  dice.classList.add("roll-animate");

  setTimeout(() => {
    dice.classList.remove("roll-animate");
    dice.src = `images/dice${roll}.png`;

    switch (currentPlayer) {
      case "player1":
        diceResult.innerText = `Player 1 rolled a ${roll}`;
        player1Position = moveToken(player1Token, player1Position, roll);
        if (player1Position === 100) return showWinner("Player 1");
        currentPlayer = "player2";
        turnText.innerText = "Player 2's Turn 🔴";
        break;

      case "player2":
        diceResult.innerText = `Player 2 rolled a ${roll}`;
        player2Position = moveToken(player2Token, player2Position, roll);
        if (player2Position === 100) return showWinner("Player 2");
        currentPlayer = "player3";
        turnText.innerText = "Player 3's Turn 🔵";
        break;

      case "player3":
        diceResult.innerText = `Player 3 rolled a ${roll}`;
        player3Position = moveToken(player3Token, player3Position, roll);
        if (player3Position === 100) return showWinner("Player 3");
        currentPlayer = "player4";
        turnText.innerText = "Player 4's Turn 🟢";
        break;

      case "player4":
        diceResult.innerText = `Player 4 rolled a ${roll}`;
        player4Position = moveToken(player4Token, player4Position, roll);
        if (player4Position === 100) return showWinner("Player 4");
        currentPlayer = "player1";
        turnText.innerText = "Player 1's Turn ⚫";
        break;
    }

    dice.addEventListener("click", rollDice); 
  }, 600);
}

function moveToken(token, currentPos, steps) {
  let newPos = currentPos + steps;
  if (newPos > 100) return currentPos;

  if (snakes[newPos]) {
    newPos = snakes[newPos];
    sounds.snake.play();
  } else if (ladders[newPos]) {
    newPos = ladders[newPos];
    sounds.ladder.play();
  } else {
    sounds.move.play();
  }

  token.remove();
  cells[newPos].appendChild(token);
  return newPos;
}

function showWinner(winner) {
  document.getElementById("winner-text").innerText = `🎉 ${winner} Wins!`;
  document.getElementById("winner-screen").style.display = "flex";
}

function replayGame() {
  window.location.reload();
}

function quitGame() {
  window.location.href = "select.html";
}

document.getElementById("quit-bottom-button").addEventListener("click", quitGame);
