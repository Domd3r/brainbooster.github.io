document.addEventListener("DOMContentLoaded", () => {
  // ======== ELEMENTY ========
  const screens = {
    welcome: el("welcomeScreen"),
    difficulty: el("difficultyScreen"),
    category: el("categoryScreen"),
    game: el("gameScreen"),
  };

  const startBtn = el("startBtn");
  const backToDifficulty = el("backToDifficulty");
  const backToCategories = el("backToCategories");

  const categoryTitle = el("categoryTitle");
  const categoryGrid = el("categoryGrid");

  const exampleText = el("exampleText");
  const answerInput = el("answerInput");
  const submitBtn = el("submitBtn");
  const scoreText = el("scoreText");
  const progressBar = el("progressBar");
  const progressLabel = el("progressLabel");
  const taskCategoryLabel = el("taskCategoryLabel");

  const musicBtn = el("musicBtn");
  const historyBtn = el("historyBtn");
  const historyPanel = el("historyPanel");
  const historyList = el("historyList");
  const closeHistory = el("closeHistory");

  const rankBadge = el("rankBadge");

  const bgMusic = el("bgMusic");

  // Žákovská knížka
  const reportCardBtn = el("reportCardBtn");
  const reportCardPanel = el("reportCardPanel");
  const reportList = el("reportList");
  const closeReport = el("closeReport");

  // Kalkulačka
  const calcIcon = el("calculatorIcon");
  const calculator = el("calculator");
  const closeCalc = el("closeCalc");
  const calcDisplay = el("calcDisplay");
  const calcButtons = qsa(".calc-btn");

  // Modal
  const resultModal = el("resultModal");
  const resultSummary = el("resultSummary");
  const resultGrade = el("resultGrade");
  const againBtn = el("againBtn");
  const toCategoriesBtn = el("toCategoriesBtn");

  // ======== STAV HRY ========
  let currentLevel = 1;            // 1 nebo 2
  let currentCategory = null;      // název kategorie (string)
  let currentIcon = "📌";
  let currentIndex = 0;            // 0..9
  let totalCorrect = 0;
  let totalAsked = 0;
  let isPlaying = false;

  // Generátor aktuální otázky
  let currentAnswer = null;        // číslo/string porovnatelné s odpovědí
  let currentQuestionText = "";    // text zobrazený hráči

  // Definice kategorií pro jednotlivé stupně (ikonky)
  const categories = {
    1: [
      { key: "scitani",     label: "➕ Sčítání", icon: "➕" },
      { key: "odcitani",    label: "➖ Odčítání", icon: "➖" },
      { key: "nasobilka",   label: "✖️ Násobilka", icon: "✖️" },
      { key: "deleni",      label: "➗ Dělení", icon: "➗" },
      { key: "zlomky1",     label: "¼ Zlomky (z čísel)", icon: "¼" },
      { key: "prevody",     label: "📏 Převody jednotek", icon: "📏" },
    ],
    2: [
      { key: "cela",        label: "🔢 Celá čísla", icon: "🔢" },
      { key: "zlomky2",     label: "⅕ Zlomky (operace)", icon: "⅕" },
      { key: "procenta",    label: "📈 Procenta", icon: "📈" },
      { key: "vyrazy",      label: "🧩 Výrazy (výpočet)", icon: "🧩" },
      { key: "mocniny",     label: "^ Mocniny/Odmocniny", icon: "^" },
    ],
  };

  // ======== PŘECHODY OBRAZOVEK ========
  startBtn.addEventListener("click", () => showScreen(screens.difficulty));

  qsa(".difficulty").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLevel = parseInt(btn.dataset.level, 10);
      buildCategoryGrid();
      showScreen(screens.category);
    });
  });

  backToDifficulty.addEventListener("click", () => showScreen(screens.difficulty));
  backToCategories.addEventListener("click", () => showScreen(screens.category));

  // ======== KATEGORIE - UI ========
  function buildCategoryGrid() {
    const list = categories[currentLevel];
    categoryTitle.textContent = currentLevel === 1 ? "📗 1. stupeň – vyber kategorii" : "📙 2. stupeň – vyber kategorii";
    categoryGrid.innerHTML = "";
    list.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "card";
      btn.innerHTML = `
        <div class="icon">${cat.icon}</div>
        <div class="title">${cat.label}</div>
        <div class="desc">10 příkladů</div>
      `;
      btn.addEventListener("click", () => startCategory(cat));
      categoryGrid.appendChild(btn);
    });
  }

  function startCategory(cat) {
    currentCategory = cat.key;
    currentIcon = cat.icon;
    currentIndex = 0;
    totalCorrect = 0;
    totalAsked = 0;
    taskCategoryLabel.textContent = `${cat.icon} ${stripIcon(cat.label)}`;
    updateProgress();
    scoreText.textContent = `Skóre: 0 / 0`;
    addHistory(`▶️ Začíná kategorie: ${stripIcon(cat.label)}`);
    showScreen(screens.game);
    generateQuestion();
    answerInput.focus();
  }

  // ======== HRA: GENEROVÁNÍ PŘÍKLADŮ ========
  function generateQuestion() {
    const left = currentIndex; // 0..9
    if (left >= 10) return;

    // vygenerovat otázku a správnou odpověď
    const genMap = {
      "scitani": genAdd,
      "odcitani": genSub,
      "nasobilka": genMul,
      "deleni": genDiv,
      "zlomky1": genFractionOfNumber,
      "prevody": genUnits,

      "cela": genIntegersOps,
      "zlomky2": genFractionsOps,
      "procenta": genPercent,
      "vyrazy": genExpression,
      "mocniny": genPowersRoots
    };

    const fn = genMap[currentCategory];
    const { q, a } = fn();
    currentQuestionText = q;
    currentAnswer = a;
    exampleText.textContent = q;
  }

  // ======== ODESLÁNÍ ODPOVĚDI ========
  submitBtn.addEventListener("click", handleSubmit);
  answerInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSubmit(); });

  function handleSubmit() {
    if (currentIndex >= 10) return;

    const userRaw = answerInput.value.trim().replace(",", ".");
    if (userRaw === "") return;

    // numerické porovnání s tolerancí pro desetinná čísla
    const userVal = parseFloat(userRaw);
    const ansVal = typeof currentAnswer === "number" ? currentAnswer : parseFloat(currentAnswer);

    let correct = false;
    if (Number.isFinite(userVal) && Number.isFinite(ansVal)) {
      correct = Math.abs(userVal - ansVal) < 1e-6;
    } else {
      // fallback na textové porovnání
      correct = userRaw.toLowerCase() === String(currentAnswer).toLowerCase();
    }

    totalAsked++;
    if (correct) {
      totalCorrect++;
      addHistory(`✅ ${currentQuestionText} → ${userRaw}`);
    } else {
      addHistory(`❌ ${currentQuestionText} → ${userRaw} (správně: ${currentAnswer})`);
    }

    scoreText.textContent = `Skóre: ${totalCorrect} / ${totalAsked}`;

    currentIndex++;
    updateProgress();

    answerInput.value = "";
    if (currentIndex < 10) {
      generateQuestion();
      answerInput.focus();
    } else {
      // ukončeno – vyhodnotit, uložit do knížky a ukázat modal
      const pct = Math.round((totalCorrect / 10) * 100);
      const grade = computeGrade(pct);
      saveReport({
        level: currentLevel,
        category: currentCategory,
        icon: currentIcon,
        correct: totalCorrect,
        total: 10,
        percent: pct,
        grade,
        date: new Date().toLocaleString("cs-CZ"),
      });
      updateRankBadge();
      renderReport();
      showResultModal(pct, grade);
    }
  }

  function updateProgress() {
    const done = Math.min(currentIndex, 10);
    const pct = (done / 10) * 100;
    progressBar.style.width = `${pct}%`;
    progressLabel.textContent = `${done} / 10`;
  }

  // ======== HISTORIE ========
  historyBtn.addEventListener("click", () => historyPanel.classList.add("active"));
  closeHistory.addEventListener("click", () => historyPanel.classList.remove("active"));

  function addHistory(entry) {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.prepend(li);
  }

  // ======== HUDBA ========
  musicBtn.addEventListener("click", () => {
    if (!isPlaying) {
      bgMusic.play();
      musicBtn.textContent = "⏸️ Stop hudba";
      isPlaying = true;
    } else {
      bgMusic.pause();
      musicBtn.textContent = "🎵 Hudba";
      isPlaying = false;
    }
  });

  // ======== KALKULAČKA ========
  calcIcon.addEventListener("click", () => {
    calculator.classList.add("show");
    calculator.classList.remove("hidden");
  });
  closeCalc.addEventListener("click", () => {
    calculator.classList.remove("show");
    setTimeout(() => calculator.classList.add("hidden"), 350);
  });
  calcButtons.forEach(b => b.addEventListener("click", () => {
    let t = b.textContent;
    if (t === "C") { calcDisplay.value = ""; return; }
    if (t === "±") {
      if (calcDisplay.value.startsWith("-")) calcDisplay.value = calcDisplay.value.slice(1);
      else calcDisplay.value = "-" + calcDisplay.value;
      return;
    }
    if (t === "=") {
      try { calcDisplay.value = Function(`"use strict"; return (${calcDisplay.value});`)(); }
      catch { calcDisplay.value = "Error"; }
      return;
    }
    calcDisplay.value += t;
  }));

  // ======== MODAL VÝSLEDEK ========
  function showResultModal(pct, grade) {
    resultSummary.textContent = `Správně ${totalCorrect} z 10 (${pct} %)`;
    resultGrade.textContent = grade;
    resultModal.classList.remove("hidden");
  }
  againBtn.addEventListener("click", () => {
    resultModal.classList.add("hidden");
    // znovu tu samou kategorii
    currentIndex = 0; totalCorrect = 0; totalAsked = 0;
    scoreText.textContent = `Skóre: 0 / 0`;
    updateProgress();
    generateQuestion();
    answerInput.focus();
  });
  toCategoriesBtn.addEventListener("click", () => {
    resultModal.classList.add("hidden");
    showScreen(screens.category);
  });

  // ======== ŽÁKOVSKÁ KNÍŽKA ========
  reportCardBtn.addEventListener("click", () => {
    renderReport();
    reportCardPanel.classList.toggle("show");
  });
  closeReport.addEventListener("click", () => reportCardPanel.classList.remove("show"));

  function saveReport(entry) {
    const key = "bb2025_report";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift(entry);
    localStorage.setItem(key, JSON.stringify(arr));
  }
  function renderReport() {
    const key = "bb2025_report";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    reportList.innerHTML = "";
    if (!arr.length) {
      reportList.innerHTML = "<li class='report-item'>📘 Zatím žádné záznamy.</li>";
      return;
    }
    arr.forEach(r => {
      const li = document.createElement("li");
      li.className = "report-item";
      const lvl = r.level === 1 ? "1. stupeň" : "2. stupeň";
      const catName = getCategoryLabel(r.level, r.category);
      li.innerHTML = `
        <div><strong>${r.icon} ${catName}</strong> – ${lvl}</div>
        <div>📊 ${r.correct}/${r.total} • ${r.percent}%</div>
        <div>📝 Známka: <strong>${r.grade}</strong> • 🕒 ${r.date}</div>
      `;
      reportList.appendChild(li);
    });
  }

  // ======== RANK BADGE ========
  function updateRankBadge() {
    // sečíst všechna skóre a určit rank
    const arr = JSON.parse(localStorage.getItem("bb2025_report") || "[]");
    const total = arr.reduce((s,r)=>s+r.correct, 0);
    let rank = "🎓 ZAČÁTEČNÍK";
    if (total >= 20) rank = "⭐ POKROČILÝ";
    if (total >= 50) rank = "🏆 MISTR";
    if (total >= 100) rank = "👑 GÉNIUS";
    rankBadge.textContent = rank;
  }
  updateRankBadge();

  // ======== GENERÁTORY ÚLOH ========
  function genAdd() {
    const a = r(1,50), b=r(1,50);
    return q(`${a} ${sym("+")} ${b} = ?`, a+b);
  }
  function genSub() {
    let a = r(1,50), b=r(1,50); if (b>a) [a,b]=[b,a];
    return q(`${a} ${sym("-")} ${b} = ?`, a-b);
  }
  function genMul() {
    const a = r(2,12), b=r(2,12);
    return q(`${a} ${sym("×")} ${b} = ?`, a*b);
  }
  function genDiv() {
    const b = r(2,12), a = b*r(2,12); // dělitelné beze zbytku
    return q(`${a} ${sym("÷")} ${b} = ?`, a/b);
  }
  // 1. stupeň – zlomky jako „kolik je p/q z N“
  function genFractionOfNumber() {
    const den = r(2,8), num = r(1,den-1);
    const N = den * r(2,15); // aby vyšlo celé číslo
    const val = (num/den)*N;
    return q(`${num}/${den} z ${N} = ?`, val);
  }
  // 1. stupeň – převody jednotek (délka, čas, hmotnost, objem)
  function genUnits() {
    const types = [
      () => { const m=r(1,9)*10; return [`${m} cm = ? mm`, m*10]; },
      () => { const cm=r(2,9)*100; return [`${cm} mm = ? cm`, cm/10]; },
      () => { const m=r(1,20); return [`${m} m = ? cm`, m*100]; },
      () => { const g=r(2,20)*100; return [`${g} g = ? kg`, g/1000]; },
      () => { const h=r(1,4), min=r(0,3)*15; return [`${h} h ${min} min = ? min`, h*60+min]; },
      () => { const l=r(1,9); return [`${l} l = ? ml`, l*1000]; },
      () => { const a=r(2,20); return [`${a} cm × ${a} cm (čtverec) – obvod = ? cm`, 4*a]; },
      () => { const a=r(2,20),b=r(2,20); return [`${a} cm × ${b} cm (obdélník) – obsah = ? cm²`, a*b]; },
    ];
    const pick = types[r(0,types.length-1)]();
    return q(pick[0], pick[1]);
  }

  // 2. stupeň – celá čísla (se zápory)
  function genIntegersOps() {
    const ops = ["+","-","×","÷"];
    const op = ops[r(0,ops.length-1)];
    let a = r(-30,30), b = r(-30,30);
    if (op === "÷") { b = nz(r(-12,12)); const m = r(2,12); a = b*m; }
    const text = `${fmt(a)} ${sym(op)} ${fmt(b)} = ?`;
    const ans = op==="+"?a+b: op==="-"?a-b: op==="×"?a*b: a/b;
    return q(text, ans);
  }
  // 2. stupeň – zlomky (operace) – vybíráme tak, aby vyšel pěkný výsledek (často celé číslo)
  function genFractionsOps() {
    // (a/b) ±/* (c/d)
    let b = r(2,12), d=r(2,12), a=r(1,b-1), c=r(1,d-1);
    const ops = ["+","-","×","÷"]; const op = ops[r(0,3)];
    let num, den;
    if (op==="×") { num=a*c; den=b*d; }
    else if (op==="÷") { num=a*d; den=b*c; }
    else {
      const l = lcm(b,d);
      num = a*(l/b) + (op==="+"?1:-1)*c*(l/d); den = l;
    }
    // výsledek dáme jako desetinné číslo (omezené) – generujeme tak, aby byl pěkný
    const val = num/den;
    const text = `${a}/${b} ${op} ${c}/${d} = ? (dec.)`;
    return q(text, roundNice(val));
  }
  // 2. stupeň – procenta
  function genPercent() {
    const p = [5,10,12.5,20,25,30,40,50][r(0,7)];
    const n = r(20,400);
    const val = (p/100)*n;
    return q(`${p}% z ${n} = ?`, roundNice(val));
  }
  // 2. stupeň – výrazy (dosazení/výpočet)
  function genExpression() {
    // např. 3 + 2*(4 - 1) nebo (a-b)*c
    const a=r(-5,9), b=r(1,9), c=r(1,9);
    const types = [
      () => [`${a} + ${b} × (${c} + ${b}) = ?`, a + b*(c+b)],
      () => [`(${b} + ${c}) × ${b} - ${a} = ?`, (b+c)*b - a],
      () => [`${c}² + ${b}² = ?`, c*c + b*b],
      () => [`(${a} - ${b}) × (${b}) = ?`, (a-b)*b],
    ];
    const pick = types[r(0,types.length-1)]();
    return q(pick[0], pick[1]);
  }
  // 2. stupeň – mocniny / odmocniny
  function genPowersRoots() {
    const t = r(0,1);
    if (t===0) { // mocnina
      const a = r(2,12), p = r(2,3); // malé exponenty
      return q(`${a}^${p} = ?`, Math.pow(a,p));
    } else { // odmocnina
      const a = r(2,15); // √(a^2)
      return q(`√${a*a} = ?`, a);
    }
  }

  // ======== POMOCNÉ FUNKCE ========
  function el(id){ return document.getElementById(id); }
  function qsel(s){ return document.querySelector(s); }
  function qsa(s){ return Array.from(document.querySelectorAll(s)); }
  function r(min,max){ // náhodné celé včetně min/max
    return Math.floor(Math.random()*(max-min+1))+min;
  }
  function nz(x){ let v=x; while(v===0) v=r(-12,12); return v; }
  function sym(s){ return s==="*"?"×":s==="/"?"÷":s; }
  function fmt(n){ return n>=0?`${n}`:`(${n})`; }
  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }
  function lcm(a,b){ return Math.abs(a*b)/gcd(a,b); }
  function roundNice(x){ return Math.round(x*1000)/1000; }
  function stripIcon(lbl){ return lbl.replace(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\W)?\s*/u,""); }

  function q(text, ans){ return { q: text, a: ans }; }

  function showScreen(target){
    Object.values(screens).forEach(s=>s.classList.remove("active"));
    target.classList.add("active");
  }

  function computeGrade(percent){
    if (percent >= 90) return 1;
    if (percent >= 75) return 2;
    if (percent >= 60) return 3;
    if (percent >= 40) return 4;
    return 5;
  }
});
