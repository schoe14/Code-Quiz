var navLinkEl = document.getElementById("navLink");
var timeValueEl = document.getElementById("timeValue");
var firstPageEl = document.getElementById("firstPage");
var startBtn = document.getElementById("startBtn");

var currentScorePageEl = document.getElementById("currentScorePage");
var currentScoreEl = document.getElementById("currentScore");
var userInputEl = document.getElementById("userInput");
var submitBtn = document.getElementById("submitBtn");

var highscoresPageEl = document.getElementById("highscoresPage");
var scoreListEl = document.getElementById("scoreList");
var goBackBtn = document.getElementById("goBackBtn");
var clearBtn = document.getElementById("clearBtn");

var quizPageEl = document.getElementById("quizPage");

var timeLeft;

// If View Highscores nav link is clicked, go to displayHighscores()
navLinkEl.addEventListener("click", function () {
    event.preventDefault();
    displayHighscores();
})

// Displays intro page when loaded
function firstPageFunction() {
    firstPageEl.style.display = "block";
    highscoresPageEl.style.display = "none";
    timeLeft = 5;
    timeValueEl.innerHTML = "Time: " + timeLeft;
}

// If start button is clicked, timer starts and questions will be loaded
startBtn.addEventListener("click", function (event) {
    event.preventDefault();
    runningQuestion = 0;
    timer();
    renderQuestion();
});

function timer() {
    var timeInterval = setInterval(function () {
        timeLeft--;
        timeValueEl.textContent = "Time: " + timeLeft;

        // While time > 0, displays questions (randomly sorted)
        // If wrong answer, subtract 15 sec from the remaining time

        // If time runs out or no questions left, go to next function (displayScore())
        if (timeLeft === 0 || runningQuestion > lastQuestion) {
            clearInterval(timeInterval);
            quizPageEl.style.display = "none";
            displayScore();
        }
        // console.log(timeLeft);

    }, 1000);
}

var question = document.getElementById("question");
var choicesGroup = document.getElementById("choicesGroup");
var choiceA = document.getElementById("A");
var choiceB = document.getElementById("B");
var choiceC = document.getElementById("C");
var choiceD = document.getElementById("D");
var checkAns = document.getElementById("checkAns");

var lastQuestion = questions.length - 1;
var runningQuestion = 0;
var q = questions[runningQuestion];

function renderQuestion() {
    q = questions[runningQuestion];
    console.log(q);
    quizPageEl.style.display = "block";
    firstPageEl.style.display = "none";
    // questions.forEach((element) => {
    if (runningQuestion > lastQuestion) {
        return timeLeft;
    }
    question.innerHTML = q.title;
    choiceA.innerHTML = q.choices[0];
    choiceB.innerHTML = q.choices[1];
    choiceC.innerHTML = q.choices[2];
    choiceD.innerHTML = q.choices[3];

    // })
}

function checkAnswer(userPick) {
    event.preventDefault();
    checkAns.style.display = "block";
    if (userPick == questions[runningQuestion].answer) checkAns.innerHTML = "Correct!";
    else { checkAns.innerHTML = "Wrong!"; }
    runningQuestion++;
    setTimeout(function () {
        $('#checkAns').fadeOut('fast');
    }, 400);
    renderQuestion();
}

// Displays a page that shows score for this run and takes user initials
function displayScore() {
    currentScorePageEl.style.display = "block";
    currentScoreEl.innerHTML = "Your score is " + timeLeft;
}

// If submit button is clicked, stores user input & score to local storage and go to next function (displayhighscores())
submitBtn.addEventListener("click", function () {
    event.preventDefault();
    localStorage.setItem(userInputEl.value, timeLeft);
    displayHighscores();
})

// Adds the user input & score to local storage and displays the stored items
function displayHighscores() {
    highscoresPageEl.style.display = "block";
    firstPageEl.style.display = "none";
    currentScorePageEl.style.display = "none";
    scoreListEl.innerHTML = "";

    for (var i = 0; i < localStorage.length; i++) {
        var li = document.createElement("li");
        var value = localStorage.key(i) + " - " + localStorage.getItem(localStorage.key(i));
        li.append(document.createTextNode(value));
        scoreListEl.append(li);
        console.log(localStorage.key(i));
    }
}

// If go-back button is clicked, go to the first function
goBackBtn.addEventListener("click", function () {
    event.preventDefault();
    firstPageFunction();
});

// If clear button is clicked, clear all values saved in local storage
clearBtn.addEventListener("click", function () {
    event.preventDefault();
    localStorage.clear();
    displayHighscores();
})
