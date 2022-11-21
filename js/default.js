(() => {
const jsonFile = 'data.json';
let maxBarAmount = 10;
const shortDayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
const bars = document.querySelectorAll('#mon, #tue, #wed, #thu, #fri, #sat, #sun');

// Mouseover overlay divs that hold amounts
let popups = [];

function shortDayToLong(shortDay) {
  switch (shortDay) {
    case 'mon': return 'Monday';
    case 'tue': return 'Tuesday';
    case 'wed': return 'Wednesday';
    case 'thu': return 'Thursday';
    case 'fri': return 'Friday';
    case 'sat': return 'Saturday';
    case 'sun': return 'Sunday';
  }
}

// Process JSON data into chart
function processData(json) {
  // Set the chart bar max size rounded up to the nearest tenth
  for (let i = 0; i < json.length; i++) {
    maxBarAmount = Math.max(maxBarAmount, Math.ceil(json[i].amount / 10) * 10);
  }

  // Adjust each bar height to data
  for (let i = 0; i < json.length; i++) {
    let bar = document.getElementById(json[i].day);
    // Get quotient of maxBarAmount and then convert quotient to percentage for display
    bar.style.height = (((json[i].amount + 1) / maxBarAmount) * 100) + '%';
    //bar.setAttribute('aria-label', shortDayToLong(json[i].day) + ' $' + json[i].amount);

    // Create the bar popup text and append to DOM
    popups[i] = document.createElement('div');
    popups[i].id = json[i].day + '-popup';
    popups[i].classList.add('bar-popup');
    popups[i].innerHTML = '$' + json[i].amount;
    popups[i].setAttribute('aria-hidden', true);
    document.body.appendChild(popups[i]);
  }

  // Apply current day of week style to bar
  document.getElementById(shortDayOfWeek).classList.add('current');
}

// Load the JSON data file
if (window.fetch) {
  // Fetch API
  fetch(jsonFile)
    .then((response) => response.json())
    .then((json) => processData(json));
} else {
  // XMLHttpRequest (Fallback)
  var xmlHttpReq = new XMLHttpRequest();
  xmlHttpReq.overrideMimeType('application/json');
  xmlHttpReq.open('GET', jsonFile, true);
  xmlHttpReq.onreadystatechange = function () {
    if (xmlHttpReq.readyState === 4 && xmlHttpReq.status === 200) {
      processData(JSON.parse(xmlHttpReq.responseText));
    }
  };
  xmlHttpReq.send(null);
}

function showBarAmount(e) {
  let bar = e.target;
  let popup = document.getElementById(bar.id + '-popup');
  popup.style.top = bar.offsetTop - popup.offsetHeight - 10 + 'px';
  popup.style.left = bar.offsetLeft - (popup.offsetWidth/2 - bar.offsetWidth/2) + 'px';
  popup.setAttribute('aria-hidden', false);
  popup.classList.add('bar-popup-show');

  for (let i = 0; i < bars.length; i++) {
    if (bars[i].id !== e.target.id) {
      let popup = document.getElementById(bars[i].id + '-popup');
      popup.setAttribute('aria-hidden', true);
      popup.classList.remove('bar-popup-show');
    }
  }
}

function hideBarAmount(e) {
  let popup = document.getElementById(e.target.id + '-popup');
  popup.setAttribute('aria-hidden', true);
  popup.classList.remove('bar-popup-show');
}

for (let i = 0; i < bars.length; i++) {
  // Show/hide on mouse enter/leave
  bars[i].addEventListener('mouseover', showBarAmount, true);
  bars[i].addEventListener('mouseleave', hideBarAmount, true);
  // Show/hide on tap
  bars[i].addEventListener('click', showBarAmount, true);
}
})();