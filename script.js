var navLinkEl = document.getElementById("navLink");
var timeValueEl = document.getElementById("timeValue");

var firstPageEl = document.getElementById("firstPage");
var startBtn = document.getElementById("startBtn");

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
var question = document.getElementById("question");
var choicesGroup = document.getElementById("choicesGroup");
var choiceA = document.getElementById("A");
var choiceB = document.getElementById("B");
var choiceC = document.getElementById("C");
var choiceD = document.getElementById("D");
var checkAns = document.getElementById("checkAns");

var timeInterval;
var timeLeft;

// If View Highscores nav link is clicked, go to displayHighscores()
navLinkEl.addEventListener("click", function () {
    clearInterval(timeInterval);
    displayHighscores();
})

// Displays the first page when loaded
function firstPageFunction() {
    firstPageEl.style.display = "block";
    highscoresPageEl.style.display = "none";
    timeLeft = 75;
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

function displayTime() {
    timeValueEl.textContent = "Time: " + timeLeft;
}

var lastQuestion = questions.length - 1;
var runningQuestion = 0;

// While time > 0 or questions left, render questions
function renderQuestion() {

    quizPageEl.style.display = "block";
    firstPageEl.style.display = "none";
    var q = questions[runningQuestion];

    if (runningQuestion <= lastQuestion) {
        question.innerHTML = runningQuestion+1 + ". " + q.title;
        choiceA.innerHTML = "1. " + q.choices[0];
        choiceB.innerHTML = "2. " + q.choices[1];
        choiceC.innerHTML = "3. " + q.choices[2];
        choiceD.innerHTML = "4. " + q.choices[3];
    }

}

// While users get to choose answer, check if the answer is correct
// If answer is wrong, subtract 15 sec from the remaining time
choicesGroup.addEventListener("click", function (event) {
    event.preventDefault();
    let element = event.target.innerHTML;
    console.log(element);
    checkAns.style.display = "block";
    if (element.substring(3) == questions[runningQuestion].answer) {
        checkAns.innerHTML = "Correct!";
    }
    else {
        checkAns.innerHTML = "Wrong!";
        timeLeft -= 15;
    }
    runningQuestion++;
    setTimeout(function () {
        $('#checkAns').fadeOut('fast');
    }, 800);
    renderQuestion();
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

    scoresArr.push({ "name": scoreText, "score": timeLeft });
    scoresArr.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
    userInputEl.value = "";

    localStorage.setItem("scores", JSON.stringify(scoresArr));
    displayHighscores();
})

// Retrieves the items in local storage
function displayHighscores() {
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

// If clear button is clicked, clear all values saved in local storage
clearBtn.addEventListener("click", function () {
    event.preventDefault();
    localStorage.clear();
    displayHighscores();
})
