// Arithmetic functions using parseFloat to ensure numbers are handled correctly
function add(a, b) {
  return parseFloat(a) + parseFloat(b);
}
function subtract(a, b) {
  return parseFloat(a) - parseFloat(b);
}
function multiply(a, b) {
  return parseFloat(a) * parseFloat(b);
}
function divide(a, b) {
  if (b === "0") return NaN;
  return parseFloat(a) / parseFloat(b);
}
function operate(operator, num1, num2) {
  if (num1 === "Infinity") num1 = Infinity;
  if (num1 === "-Infinity") num1 = -Infinity;
  switch (operator) {
    case "+": return add(num1, num2);
    case "-": return subtract(num1, num2);
    case "*": return multiply(num1, num2);
    case "/": return divide(num1, num2);
  }
}

function calculateAndDisplay() {
  let result = operate(operator, storedValue, display.textContent);
  displayResult(result);
  storedValue = result;
}

function displayResult(result) {
  if (isNaN(result) || result === Infinity || result === -Infinity) {
    display.textContent = result;
  } else if (getNumberOfIntegerDigits(result) >= 12) {
    let tmpArr = result.toExponential().toString().split("e");
    display.textContent = tmpArr[0].slice(0, 8) + "e" + tmpArr[1];
  } else if (getNumberOfDecimalDigits(result) >= 12) {
    let tmpArr = result.toExponential().toString().split("e");
    display.textContent = tmpArr[0].slice(0, 8) + "e" + tmpArr[1];
  } else {
    display.textContent = result.toString().slice(0, 12);
  }
}

function getNumberOfIntegerDigits(num) {
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(Math.trunc(num)))) + 1;
}

function getNumberOfDecimalDigits(num) {
  if (Number.isInteger(num)) return 0;
  num = num.toString();
  if (num.includes("e")) return num.split("-")[1];
  else return num.split(".")[1].length;
}

function buttonPress(val) {
  if (display.textContent === "0" || selectingOperator === true || display.textContent === "Infinity" || display.textContent === "-Infinity") {
    selectingOperator = false;
    display.textContent = "";
  }
  if ((display.textContent.charAt(0) === "-" && display.textContent.length <= 12) ||
    (display.textContent.charAt(0) !== "-" && display.textContent.length <= 11)) {
    display.textContent += val;
  }
}

// Adding event listeners to buttons
for (let i = 0; i <= 9; i++) {
  const button = document.querySelector(`#n${i}`);
  button.addEventListener("click", () => {
    buttonPress(i);
    button.blur(); // Remove focus from the button after it is clicked
  });
}

// Adding event listener for keydown event
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= '0' && key <= '9') {
    buttonPress(key);
  } else {
    handleOperatorKeys(key, e);
  }
});

// Function to handle operator and special keys
function handleOperatorKeys(key, event) {
  switch (key) {
    case 'c':
      clearDisplay();
      break;
    case 'Backspace':
      deleteLastDigit();
      break;
    case '%':
      handlePercentage();
      break;
    case '/':
      event.preventDefault(); // Prevent quick find in Firefox
      handleOperator(key);
      break;
    case '*':
    case '-':
    case '+':
      handleOperator(key);
      break;
    case '=':
    case 'Enter':
      handleEquals();
      break;
    case '.':
      addDecimal();
      break;
    case 'n':
      toggleNegate();
      break;
    default:
      break;
  }
}

function clearDisplay() {
  storedValue = NaN;
  operator = null;
  selectingOperator = false;
  display.textContent = "0";
}

function deleteLastDigit() {
  if (display.textContent === "NaN" || display.textContent === "Infinity" || display.textContent === "-Infinity") {
    clearDisplay();
  } else {
    display.textContent = display.textContent.slice(0, -1);
    if (display.textContent === "" || display.textContent === "-") {
      display.textContent = "0";
    }
  }
  selectingOperator = false;
}

function toggleNegate() {
  if (display.textContent !== "NaN") {
    if (display.textContent.charAt(0) === "-") {
      display.textContent = display.textContent.slice(1);
    } else {
      if (display.textContent !== "0") {
        display.textContent = "-" + display.textContent;
      }
    }
    selectingOperator = false;
  }
}

function addDecimal() {
  if (display.textContent !== "NaN" && display.textContent !== "Infinity" && display.textContent !== "-Infinity") {
    if (!display.textContent.includes(".")) {
      if ((display.textContent.charAt(0) === "-" && display.textContent.length <= 12) ||
        display.textContent.length <= 11) {
        display.textContent += ".";
      }
    }
    selectingOperator = false;
  }
}

function handleOperator(op) {
  if (!selectingOperator) {
    if (isNaN(storedValue)) {
      storedValue = display.textContent;
    } else {
      calculateAndDisplay();
    }
  }
  operator = op;
  selectingOperator = true;
}

function handlePercentage() {
  let result;
  if (operator) {
    switch (operator) {
      case '+':
      case '-':
        result = storedValue * display.textContent / 100;
        break;
      case '*':
      case '/':
        result = display.textContent / 100;
        break;
    }
  } else {
    result = 0;  // When no operator is selected
  }
  displayResult(result);
}

function handleEquals() {
  if (operator) {
    calculateAndDisplay();
  }
  selectingOperator = true;
}

// Attach event listeners to other buttons
document.querySelector("#clear").addEventListener("click", () => {
  clearDisplay();
  document.querySelector("#clear").blur(); // Remove focus from the button after it is clicked
});
document.querySelector("#del").addEventListener("click", () => {
  deleteLastDigit();
  document.querySelector("#del").blur(); // Remove focus from the button after it is clicked
});
document.querySelector("#negate").addEventListener("click", () => {
  toggleNegate();
  document.querySelector("#negate").blur(); // Remove focus from the button after it is clicked
});
document.querySelector("#dot").addEventListener("click", () => {
  addDecimal();
  document.querySelector("#dot").blur(); // Remove focus from the button after it is clicked
});
document.querySelectorAll(".op").forEach((button) => {
  button.addEventListener("click", (e) => {
    handleOperator(e.target.textContent);
    button.blur(); // Remove focus from the button after it is clicked
  });
});
document.querySelector("#per").addEventListener("click", () => {
  handlePercentage();
  document.querySelector("#per").blur(); // Remove focus from the button after it is clicked
});
document.querySelector("#equals").addEventListener("click", () => {
  handleEquals();
  document.querySelector("#equals").blur(); // Remove focus from the button after it is clicked
});

const display = document.querySelector(".display");
let storedValue = NaN, operator = null, selectingOperator = false;
