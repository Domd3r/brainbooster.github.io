document.addEventListener("DOMContentLoaded", () => {

    const li = document.createElement("li");
    li.textContent = `${exampleText.textContent} = ${answerInput.value} | správně: ${currentAnswer}`;
    historyList.prepend(li);

    answerInput.value = "";
    scoreText.textContent = `Skóre: ${correctAnswers}`;
    progressBar.style.width = `${(currentQuestion/10)*100}%`;

    if(currentQuestion < 10) generate();
    else finish();
  };

  function finish(){
    let grade = correctAnswers===10?"1":correctAnswers>=8?"2":correctAnswers>=6?"3":correctAnswers>=4?"4":"5";

    resultText.textContent = `Správně: ${correctAnswers}/10 → známka ${grade}`;

    const li = document.createElement("li");
    li.textContent = `${currentCategory}: ${correctAnswers}/10 → ${grade}`;
    gradeBook.prepend(li);

    showScreen(screens.result);
  }

  historyBtn.onclick = () => historyPanel.classList.add("active");
  closeHistory.onclick = () => historyPanel.classList.remove("active");

  musicBtn.onclick = () => {
    if(bgMusic.paused){ bgMusic.play(); }
    else bgMusic.pause();
  };

  calcIcon.onclick = () => calculator.classList.add("show");
  closeCalc.onclick = () => calculator.classList.remove("show");

  copyCalc.onclick = () => navigator.clipboard.writeText(calcDisplay.value);

  calcButtons.forEach(btn => {
    btn.onclick = () => {
      if(btn.textContent === "C") calcDisplay.value = "";
      else if(btn.textContent === "="){
        try{ calcDisplay.value = eval(calcDisplay.value); }catch{ calcDisplay.value="Error"; }
      } else calcDisplay.value += btn.textContent;
    };
  });
});
