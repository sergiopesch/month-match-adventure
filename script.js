/***************************************************
 * Month Quest: 30-Second Challenge (Framework7)
 * No references to progressBar or .value
 ***************************************************/

console.log("Script loaded. Setting up initial state...");

// 1. MONTHS DATA
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

// 2. GAME STATE
let currentIndex     = 0;
let score            = 0;
const totalQuestions = 10;
let questions        = [];
let struggledMonths  = {};

// 30-second total
let gameTimeRemaining = 30;
let gameTimerInterval = null;

// 3. DOM REFERENCES
const welcomeScreen    = document.getElementById("welcomeScreen");
const gameScreen       = document.getElementById("gameScreen");
const resultsScreen    = document.getElementById("resultsScreen");

const startBtn         = document.getElementById("startBtn");
const nextBtn          = document.getElementById("nextBtn");
const playAgainBtn     = document.getElementById("playAgainBtn");

const gameInstructions = document.getElementById("gameInstructions");
const choiceContainer  = document.getElementById("choiceContainer");
const feedbackEl       = document.getElementById("feedback");
const resultsText      = document.getElementById("resultsText");

const timerDisplay     = document.getElementById("timerDisplay");

// Quick checks
if (!welcomeScreen || !gameScreen || !resultsScreen) {
  console.error("One of the screen elements is missing. Check IDs in index.html.");
}
if (!startBtn || !nextBtn || !playAgainBtn) {
  console.error("One of the main buttons is missing. Check IDs in index.html.");
}

// 4. EVENT LISTENERS
startBtn.addEventListener("click", () => {
  console.log("Start button clicked.");
  welcomeScreen.classList.add("hidden");
  startGame();
});

nextBtn.addEventListener("click", () => {
  console.log("Next button clicked, currentIndex =", currentIndex);
  currentIndex++;
  if (currentIndex < questions.length && gameTimeRemaining > 0) {
    showQuestion(questions[currentIndex]);
  } else {
    console.log("No more questions or time ended. endGame()");
    endGame();
  }
});

playAgainBtn.addEventListener("click", () => {
  console.log("Play Again button clicked.");
  resetGameState();
  resultsScreen.classList.add("hidden");
  welcomeScreen.classList.remove("hidden");
});

// 5. GAME FLOW
function startGame() {
  console.log("startGame() invoked. Resetting and generating questions.");
  resetGameState();
  generateQuestions();

  // Show game screen
  gameScreen.classList.remove("hidden");

  // Show first question
  if (questions.length) {
    showQuestion(questions[currentIndex]);
  } else {
    console.error("No questions generated; check generateQuestions().");
    return;
  }

  // Start 30s timer
  startGameTimer();
}

function resetGameState() {
  console.log("resetGameState() invoked.");
  currentIndex       = 0;
  score             = 0;
  questions         = [];
  gameTimeRemaining = 30;

  // Clear old timer
  clearInterval(gameTimerInterval);

  // Hide other screens
  gameScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");

  // Reset text/UI
  feedbackEl.textContent   = "";
  feedbackEl.style.color   = "";
  nextBtn.classList.add("hidden");
  resultsText.textContent  = "";
  timerDisplay.textContent = "";
}

function generateQuestions() {
  console.log("generateQuestions() invoked.");
  const shuffled = shuffleArray(monthsData);
  const selected = shuffled.slice(0, totalQuestions);

  questions = selected.map(m => ({
    question: m.number,
    correct: m.name
  }));
  console.log("Questions generated:", questions);
}

function showQuestion(q) {
  console.log("showQuestion() =>", q);
  feedbackEl.textContent = "";
  feedbackEl.style.color = "";
  nextBtn.classList.add("hidden");

  gameInstructions.textContent = `Which month is number "${q.question}"?`;

  // Build choices
  choiceContainer.innerHTML = "";
  let allChoices = [q.correct];

  let wrongNames = monthsData
    .filter(m => m.name !== q.correct)
    .map(m => m.name);
  wrongNames = shuffleArray(wrongNames).slice(0, 3);
  allChoices.push(...wrongNames);
  allChoices = shuffleArray(allChoices);

  allChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.classList.add("col", "button", "button-outline", "button-round");
    btn.textContent = choice;

    btn.addEventListener("click", () => handleAnswerClick(choice, q.correct));
    choiceContainer.appendChild(btn);
  });
}

function handleAnswerClick(chosen, correct) {
  console.log("handleAnswerClick()", { chosen, correct });
  const buttons = choiceContainer.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if (chosen === correct) {
    score++;
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    animateFeedback(feedbackEl, true);
  } else {
    feedbackEl.textContent = `Incorrect. The correct answer is "${correct}"`;
    feedbackEl.style.color = "red";
    animateFeedback(feedbackEl, false);

    // Track for possible LLM usage if needed
    struggledMonths[correct] = (struggledMonths[correct] || 0) + 1;
  }
  nextBtn.classList.remove("hidden");
}

function endGame() {
  console.log("endGame() invoked. Final score =", score);
  clearInterval(gameTimerInterval);
  gameScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");
  resultsText.textContent = `You scored ${score} out of ${questions.length}!`;
}

// 6. TIMER
function startGameTimer() {
  console.log("startGameTimer() => 30 seconds");
  timerDisplay.textContent = formatTime(gameTimeRemaining);

  gameTimerInterval = setInterval(() => {
    gameTimeRemaining--;
    timerDisplay.textContent = formatTime(gameTimeRemaining);

    if (gameTimeRemaining <= 0) {
      console.log("Time's up, calling endGame()");
      clearInterval(gameTimerInterval);
      endGame();
    }
  }, 1000);
}

function formatTime(seconds) {
  return `${seconds}s`;
}

// 7. ANIMATIONS
function animateFeedback(element, isCorrect) {
  element.classList.remove("correct-anim", "incorrect-anim");
  // Reflow trick to restart animation
  void element.offsetWidth;
  element.classList.add(isCorrect ? "correct-anim" : "incorrect-anim");
}

// 8. UTILITY
function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
