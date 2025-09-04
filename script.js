document.addEventListener("DOMContentLoaded", () => {
  // Screens
  const screens = {
    welcome: document.getElementById("welcomeScreen"),
    difficulty: document.getElementById("difficultyScreen"),
    category: document.getElementById("categoryScreen"),
    game: document.getElementById("gameScreen"),
    result: document.getElementById("resultScreen")
  };

  const startBtn = document.getElementById("startBtn");
  const themeBtn = document.getElementById("themeBtn");
  const backToWelcome = document.getElementById("backToWelcome");
  const backToDiff = document.getElementById("backToDiff");
  const backToCat = document.getElementById("backToCat");
  const backToCat2 = document.getElementById("backToCat2");
  const backToDiff2 = document.getElementById("backToDiff2");

  const difficultyButtons = document.querySelectorAll(".difficulty");
  const categoryButtons = document.getElementById("categoryButtons");

  const exampleText = document.getElementById("exampleText");
  const answerInput = document.getElementById("answerInput");
  const submitBtn = document.getElementById("submitBtn");
  const scoreText = document.getElementById("scoreText");
  const progressBar = document.getElementById("progressBar");

  const historyBtn = document.getElementById("historyBtn");
  const historyPanel = document.getElementById("historyPanel");
  const historyList = document.getElementById("historyList");
  const gradeBook = document.getElementById("gradeBook");
  const closeHistory = document.getElementById("closeHistory");

  const musicBtn = document.getElementById("musicBtn");
  const bgMusic = document.getElementById("bgMusic");

  const calcIcon = document.getElementById("calculatorIcon");
  const calculator = document.getElementById("calculator");
  const closeCalc = document.getElementById("closeCalc");
  const calcDisplay = document.getElementById("calcDisplay");
  const calcButtons = document.querySelectorAll(".calc-btn");
  const copyCalc = document.getElementById("copyCalc");

  const resultText = document.getElementById("resultText");

  let currentLevel = 1;
  let currentCategory = "";
  let currentQuestion = 0;
  let correctAnswers = 0;
  let currentAnswer = 0;

  const categories = {
    1: ["➕ Sčítání","➖ Odčítání","✖ Násobilka","➗ Dělení","½ Zlomky","📏 Převody jednotek"],
    2: ["🔢 Celá čísla","½ Zlomky","% Procenta","🔤 Výrazy","^ Mocniny/Odmocniny"]
  };

  function showScreen(screen){
    Object.values(screens).forEach(s=>s.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  // Welcome
  startBtn.addEventListener("click", ()=>showScreen(screens.difficulty));
  backToWelcome.addEventListener("click", ()=>showScreen(screens.welcome));

  // Theme toggle
  themeBtn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
  });

  // Difficulty
  backToDiff.addEventListener("click", ()=>showScreen(screens.difficulty));
  difficultyButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      currentLevel=parseInt(btn.dataset.level);
      loadCategories(currentLevel);
      showScreen(screens.category);
    });
  });

  // Category
  backToCat.addEventListener("click", ()=>showScreen(screens.category));
  backToCat2.addEventListener("click", ()=>showScreen(screens.category));
  backToDiff2.addEventListener("click", ()=>showScreen(screens.difficulty));

  function loadCategories(level){
    categoryButtons.innerHTML="";
    categories[level].forEach(cat=>{
      const b=document.createElement("button");
      b.className="btn";
      b.textContent=cat;
      b.addEventListener("click", ()=>{
        currentCategory=cat;
        currentQuestion=0;
        correctAnswers=0;
        scoreText.textContent="Skóre: 0";
        progressBar.style.width="0%";
        showScreen(screens.game);
        generateExample();
      });
      categoryButtons.appendChild(b);
    });
  }

  function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

  function parseFraction(str){
    if(str.includes("/")){
      const [n,d]=str.split("/").map(Number);
      return n/d;
    }
    return parseFloat(str);
  }

  function generateExample(){
    currentQuestion++;
    let a,b,answer,text;
    switch(currentCategory){
      case "➕ Sčítání": a=rand(1,20); b=rand(1,20); answer=a+b; text=`${a}+${b}=?`; break;
      case "➖ Odčítání": a=rand(1,20); b=rand(1,20); answer=a-b; text=`${a}-${b}=?`; break;
      case "✖ Násobilka": a=rand(1,10); b=rand(1,10); answer=a*b; text=`${a}×${b}=?`; break;
      case "➗ Dělení": b=rand(1,10); answer=rand(1,10); a=b*answer; text=`${a}÷${b}=?`; break;
      case "½ Zlomky": a=rand(1,9); b=rand(1,9); answer=a/b; text=`${a}/${b}=?`; break;
      case "📏 Převody jednotek": a=rand(1,100); answer=a*10; text=`${a} cm=? mm`; break;
      case "🔢 Celá čísla": a=rand(-20,20); b=rand(-20,20); answer=a+b; text=`${a}+${b}=?`; break;
      case "% Procenta": a=rand(10,200); b=rand(5,50); answer=Math.round(a*b/100); text=`${b}% z ${a}=?`; break;
      case "🔤 Výrazy": a=rand(1,10); b=rand(1,10); answer=2*a+3*b; text=`2×${a}+3×${b}=?`; break;
      case "^ Mocniny/Odmocniny": if(Math.random()>0.5){ a=rand(2,10); answer=a*a; text=`${a}²=?`; }else{ a=rand(2,12); answer=a; text=`√${a*a}=?`; } break;
    }
    exampleText.textContent=text;
    currentAnswer=answer;
  }

  submitBtn.addEventListener("click", ()=>{
    const user=parseFraction(answerInput.value);
    let correct=false;
    if(Math.abs(user-currentAnswer)<0.001) {correct=true; correctAnswers++;}
    const li=document.createElement("li");
    li.textContent=`${exampleText.textContent} = ${answerInput.value} (správně: ${currentAnswer})`;
    historyList.prepend(li);
    answerInput.value="";
    scoreText.textContent=`Skóre: ${correctAnswers}`;
    progressBar.style.width=`${currentQuestion/10*100}%`;
    if(currentQuestion<10) generateExample();
    else showResult();
  });

  function showResult(){
    let grade,text;
    switch(correctAnswers){
      case 10: grade="1 (výborně)"; break;
      case 9: grade="1- (velmi dobře)"; break;
      case 8: grade="2 (dobře)"; break;
      case 7: grade="2- (uspokojivě)"; break;
      case 6: grade="3 (dostatečně)"; break;
      case 5: grade="4 (nedostatečně)"; break;
      default: grade="5 (velmi špatně)";
    }
    resultText.textContent=`Správně: ${correctAnswers}/10 → Znamka: ${grade}`;
    const li=document.createElement("li");
    li.textContent=`${currentCategory}: ${correctAnswers}/10 → ${grade}`;
    gradeBook.prepend(li);
    showScreen(screens.result);
  }

  // History panel
  historyBtn.addEventListener("click", ()=>historyPanel.classList.add("active"));
  closeHistory.addEventListener("click", ()=>historyPanel.classList.remove("active"));

  // Music
  let isPlaying=false;
  musicBtn.addEventListener("click", ()=>{
    if(!isPlaying){ bgMusic.play(); musicBtn.textContent="⏸ Stop hudba"; isPlaying=true; }
    else{ bgMusic.pause(); musicBtn.textContent="🎵 Hudba"; isPlaying=false; }
  });

  // Calculator
  calcIcon.addEventListener("click", ()=>{
    calculator.classList.add("show");
    calculator.classList.remove("hidden");
  });
  closeCalc.addEventListener("click", ()=>{
    calculator.classList.remove("show");
    setTimeout(()=>calculator.classList.add("hidden"),400);
  });
  copyCalc.addEventListener("click", ()=>{
    navigator.clipboard.writeText(calcDisplay.value);
    alert("Zkopírováno do schránky!");
  });
  calcButtons.forEach(btn=>{
    const val=btn.textContent;
    btn.addEventListener("click", ()=>{
      if(val==="C") calcDisplay.value="";
      else if(val==="="){
        try{ calcDisplay.value=Function(`return (${calcDisplay.value})`)(); }
        catch{ calcDisplay.value="Error"; }
      }else calcDisplay.value+=val;
    });
  });
});
