var navLinkEl = document.getElementById("navLink");
var timeValueEl = document.getElementById("timeValue");
var spanEl = document.querySelectorAll("span");

var firstPageEl = document.getElementById("firstPage");
var buttonsEl = document.getElementById("buttons");

var currentScorePageEl = document.getElementById("currentScorePage");
var currentScoreEl = document.getElementById("currentScore");
var userInputFormEl = document.getElementById("userInput-form");
var userInputEl = document.getElementById("userInput");
var submitBtn = document.getElementById("submitBtn");

var highscoresPageEl = document.getElementById("highscoresPage");
var scoreListEl = document.getElementById("scoreList");
var goBackBtn = document.getElementById("goBackBtn");
var clearBtn = document.getElementById("clearBtn");

var quizPageEl = document.getElementById("quizPage");
var audio1El = document.getElementById("audio1");
var audio2El = document.getElementById("audio2");
var question = document.getElementById("question");
var choicesGroup = document.getElementById("choicesGroup");
var choiceA = document.getElementById("A");
var choiceB = document.getElementById("B");
var choiceC = document.getElementById("C");
var choiceD = document.getElementById("D");
var correct = document.getElementById("correct");
var checkAns = document.getElementById("checkAns");

var timeInterval;
var timeLeft;

var lastQuestion;
var runningQuestion = 0;

var correctAns;

// Set time to 75 as a default
function setTime() {
    timeLeft = 75;
}

// Remaining time is displayed in navbar
function displayTime() {
    timeValueEl.textContent = timeLeft;
}

// If View Highscores nav link is clicked, go to displayHighscores()
navLinkEl.addEventListener("click", function () {
    clearInterval(timeInterval);
    displayHighscores();
})

// Displays the first page when loaded
function firstPageFunction() {
    navLinkEl.style.display = "block";
    spanEl.forEach(function(element) {
        element.style.display = "block";
    })
    firstPageEl.style.display = "block";
    highscoresPageEl.style.display = "none";
    timeLeft = 0;
    displayTime();
}

// If one of the quiz buttons is clicked, timer starts and questions will be loaded
buttonsEl.addEventListener("click", function (event) {
    event.preventDefault();
    let element = event.target;
    if (element.matches("button") === true) {
        if (element.innerHTML == "JavaScript") {
            questions = questions1;
        }
        if (element.innerHTML == "HTML") {
            questions = questions2;
        }
        if (element.innerHTML == "CSS") {
            questions = questions3;
        }

        // Reset all of the variables before rendering the quiz
        lastQuestion = questions.length - 1;
        runningQuestion = 0;
        correctAns = 0;
        timeValueEl.textContent = 75;

        timer();
        renderQuestion(questions, lastQuestion);
    }
});

function timer() {
    setTime();
    timeInterval = setInterval(function () {
        timeLeft--;

        // If time runs out or no questions left, go to next function (displayScore())
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timeInterval);
            displayScore();
        }
        if (runningQuestion > lastQuestion) {
            clearInterval(timeInterval);
            displayScore();
        }
        displayTime();
    }, 1000);
}

// While time > 0 or questions left, render questions
function renderQuestion(questions, lastQuestion) {
    quizPageEl.style.display = "block";
    firstPageEl.style.display = "none";
    let q = questions[runningQuestion];
    if (runningQuestion <= lastQuestion) {
        question.innerHTML = runningQuestion + 1 + ". " + q.title;
        choiceA.innerHTML = "1. " + q.choices[0];
        choiceB.innerHTML = "2. " + q.choices[1];
        choiceC.innerHTML = "3. " + q.choices[2];
        choiceD.innerHTML = "4. " + q.choices[3];
    }
    correct.innerHTML = "Correct: " + correctAns;
}

// While users get to choose answer, check if the answer is correct
// If the answer is wrong, subtract 15 sec from the remaining time
choicesGroup.addEventListener("click", function (event) {
    event.preventDefault();
    let element = event.target;
    if (element.matches("button") === true) {
        if (element.innerHTML.substring(3) == questions[runningQuestion].answer) {
            audio1El.play();
            correctAns++;
            checkAns.innerHTML = "Correct!".fontcolor("green");
        }
        else {
            audio2El.play();
            checkAns.innerHTML = "Wrong!".fontcolor("red");
            timeLeft -= 15;
        }
        checkAns.style.display = "block";

        // Indicator for right or wrong answer will be faded out
        setTimeout(function () {
            $('#checkAns').fadeOut('fast');
        }, 2000);

        runningQuestion++;
        renderQuestion(questions, lastQuestion);
    }
})

// Displays a page that shows score for this run and takes user initials
function displayScore() {
    currentScorePageEl.style.display = "block";
    quizPageEl.style.display = "none";
    currentScoreEl.innerHTML = "Your score is " + timeLeft;
}

// If enter key or submit button is clicked, push user input & score to array and store the array in local storage
// Finally, go to next function (displayhighscores())
$('#userInput').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        submitBtn.click();
        return false;
    }
});

var scoresArr = [];

submitBtn.addEventListener("click", function () {
    event.preventDefault();
    let storedValues = JSON.parse(localStorage.getItem("scores"));
    let scoreText = userInputEl.value.trim();

    if (scoreText === "") return;

    // Check if there are stored values in local storage
    if (storedValues !== null) {
        scoresArr = storedValues;
    }

    // Push initials and score to the array and sort the array by descending order of scores
    scoresArr.push({ "name": scoreText, "score": timeLeft });
    scoresArr.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));

    userInputEl.value = "";
    localStorage.setItem("scores", JSON.stringify(scoresArr));
    displayHighscores();
})

// Retrieves the items in local storage
function displayHighscores() {
    navLinkEl.style.display = "none";
    spanEl.forEach(function(element) {
        element.style.display = "none";
    })
    highscoresPageEl.style.display = "block";
    firstPageEl.style.display = "none";
    currentScorePageEl.style.display = "none";
    quizPageEl.style.display = "none";
    scoreListEl.innerHTML = "";

    let storedValues = JSON.parse(localStorage.getItem("scores"));

    if (storedValues != null) {
        for (var i = 0; i < storedValues.length; i++) {
            var li = document.createElement("li");
            var value = i + 1 + ".  " + storedValues[i].name + ":  " + storedValues[i].score;
            li.append(document.createTextNode(value));
            scoreListEl.append(li);
        }
    }
}

// If go-back button is clicked, go to the first function
goBackBtn.addEventListener("click", function () {
    event.preventDefault();
    firstPageFunction();
});

// If clear button is clicked, clear all values saved in local storage and array
clearBtn.addEventListener("click", function () {
    event.preventDefault();
    localStorage.clear();
    scoresArr = [];
    displayHighscores();
})
