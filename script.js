// questions
var questions = [
  {
    question: "What is the correct syntax to link a JavaScript file to an HTML file?",
    choices: ["<script href='script.js'>", "<script src='script.js'>", "<script name='script.js'>", "<script file='script.js'>"],
    correctAnswer: 1
  },
  {
    question: "Which of these will display in the console if you haven't defined a variable?",
    choices: ["object", "null", "undefined", "string"],
    correctAnswer: 2
  },
  {
    question: "Which of the following is not a JavaScript data type?",
    choices: ["boolean", "string", "number", "float"],
    correctAnswer: 3
  },
  {
    question: "Which syntax is used to declare a variable?",
    choices: ["var", "let", "const", "all of the above"],
    correctAnswer: 3
  },
  {
    question: "How do you write a comment?",
    choices: ["//comment", "[comment]", "<comment>", "(comment)"],
    correctAnswer: 0
  }
];

// variables
var currentQuestionIndex = 0;
var score = 0;
var timeRemaining = 60;
var timerInterval;

// DOM elements
var startButton = document.getElementById("start-button");
var quizContainer = document.getElementById("quiz-container");
var questionElement = document.getElementById("question");
var choicesContainer = document.getElementById("choices");
var timerEl = document.getElementById("timer");
var resultEl = document.getElementById("result");
var initialsInput = document.getElementById("initials");
var saveButton = document.getElementById("save-button");
var highscoreButton = document.getElementById("highscore-button");
var scoreContainer = document.getElementById("score-container");

// start quiz
function startQuiz() {
  startButton.style.display = "none";
  highscoreButton.style.display = "block";
  timerEl.style.display = "block";
  scoreContainer.style.display = "block";
  quizContainer.style.display = "block";
  timerInterval = setInterval(function() {
    timeRemaining--;
    timerEl.textContent = "Time: " + timeRemaining;
    if (timeRemaining <= 0 || currentQuestionIndex === questions.length) {
      endQuiz();
    }
  }, 1000);
  showQuestion();
}

// display questions
function showQuestion() {
  var question = questions[currentQuestionIndex];
  questionElement.textContent = question.question;
  choicesContainer.innerHTML = "";
  question.choices.forEach(function(choice, index) {
    var choiceButton = document.createElement("button");
    choiceButton.textContent = choice;
    choiceButton.addEventListener("click", function() {
      checkAnswer(index);
    });
    choicesContainer.appendChild(choiceButton);
  });
}

// check answers
function checkAnswer(choiceIndex) {
  var question = questions[currentQuestionIndex];
  if (choiceIndex === question.correctAnswer) {
    score += 10;
    resultEl.textContent = "Correct!";
  } else {
    timeRemaining -= 10;
    resultEl.textContent = "Wrong!";
  }
  resultEl.style.display = "block";
  currentQuestionIndex++;
  setTimeout(function() {
    resultEl.style.display = "none";
    showQuestion();
  }, 1000);
  scoreContainer.textContent = "Score: " + score;
}

function endQuiz() {
  clearInterval(timerInterval);
  quizContainer.style.display = "none";
  var finalScore = score + timeRemaining;
  document.getElementById("final-score").textContent = "Your Score: " + finalScore;
  document.getElementById("game-over").style.display = "block";
  scoreContainer.textContent = "Score: " + finalScore;
  scoreContainer.style.display = "block";
  highscoreButton.style.display = "block";
  var restartButton = document.getElementById("restart-button");
  if (!restartButton) {
    restartButton = document.createElement("button");
    restartButton.id = "restart-button";
    restartButton.textContent = "Take the quiz again?";
    restartButton.addEventListener("click", function() {
      restartQuiz();
    });
    document.getElementById("game-over").appendChild(restartButton);
  }
}

// save score
function saveScore() {
  var initials = initialsInput.value.trim();
  if (initials !== "") {
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    var newScore = {
      initials: initials,
      score: score * timeRemaining
    };
    highScores.push(newScore);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    initialsInput.value = "";
    document.getElementById("game-over").style.display = "none";
    showHighScores();
    displaySavedScore(newScore);
  }
}

// saved score and play again
function displaySavedScore(score) {
  var savedScoreContainer = document.getElementById("saved-score-container");
  savedScoreContainer.innerHTML = "Saved Score: " + score.score;
  savedScoreContainer.style.display = "block";
  var playAgainButton = document.createElement("button");
  playAgainButton.textContent = "Take the quiz again?";
  playAgainButton.addEventListener("click", restartQuiz);
  savedScoreContainer.appendChild(playAgainButton);
}

// restart quiz
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  timeRemaining = 60;
  scoreContainer.style.display = "none";
  highscoreButton.style.display = "none";
  document.getElementById("game-over").style.display = "none";
  document.getElementById("saved-score-container").style.display = "none";
  startQuiz();
}

// high scores
function showHighScores() {
  var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.sort(function (a, b) {
    return b.score - a.score;
  });
  var highscoreList = document.getElementById("highscore-list");
  highscoreList.innerHTML = "";
  var numHighScores = Math.min(highScores.length, 5);
  for (var i = 0; i < numHighScores; i++) {
    var scoreItem = document.createElement("li");
    scoreItem.textContent = highScores[i].initials + " - " + highScores[i].score;
    highscoreList.appendChild(scoreItem);
  }
  document.getElementById("highscore-container").style.display = "block";
}

// event Listeners
startButton.addEventListener("click", startQuiz);
saveButton.addEventListener("click", saveScore);
highscoreButton.addEventListener("click", showHighScores);
