document.addEventListener("DOMContentLoaded", () => {

  closeHistory.addEventListener("click", () => {
    historyPanel.classList.remove("active");
  });

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

  calcIcon.addEventListener("click", () => {
    calculator.classList.add("show");
    calculator.classList.remove("hidden");
  });

  closeCalc.addEventListener("click", () => {
    calculator.classList.remove("show");

    setTimeout(() => {
      calculator.classList.add("hidden");
    }, 400);
  });

  calcButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.textContent;

      if (val === "C") {
        calcDisplay.value = "";
      } else if (val === "=") {
        try {
          calcDisplay.value = Function(`return (${calcDisplay.value})`)();
        } catch {
          calcDisplay.value = "Error";
        }
      } else {
        calcDisplay.value += val;
      }
    });
  });

  gradebookIcon.addEventListener("click", () => {
    gradebook.classList.add("active");
  });

  closeGradebook.addEventListener("click", () => {
    gradebook.classList.remove("active");
  });

  function showResults() {
    let gradeText = "";

    if (correctAnswers === 10) gradeText = "1 (výborně)";
    else if (correctAnswers >= 8) gradeText = "2 (dobře)";
    else if (correctAnswers >= 6) gradeText = "3 (dostatečně)";
    else if (correctAnswers >= 4) gradeText = "4 (slabé)";
    else gradeText = "5 (nedostatečné)";

    document.getElementById("resultText").innerHTML = `
      🎯 Správně: ${correctAnswers}/10<br>
      📘 Známka: ${gradeText}
    `;

    gradeHistory.push({
      category: currentCategory,
      score: correctAnswers,
      grade: gradeText
    });

    updateGradebook();

    showScreen(resultsScreen);
  }

  function updateGradebook() {
    gradebookList.innerHTML = "";

    gradeHistory.forEach((entry, index) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <b>${index + 1}. ${entry.category}</b><br>
        Skóre: ${entry.score}/10<br>
        Známka: ${entry.grade}
      `;

      gradebookList.appendChild(li);
    });
  }
});
