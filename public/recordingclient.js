/*
function setmargin() {
  var one = document.getElementsByClassName('navigaterecordingpage2');
  var two = document.getElementById("app");
  style = window.getComputedStyle(one);
  margn = style.getPropertyValue('margin');
  two.style.margin = wdt;
}
*/
//let chosenseconds = 5;
// Countdown timer modified from https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/ (Credit:  Mateusz Rybczonec)

//______________________________________________________
      let micButton = document.getElementsByClassName("micbutton")[0];
      let itemList = document.getElementsByClassName("reqaddseconds")[0]; //select menu
      let chosenseconds = 5;

      //localStorage.setItem("Index", chosenseconds);
      //let chosenseconds = localStorage.getItem("Index");
      micButton.addEventListener("click", function(event) {
        let collection = itemList.selectedOptions;
        for (let i=0; i<collection.length; i++)
        {
          chosenseconds = collection[i].value;
          return chosenseconds;
          console.log("Check 1");
          console.log(chosenseconds);
        }
      },false);
      console.log("Check 2");
      console.log(chosenseconds);
  //_______________________________________________

let fulldasharray = 283;
let warningthreshold = 3;
let alertthreshold = 2;

let COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: warningthreshold
  },
  alert: {
    color: "red",
    threshold: alertthreshold
  }
};

let secondstorecord = chosenseconds;
let timePassed = 0;
let timeLeft = secondstorecord;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer(secondstorecord) {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = secondstorecord - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  let { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  let rawTimeFraction = timeLeft / secondstorecord;
  return rawTimeFraction - (1 / secondstorecord) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  let circleDasharray = `${(
    calculateTimeFraction() * fulldasharray
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


/* Read sessionStorage to trigger recording on first click of button and trigger progress
bar animation on second click */
window.onload = function() {
  var reloading = sessionStorage.getItem("reloading");
  if (reloading) {
      sessionStorage.removeItem("reloading");
      //setmargin()
      move();
      startTimer(secondstorecord);
      document.getElementsByClassName('micbutton')[0].innerText = 'Sample Recording. Once the timer runs out, please press Next.';
  }
}

function reloadP() {
  sessionStorage.setItem("reloading", "true");
  document.location.reload();
}


//Launch recording first, extend recording time beyond 5 seconds to accomodate delay
//Prior idea was to search terminal output which is appended to node.js, however, delay in searching
//live output would result in a mistimed recording as well, so a seperate and disconnected front-end seems
//to be the workable solution

var j = 0;
function move() {
  if (j == 0) {
    j = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 50); //5 seconds in milliseconds Actual recording file is 7 seconds to accomodate delay
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        j = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
  function handleForm(event)
    {
      event.preventDefault();
      /* Add recording success message on form submit */
      //Sleep 8 seconds to ensure recording has completed
      var theDiv = document.getElementById("rechotword1");
      setTimeout(function()
      {
        var content = document.createTextNode("Recording Successful!");
        theDiv.appendChild(content);
      },
      (5500)); //5.5 seconds or 5500 milliseconds
    }
  var form1 = document.getElementById("configuremicrophone");
  form1.addEventListener('submit', handleForm);
}
//Command-line argument for number of seconds (addseconds)
var defaultseconds = "I need 5 seconds to record my voice command";
/*
var addsecondsarg = document.getElementById('addseconds');
for(var i, j = 0; i = mySelect.options[j]; j++)
{
    if(i.value == defaultseconds)
    {
        addsecondsarg.selectedIndex = j;
        break;
    }
}
*/
