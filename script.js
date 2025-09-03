// Elements
const welcomeScreen = document.getElementById("welcomeScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameScreen = document.getElementById("gameScreen");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");

const exampleText = document.getElementById("exampleText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const scoreText = document.getElementById("scoreText");
const rankText = document.getElementById("rankText");

const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const closeHistory = document.getElementById("closeHistory");

const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

const calcIcon = document.getElementById("calculatorIcon");
const calculator = document.getElementById("calculator");
const closeCalc = document.getElementById("closeCalc");
const calcDisplay = document.getElementById("calcDisplay");
const calcButtons = document.querySelectorAll(".calc-btn");

let score = 0;
let currentAnswer = 0;
let difficulty = 1;

// Start → difficulty
startBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");
});

// Select difficulty → game
document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", () => {
    difficulty = parseInt(btn.dataset.level);
    difficultyScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    score = 0;
    scoreText.textContent = "Skóre: 0";
    updateRank();
    generateExample();
  });
});

// Back button
backBtn.addEventListener("click", () => {
  gameScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");
});

// Example generator
function generateExample() {
  let a, b, op;
  switch(difficulty) {
    case 1: // 1. stupeň
      a = rand(1, 20);
      b = rand(1, 20);
      op = Math.random() > 0.5 ? "+" : "-";
      break;
    case 2: // 2. stupeň
      a = rand(2, 12);
      b = rand(2, 12);
      op = Math.random() > 0.5 ? "×" : "÷";
      break;
    case 3: // Střední škola
      a = rand(2, 15);
      b = rand(2, 3);
      op = Math.random() > 0.5 ? "^" : "√";
      break;
  }

  if (op === "+") currentAnswer = a + b;
  else if (op === "-") currentAnswer = a - b;
  else if (op === "×") currentAnswer = a * b;
  else if (op === "÷") { currentAnswer = a; exampleText.textContent = `${a*b} ÷ ${b} = ?`; return; }
  else if (op === "^") currentAnswer = Math.pow(a, b);
  else if (op === "√") { currentAnswer = Math.sqrt(a); exampleText.textContent = `√${a*a} = ?`; return; }

  exampleText.textContent = `${a} ${op} ${b} = ?`;
}

// Submit answer
submitBtn.addEventListener("click", () => {
  let userAnswer = parseInt(answerInput.value);
  if (userAnswer === currentAnswer) {
    score++;
    addHistory(`✅ ${exampleText.textContent} ${userAnswer}`);
  } else {
    addHistory(`❌ ${exampleText.textContent} ${userAnswer} (správně: ${currentAnswer})`);
  }
  answerInput.value = "";
  scoreText.textContent = `Skóre: ${score}`;
  updateRank();
  generateExample();
});

// History toggle
historyBtn.addEventListener("click", () => {
  historyPanel.classList.add("active");
});
closeHistory.addEventListener("click", () => {
  historyPanel.classList.remove("active");
});

function addHistory(entry) {
  let li = document.createElement("li");
  li.textContent = entry;
  historyList.prepend(li);
}

// Rank system
function updateRank() {
  if (score < 5) rankText.textContent = "🎓 ZAČÁTEČNÍK";
  else if (score < 10) rankText.textContent = "⭐ POKROČILÝ";
  else if (score < 15) rankText.textContent = "🏆 MISTR";
  else rankText.textContent = "👑 MATEMATICKÝ GÉNIUS";
}

// Helper
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Music
let isPlaying = false;
musicBtn.addEventListener("click", () => {
  if (!isPlaying) {
    bgMusic.play();
    musicBtn.textContent = "⏸ Stop hudba";
    isPlaying = true;
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Hudba";
    isPlaying = false;
  }
});

// Calculator
calcIcon.addEventListener("click", () => {
  calculator.classList.remove("hidden");
});
closeCalc.addEventListener("click", () => {
  calculator.classList.add("hidden");
});

calcButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    let val = btn.textContent;
    if (val === "C") {
      calcDisplay.value = "";
    } else if (val === "=") {
      try {
        calcDisplay.value = eval(calcDisplay.value);
      } catch {
        calcDisplay.value = "Error";
      }
    } else {
      calcDisplay.value += val;
    }
  });
});
