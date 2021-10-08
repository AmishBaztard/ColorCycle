let cycleInterval;
const colorCycleForm = document.querySelector('#colorCycleForm');
const primaryColorInput = document.querySelector('input[name=primaryInput]');
const colorFields = document.querySelector('.colorFields');
const actionButton = document.querySelector('.action__button');
const redInput = document.querySelector('input[name=redInput]');
const blueInput = document.querySelector('input[name=blueInput]');
const greenInput = document.querySelector('input[name=greenInput]');

const baseHexColors = [];

const HEXADECIMAL_COLOR_REGEX = /^#?([a-f0-9]{6})$/i;

const hexToInt = (hex) => parseInt(hex, 16);
const intToHex = (int, pad = 0) => int.toString(16).toUpperCase().padStart(pad, '0');
const updateBodyBackground = (hexColor) => { document.body.style.backgroundColor = hexColor; };

const incrementHex = (hex, increment = 1, max = 255) => {
  let int = hexToInt(hex);
  int += increment;
  int = (int > max) ? 0 : int;
  return intToHex(int, 2);
};

const handleRateChange = (e) => {
  if (cycleInterval) return;
  const target = e.target.closest('.arrow');
  if (!target) return;
  const { operate, color } = target.dataset;
  if (!operate || !color) return;

  const rateEl = colorFields.querySelector(`#${color}Rate`);
  rateEl.textContent = (operate === 'decrease') ? Math.max(0, Number(rateEl.textContent) - 1) : Number(rateEl.textContent) + 1;
};

const increaseRBG = (redRate, blueRate, greenRate) => {
  const redVal = redInput.value;
  const blueVal = blueInput.value;
  const greenVal = greenInput.value;

  const [redBase, blueBase, greenBase] = baseHexColors;

  const newRed = (redVal.toUpperCase() === 'FF') ? redBase : incrementHex(redVal, redRate);
  const newBlue = (blueVal.toUpperCase() === 'FF') ? blueBase : incrementHex(blueVal, blueRate);
  const newGreen = (greenVal.toUpperCase() === 'FF') ? greenBase : incrementHex(greenVal, greenRate);

  redInput.value = newRed;
  blueInput.value = newBlue;
  greenInput.value = newGreen;

  const hexColorCode = `#${newRed}${newBlue}${newGreen}`;
  updateBodyBackground(hexColorCode);
};

const startCycle = () => {
  const redRate = Number(colorFields.querySelector('#redRate').textContent);
  const blueRate = Number(colorFields.querySelector('#blueRate').textContent);
  const greenRate = Number(colorFields.querySelector('#greenRate').textContent);

  return setInterval(() => increaseRBG(redRate, blueRate, greenRate), 250);
};
const stopCycle = () => {
  clearInterval(cycleInterval);
  return undefined;
};

const setPrimaryColor = (color) => {
  const [, hexCode] = color.match(HEXADECIMAL_COLOR_REGEX);
  if (!hexCode) return;

  const [red, blue, green] = hexCode.match(/.{2}/g); // split into 3 groups of 2
  baseHexColors.push(red, blue, green);

  redInput.value = red;
  blueInput.value = blue;
  greenInput.value = green;
};
const togglePrimaryColorInput = () => {
  primaryColorInput.disabled = !primaryColorInput.disabled;
};

const toggleActionButton = () => { // returns true if its currently "Start"
  let result;
  if (actionButton.value === 'Start') {
    actionButton.classList.add('button--red');
    actionButton.value = 'Stop';
    result = true;
  } else {
    actionButton.classList.remove('button--red');
    actionButton.value = 'Start';
  }
  return result;
};
const toggleCycleStatus = () => {
  if (cycleInterval) {
    cycleInterval = stopCycle();
  } else {
    cycleInterval = startCycle();
  }
};

const handleClickedAction = (e) => {
  const { target } = e;
  if (!colorCycleForm.reportValidity()) return;

  if (toggleActionButton(target.value)) {
    const hexCode = primaryColorInput.value;
    setPrimaryColor(hexCode);
    updateBodyBackground(`#${hexCode}`);
  }
  togglePrimaryColorInput();
  toggleCycleStatus();
};

colorFields.addEventListener('click', handleRateChange);
actionButton.addEventListener('click', handleClickedAction);
