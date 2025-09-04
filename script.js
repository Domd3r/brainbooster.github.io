document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const difficultyScreen = document.getElementById("difficultyScreen");
  const categoryScreen = document.getElementById("categoryScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultsScreen = document.getElementById("resultsScreen");

  const startBtn = document.getElementById("startBtn");
  const backToWelcome = document.getElementById("backToWelcome");
  const backToDiff = document.getElementById("backToDiff");
  const backToCat = document.getElementById("backToCat");
  const backToCategoryBtn = document.getElementById("backToCategoryBtn");

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
  const closeHistory = document.getElementById("closeHistory");

  const musicBtn = document.getElementById("musicBtn");
  const bgMusic = document.getElementById("bgMusic");

  const calcIcon = document.getElementById("calculatorIcon");
  const calculator = document.getElementById("calculator");
  const closeCalc = document.getElementById("closeCalc");
  const calcDisplay = document.getElementById("calcDisplay");
  const calcButtons = document.querySelectorAll(".calc-btn");

  const gradebookIcon = document.getElementById("gradebookIcon");
  const gradebook = document.getElementById("gradebook");
  const closeGradebook = document.getElementById("closeGradebook");
  const gradebookList = document.getElementById("gradebookList");

  let currentLevel = 1;
  let currentCategory = "";
  let currentQuestion = 0;
  let correctAnswers = 0;
  let currentAnswer = 0;

  let gradeHistory = [];

  const categories = {
    1: ["➕ Sčítání","➖ Odčítání","✖ Násobilka","➗ Dělení","½ Zlomky","📏 Převody jednotek"],
    2: ["🔢 Celá čísla","½ Zlomky","% Procenta","🔤 Výrazy","^ Mocniny/Odmocniny"]
  };

  function showScreen(screen){
    [welcomeScreen,difficultyScreen,categoryScreen,gameScreen,resultsScreen].forEach(s=>s.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  startBtn.addEventListener("click", ()=>showScreen(difficultyScreen));
  backToWelcome.addEventListener("click", ()=>showScreen(welcomeScreen));
  backToDiff.addEventListener("click", ()=>showScreen(difficultyScreen));
  backToCat.addEventListener("click", ()=>showScreen(categoryScreen));
  backToCategoryBtn.addEventListener("click", ()=>showScreen(categoryScreen));

  difficultyButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      currentLevel = parseInt(btn.dataset.level);
      loadCategories(currentLevel);
      showScreen(categoryScreen);
    });
  });

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
        showScreen(gameScreen);
        generateExample();
      });
      categoryButtons.appendChild(b);
    });
  }

  function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

  function generateExample(){
    currentQuestion++;
    let a,b,answer,text;

    switch(currentCategory){
      case "➕ Sčítání": a=rand(1,20); b=rand(1,20); answer=a+b; text=`${a}+${b}=?`; break;
      case "➖ Odčítání": a=rand(1,20); b=rand(1,20); answer=a-b; text=`${a}-${b}=?`; break;
      case "✖ Násobilka": a=rand(1,10); b=rand(1,10); answer=a*b; text=`${a}×${b}=?`; break;
      case "➗ Dělení": b=rand(1,10); answer=rand(1,10); a=b*answer; text=`${a}÷${b}=?`; break;
      case "½ Zlomky":
        a=rand(1,10); b=rand(1,10);
        if(currentLevel===1){
          answer=[a,b].join("/"); text=`${a}/${b} + ${rand(1,5)}/${rand(1,5)} = ?`; // pro ukázku
        }else{
          // druhý stupeň – sčítání, odčítání, násobení, dělení zlomků
          answer=[a,b].join("/"); text=`${a}/${b} × ${rand(1,5)}/${rand(1,5)} = ?`; 
        }
        break;
      case "📏 Převody jednotek": a=rand(1,100); answer=a*10; text=`${a} cm=? mm`; break;
      case "🔢 Celá čísla": a=rand(-20,20); b=rand(-20,20); answer=a+b; text=`${a}+${b}=?`; break;
      case "% Procenta": a=rand(10,200); b=rand(5,50); answer=Math.round(a*b/100); text=`${b}% z ${a}=?`; break;
      case "🔤 Výrazy": a=rand(1,10); b=rand(1,10); answer=2*a+3*b; text=`2×${a}+3×${b}=?`; break;
      case "^ Mocniny/Odmocniny":
        if(Math.random()>0.5){ a=rand(2,10); answer=a*a; text=`${a}²=?`; }
        else{ a=rand(2,12); answer=a; text=`√${a*a}=?`; } break;
    }
    exampleText.textContent=text;
    currentAnswer=answer;
  }

  submitBtn.addEventListener("click", ()=>{
    const user=answerInput.value.trim();
    if(user==="") return;

    // pro zlomky: porovnáme stringy
    if(user===currentAnswer.toString()) correctAnswers++;

    const li=document.createElement("li");
    li.textContent=`${exampleText.textContent} = ${user} (správně: ${currentAnswer})`;
    historyList.prepend(li);

    answerInput.value="";
    scoreText.textContent=`Skóre: ${correctAnswers}`;
    progressBar.style.width=`${currentQuestion/10*100}%`;

    if(currentQuestion<10) generateExample();
    else showResults();
  });

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
  calcButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const val=btn.textContent;
      if(val==="C") calcDisplay.value="";
      else if(val==="="){
        try{ calcDisplay.value=Function(`return (${calcDisplay.value})`)(); }
        catch{ calcDisplay.value="Error"; }
      }else calcDisplay.value+=val;
    });
  });

  // Gradebook
  gradebookIcon.addEventListener("click", ()=> gradebook.classList.add("active"));
  closeGradebook.addEventListener("click", ()=> gradebook.classList.remove("active"));

  function showResults(){
    let gradeText="";
    if(correctAnswers===10) gradeText="1 (výborně)";
    else if(correctAnswers===9) gradeText="1- (velmi dobře)";
    else if(correctAnswers===8) gradeText="2 (dobře)";
    else if(correctAnswers===7) gradeText="2- (uspokojivě)";
    else if(correctAnswers===6) gradeText="3 (dostatečně)";
    else if(correctAnswers===5) gradeText="4 (nedostatečně)";
    else gradeText="5 (velmi špatně)";

    document.getElementById("resultText").innerHTML = `Správně: ${correctAnswers}/10<br>Známka: ${gradeText}`;

    gradeHistory.push({category:currentCategory, score:correctAnswers, grade:gradeText});
    updateGradebook();

    showScreen(resultsScreen);
  }

  function updateGradebook(){
    gradebookList.innerHTML="";
    gradeHistory.forEach((entry,index)=>{
      const li=document.createElement("li");
      li.textContent=`${index+1}. Kategorie: ${entry.category} | Skóre: ${entry.score}/10 | Známka: ${entry.grade}`;
      gradebookList.appendChild(li);
    });
  }

});
