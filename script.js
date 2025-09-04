document.addEventListener("DOMContentLoaded", () => {
  // ----------- ELEMENTS -----------
  const welcomeScreen = document.getElementById("welcomeScreen");
  const difficultyScreen = document.getElementById("difficultyScreen");
  const categoryScreen = document.getElementById("categoryScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultModal = document.getElementById("resultModal");

  const startBtn = document.getElementById("startBtn");
  const backToWelcome = document.getElementById("backToWelcome");
  const backToDiff = document.getElementById("backToDiff");
  const backToCat = document.getElementById("backToCat");
  const backToCategories = document.getElementById("backToCategories");
  const retryBtn = document.getElementById("retryBtn");
  const submitBtn = document.getElementById("submitBtn");

  const exampleText = document.getElementById("exampleText");
  const answerInput = document.getElementById("answerInput");
  const scoreText = document.getElementById("scoreText");
  const progressBar = document.getElementById("progressBar");
  const rankText = document.getElementById("rankText");

  const categoryButtons = document.getElementById("categoryButtons");

  const historyPanel = document.getElementById("historyPanel");
  const historyList = document.getElementById("historyList");
  const historyBtn = document.getElementById("historyBtn");
  const closeHistory = document.getElementById("closeHistory");

  const calcIcon = document.getElementById("calculatorIcon");
  const calculator = document.getElementById("calculator");
  const closeCalc = document.getElementById("closeCalc");
  const calcDisplay = document.getElementById("calcDisplay");
  const calcButtons = document.querySelectorAll(".calc-btn");

  // ----------- VARIABLES -----------
  let currentLevel = 1;
  let currentCategory = "";
  let currentQuestion = 0;
  let correctAnswers = 0;
  let currentAnswer = null;

  const categories = {
    1: ["➕ Sčítání","➖ Odčítání","✖ Násobilka","➗ Dělení","½ Zlomky","📏 Převody jednotek"],
    2: ["🔢 Celá čísla","½ Zlomky","% Procenta","🔤 Výrazy","^ Mocniny/Odmocniny"]
  };

  // ----------- HELPERS -----------
  function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  function showScreen(screen){
    [welcomeScreen,difficultyScreen,categoryScreen,gameScreen].forEach(s=>s.classList.remove("active"));
    screen.classList.add("active");
  }

  function updateProgress(){
    progressBar.style.width = (currentQuestion/10*100)+"%";
  }

  function updateRank(){
    if(correctAnswers < 3) rankText.textContent = "🎓 ZAČÁTEČNÍK";
    else if(correctAnswers < 5) rankText.textContent = "⭐ POKROČILÝ";
    else if(correctAnswers < 8) rankText.textContent = "🏆 MISTR";
    else rankText.textContent = "👑 MATEMATICKÝ GÉNIUS";
  }

  function addHistory(entry){
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.prepend(li);
  }

  // ----------- NAVIGATION -----------
  startBtn.addEventListener("click", ()=>showScreen(difficultyScreen));
  backToWelcome.addEventListener("click", ()=>showScreen(welcomeScreen));
  backToDiff.addEventListener("click", ()=>showScreen(difficultyScreen));
  backToCat.addEventListener("click", ()=>showScreen(categoryScreen));

  backToCategories.addEventListener("click", ()=>{
    resultModal.classList.add("hidden");
    showScreen(categoryScreen);
  });
  retryBtn.addEventListener("click", ()=>{
    resultModal.classList.add("hidden");
    startCategory(currentCategory);
  });

  document.querySelectorAll(".difficulty").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      currentLevel = parseInt(btn.dataset.level);
      loadCategories(currentLevel);
      showScreen(categoryScreen);
    });
  });

  function loadCategories(level){
    categoryButtons.innerHTML = "";
    categories[level].forEach(cat=>{
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = cat;
      b.addEventListener("click", ()=>startCategory(cat));
      categoryButtons.appendChild(b);
    });
  }

  // ----------- GAME -----------
  function startCategory(cat){
    currentCategory = cat;
    currentQuestion = 0;
    correctAnswers = 0;
    scoreText.textContent = "Skóre: 0";
    progressBar.style.width="0%";
    rankText.textContent="🎓 ZAČÁTEČNÍK";
    showScreen(gameScreen);
    generateExample();
  }

  function generateExample(){
    currentQuestion++;
    if(currentQuestion>10){ endCategory(); return; }

    let a,b;
    switch(currentCategory){
      // 1. stupeň
      case "➕ Sčítání": a=rand(1,20); b=rand(1,20); currentAnswer=a+b; exampleText.textContent=`${a}+${b}=?`; break;
      case "➖ Odčítání": a=rand(1,20); b=rand(1,20); currentAnswer=a-b; exampleText.textContent=`${a}-${b}=?`; break;
      case "✖ Násobilka": a=rand(1,10); b=rand(1,10); currentAnswer=a*b; exampleText.textContent=`${a}×${b}=?`; break;
      case "➗ Dělení": b=rand(1,10); currentAnswer=rand(1,10); a=b*currentAnswer; exampleText.textContent=`${a}÷${b}=?`; break;
      case "½ Zlomky": a=rand(1,9); currentAnswer=a/2; exampleText.textContent=`${a}/2=?`; break;
      case "📏 Převody jednotek": a=rand(1,100); currentAnswer=a*10; exampleText.textContent=`${a} cm=? mm`; break;

      // 2. stupeň
      case "🔢 Celá čísla": a=rand(-20,20); b=rand(-20,20); currentAnswer=a+b; exampleText.textContent=`${a}+${b}=?`; break;
      case "½ Zlomky": a=rand(1,10); b=rand(1,10); currentAnswer=a*b; exampleText.textContent=`${a}/${b} × ${b}=?`; break;
      case "% Procenta": a=rand(10,200); b=rand(5,50); currentAnswer=Math.round(a*b/100); exampleText.textContent=`${b}% z ${a}=?`; break;
      case "🔤 Výrazy": a=rand(1,10); b=rand(1,10); currentAnswer=2*a+3*b; exampleText.textContent=`2×${a}+3×${b}=?`; break;
      case "^ Mocniny/Odmocniny":
        if(Math.random()>0.5){ a=rand(2,10); currentAnswer=a*a; exampleText.textContent=`${a}²=?`; }
        else { a=rand(2,12); currentAnswer=a; exampleText.textContent=`√${a*a}=?`; }
        break;
    }
    updateProgress();
  }

  submitBtn.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keyup", e=>{ if(e.key==="Enter") checkAnswer(); });

  function checkAnswer(){
    if(answerInput.value==="") return;
    if(parseFloat(answerInput.value)==currentAnswer) correctAnswers++;
    addHistory(`${currentQuestion}. ${exampleText.textContent} = ${answerInput.value} (${parseFloat(answerInput.value)==currentAnswer?"✅":"❌, správně: "+currentAnswer})`);
    scoreText.textContent=`Skóre: ${correctAnswers}`;
    updateRank();
    answerInput.value="";
    generateExample();
  }

  function endCategory(){
    let grade=5;
    if(correctAnswers>=9) grade=1;
    else if(correctAnswers>=7) grade=2;
    else if(correctAnswers>=5) grade=3;
    else if(correctAnswers>=3) grade=4;

    document.getElementById("finalGrade").textContent=`Známka: ${grade} (${correctAnswers}/10)`;
    resultModal.classList.remove("hidden");
  }

  // ----------- HISTORY PANEL -----------
  historyBtn.addEventListener("click", ()=>historyPanel.classList.add("active"));
  closeHistory.addEventListener("click", ()=>historyPanel.classList.remove("active"));

  // ----------- CALCULATOR -----------
  calcIcon.addEventListener("click", ()=>{ calculator.classList.add("show"); calculator.classList.remove("hidden"); });
  closeCalc.addEventListener("click", ()=>{ calculator.classList.remove("show"); setTimeout(()=>calculator.classList.add("hidden"),400); });
  calcButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const val=btn.textContent;
      if(val==="C") calcDisplay.value="";
      else if(val==="="){ try{ calcDisplay.value=Function(`return (${calcDisplay.value})`)(); }catch{ calcDisplay.value="Error";} }
      else calcDisplay.value+=val;
    });
  });
});
