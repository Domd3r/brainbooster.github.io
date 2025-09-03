// Elements
const loadingScreen = document.getElementById("loadingScreen");
const welcomeScreen = document.getElementById("welcomeScreen");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");
const exampleText = document.getElementById("exampleText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const scoreText = document.getElementById("scoreText");
const rankText = document.getElementById("rankText");
const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

let score = 0;
let currentAnswer = 0;
let difficulty = 1;

// Loading → welcome
setTimeout(() => {
  loadingScreen.classList.add("hidden");
  welcomeScreen.classList.remove("hidden");
}, 2000);

// Welcome → difficulty screen
startBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");
});

// Difficulty → game
document.querySelectorAll(".difficultyBtn").forEach(btn => {
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

// Example generator
function generateExample() {
  let a, b, op;
  if (difficulty <= 2) { // 1.-2. třída
    a = rand(1, 10 * difficulty);
    b = rand(1, 10 * difficulty);
    op = Math.random() > 0.5 ? "+" : "-";
  } else if (difficulty <= 5) { // 3.-5. třída
    a = rand(1, 20 * difficulty);
    b = rand(1, 20 * difficulty);
    op = ["+","-","×"][rand(0,2)];
  } else if (difficulty <= 9) { // 6.-9. třída
    a = rand(1, 50);
    b = rand(1, 50);
    op = ["+","-","×","÷"][rand(0,3)];
  } else { // SŠ
    a = rand(1, 100);
    b = rand(1, 99);
    op = ["+","-","×","÷"][rand(0,3)];
  }
  exampleText.textContent = `${a} ${op} ${b} = ?`;
  switch (op) {
    case "+": currentAnswer = a + b; break;
    case "-": currentAnswer = a - b; break;
    case "×": currentAnswer = a * b; break;
    case "÷": currentAnswer = Math.floor(a / b); break;
  }
}

// Random helper
function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

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

// History
historyBtn.addEventListener("click", () => {
  historyPanel.classList.toggle("active");
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
