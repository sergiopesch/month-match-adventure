/***********************************************
 *  MONTH MATCH ADVENTURE
 *  By: [Your Name or Company]
 *  Description:
 *    A fun, interactive game to teach children
 *    the months of the year by matching month
 *    names and numbers.
 ***********************************************/

// Data for the months
const monthsData = [
  { name: "January", number: 1 },
  { name: "February", number: 2 },
  { name: "March", number: 3 },
  { name: "April", number: 4 },
  { name: "May", number: 5 },
  { name: "June", number: 6 },
  { name: "July", number: 7 },
  { name: "August", number: 8 },
  { name: "September", number: 9 },
  { name: "October", number: 10 },
  { name: "November", number: 11 },
  { name: "December", number: 12 }
];

// DOM elements
const mainMenu = document.getElementById("mainMenu");
const modeSelection = document.getElementById("modeSelection");
const levelSelection = document.getElementById("levelSelection");
const gameScreen = document.getElementById("gameScreen");
const resultsScreen = document.getElementById("resultsScreen");

const startBtn = document.getElementById("startBtn");
const modeABtn = document.getElementById("modeABtn");
const modeBBtn = document.getElementById("modeBBtn");
const levelButtons = document.querySelectorAll(".level-btn");

const questionText = document.getElementById("questionText");
const choicesContainer = document.getElementById("choicesContainer");
const feedbackText = document.getElementById("feedbackText");
const scoreDisplay = document.getElementById("scoreDisplay");
const nextBtn = document.getElementById("nextBtn");
const resultsText = document.getElementById("resultsText");
const playAgainBtn = document.getElementById("playAgainBtn");

// Game state variables
let currentMode = null;    // 'A' => Month Name -> Number, 'B' => Number -> Month Name
let currentLevel = 1;      // 1, 2, or 3
let chosenMonths = [];     // subset of months for the selected level
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 5;    // number of questions per round
let questions = [];        // array holding each question's data

/**************************************
 *        SCREEN NAVIGATION
 **************************************/
function showScreen(screenElement) {
  // Hide all screens
  mainMenu.classList.add("hidden");
  modeSelection.classList.add("hidden");
  levelSelection.classList.add("hidden");
  gameScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");

  // Show the specified screen
  screenElement.classList.remove("hidden");
}

/**************************************
 *         EVENT LISTENERS
 **************************************/
startBtn.addEventListener("click", () => {
  showScreen(modeSelection);
});

modeABtn.addEventListener("click", () => {
  currentMode = 'A';
  showScreen(levelSelection);
});

modeBBtn.addEventListener("click", () => {
  currentMode = 'B';
  showScreen(levelSelection);
});

levelButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentLevel = parseInt(button.getAttribute("data-level"));
    startLevel(currentLevel);
  });
});

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    endGame();
  }
});

playAgainBtn.addEventListener("click", () => {
  showScreen(modeSelection);
});

/**************************************
 *        GAME INITIALIZATION
 **************************************/

/**
 * startLevel
 *  Sets up the game for the selected mode and level.
 */
function startLevel(level) {
  // Determine how many months to pick
  let monthsCount = 3; // for Level 1
  if (level === 2) monthsCount = 6;
  if (level === 3) monthsCount = 12;

  // Shuffle monthsData, pick the first N months
  chosenMonths = shuffleArray(monthsData).slice(0, monthsCount);

  // Reset state
  currentQuestionIndex = 0;
  score = 0;
  feedbackText.textContent = "";
  scoreDisplay.textContent = `Score: ${score}`;

  // Generate questions
  questions = generateQuestions(chosenMonths, totalQuestions, currentMode);

  // Display first question
  showScreen(gameScreen);
  showQuestion(questions[currentQuestionIndex]);
}

/**************************************
 *        QUESTION GENERATION
 **************************************/

/**
 * generateQuestions
 *  Creates an array of question objects.
 */
function generateQuestions(monthsArr, num, mode) {
  const qs = [];
  for (let i = 0; i < num; i++) {
    // Pick a random month from the chosen subset
    const randomIndex = Math.floor(Math.random() * monthsArr.length);
    const monthObj = monthsArr[randomIndex];

    if (mode === 'A') {
      // Month Name -> Number
      const correctNumber = monthObj.number;
      let wrongOptions = monthsData.filter(m => m.number !== correctNumber).map(m => m.number);
      wrongOptions = shuffleArray(wrongOptions).slice(0, 3);
      qs.push({
        question: monthObj.name,
        correct: correctNumber,
        choices: shuffleArray([correctNumber, ...wrongOptions]),
        mode: 'A'
      });
    } else {
      // Number -> Month Name
      const correctName = monthObj.name;
      let wrongOptions = monthsData.filter(m => m.name !== correctName).map(m => m.name);
      wrongOptions = shuffleArray(wrongOptions).slice(0, 3);
      qs.push({
        question: monthObj.number,
        correct: correctName,
        choices: shuffleArray([correctName, ...wrongOptions]),
        mode: 'B'
      });
    }
  }
  return qs;
}

/**
 * showQuestion
 *  Renders the current question to the DOM.
 */
function showQuestion(q) {
  // Reset feedback and hide next button
  feedbackText.textContent = "";
  feedbackText.style.color = "";
  nextBtn.classList.add("hidden");

  // Update question text
  if (q.mode === 'A') {
    questionText.textContent = `Which number represents ${q.question}?`;
  } else {
    questionText.textContent = `Which month corresponds to the number ${q.question}?`;
  }

  // Clear old choices
  choicesContainer.innerHTML = "";

  // Create choice buttons
  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => handleAnswerClick(choice, q.correct));
    choicesContainer.appendChild(btn);
  });
}

/**************************************
 *       ANSWER HANDLING
 **************************************/

/**
 * handleAnswerClick
 *  Checks if the chosen answer is correct, provides feedback, and updates score.
 */
function handleAnswerClick(chosen, correct) {
  if (String(chosen) === String(correct)) {
    // Correct
    feedbackText.textContent = "Correct! Good job!";
    feedbackText.style.color = "green";
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    // Show next button
    nextBtn.classList.remove("hidden");
    // Optional: play correct sound, e.g. new Audio('audio/correct.mp3').play();
  } else {
    // Incorrect
    feedbackText.textContent = "Try Again!";
    feedbackText.style.color = "red";
    // Optional: play a wrong sound
    // new Audio('audio/wrong.mp3').play();
    return;
  }
}

/**
 * endGame
 *  Shows the results screen with final score.
 */
function endGame() {
  showScreen(resultsScreen);
  resultsText.textContent = `You scored ${score} out of ${totalQuestions}!`;
}

/**************************************
 *       HELPER FUNCTIONS
 **************************************/

/**
 * shuffleArray
 *  Shuffles array elements in place (Fisher-Yates).
 */
function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
