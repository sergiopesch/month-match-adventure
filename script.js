/********************************************
 * script.js
 * Month Quest: Purple Theme, Ordering Only
 ********************************************/

/* 1. MONTHS DATA & GAME STATE */
const monthsData = [
  { name: "January",   number: 1  },
  { name: "February",  number: 2  },
  { name: "March",     number: 3  },
  { name: "April",     number: 4  },
  { name: "May",       number: 5  },
  { name: "June",      number: 6  },
  { name: "July",      number: 7  },
  { name: "August",    number: 8  },
  { name: "September", number: 9  },
  { name: "October",   number: 10 },
  { name: "November",  number: 11 },
  { name: "December",  number: 12 }
];

// Auto-set to ORDERING mode
let currentMode = "ORDERING";
let currentIndex  = 0;        
let score         = 0;        
const totalQuestions = 5;     
let questions     = [];
let struggledMonths = {};

/* 2. DOM REFERENCES */
const welcomeScreen  = document.getElementById("welcomeScreen");
const gameScreen     = document.getElementById("gameScreen");
const resultsScreen  = document.getElementById("resultsScreen");

const startBtn       = document.getElementById("startBtn");
const gameTitle      = document.getElementById("gameTitle");
const gameInstructions = document.getElementById("gameInstructions");
const choiceContainer  = document.getElementById("choiceContainer");
const feedbackEl       = document.getElementById("feedback");
const nextBtn          = document.getElementById("nextBtn");
const resultsText      = document.getElementById("resultsText");
const playAgainBtn     = document.getElementById("playAgainBtn");

const progressBar      = document.getElementById("progressBar");

/* 3. EVENT LISTENERS */
startBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  startGame();
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < totalQuestions) {
    showQuestion(questions[currentIndex]);
  } else {
    endGame();
  }
});

playAgainBtn.addEventListener("click", () => {
  resetGameState();
  resultsScreen.classList.add("hidden");
  welcomeScreen.classList.remove("hidden");
});

/* 4. GAME LOGIC */
function startGame() {
  resetGameState();
  generateQuestions();
  gameScreen.classList.remove("hidden");
  showQuestion(questions[currentIndex]);
}

function resetGameState() {
  currentIndex = 0;
  score = 0;
  questions = [];
  feedbackEl.textContent = "";
  feedbackEl.style.color = "";
  nextBtn.classList.add("hidden");
  resultsText.textContent = "";
  progressBar.value = 0;
}

function generateQuestions() {
  const oftenMissed = Object.keys(struggledMonths).filter(
    m => struggledMonths[m] > 2
  );

  let focusMonths = [];
  oftenMissed.forEach(mName => {
    const found = monthsData.find(md => md.name === mName);
    if (found) focusMonths.push(found);
  });

  while (focusMonths.length < totalQuestions) {
    let randomMonth = monthsData[Math.floor(Math.random() * monthsData.length)];
    if (!focusMonths.includes(randomMonth)) {
      focusMonths.push(randomMonth);
    }
  }

  focusMonths = shuffleArray(focusMonths);

  focusMonths.forEach(m => {
    // question: e.g. 1, correct: "January"
    questions.push({
      question: m.number,
      correct: m.name
    });
  });
}

function showQuestion(q) {
  nextBtn.classList.add("hidden");
  feedbackEl.textContent = "";
  feedbackEl.style.color = "";
  // Progress bar update
  progressBar.value = currentIndex / totalQuestions;

  gameTitle.textContent = "Month Quest";
  gameInstructions.textContent = `Which month corresponds to number "${q.question}"?`;

  choiceContainer.innerHTML = "";

  let allChoices = [q.correct];
  let wrongNames = monthsData
    .filter(m => m.name !== q.correct)
    .map(m => m.name);
  wrongNames = shuffleArray(wrongNames).slice(0, 3);
  allChoices.push(...wrongNames);
  allChoices = shuffleArray(allChoices);

  allChoices.forEach(choice => {
    const btn = document.createElement("ion-button");
    btn.textContent = choice;
    btn.setAttribute("expand", "block");
    btn.setAttribute("color", "light");
    btn.addEventListener("click", () => handleAnswerClick(choice, q.correct, q.question));
    choiceContainer.appendChild(btn);
  });
}

function handleAnswerClick(chosen, correct, questionVal) {
  const buttons = choiceContainer.querySelectorAll("ion-button");
  buttons.forEach(b => b.disabled = true);

  if (String(chosen) === String(correct)) {
    score++;
    feedbackEl.textContent = "Correct! Great job!";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = `Incorrect. The correct answer is "${correct}"`;
    feedbackEl.style.color = "red";
    struggledMonths[correct] = (struggledMonths[correct] || 0) + 1;
  }
  nextBtn.classList.remove("hidden");
}

function endGame() {
  // Final
  progressBar.value = 1;
  gameScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");
  resultsText.textContent = `You scored ${score} out of ${totalQuestions}!`;
}

/* 5. UTILITY: SHUFFLE ARRAY */
function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
