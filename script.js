const primaryColorInput = document.querySelector('input[name=primaryInput]');
const colorFields = document.querySelector('.colorFields');
const baseHexColors = [];
const redInput = document.querySelector('input[name=redInput]');
const blueInput = document.querySelector('input[name=blueInput]');
const greenInput = document.querySelector('input[name=greenInput]');

const HEXADECIMAL_COLOR_REGEX = /^#?([a-f0-9]{6})$/i;

const hexToInt = (hex) => parseInt(hex, 16);
const intToHex = (int, pad = 0) => int.toString(16).toUpperCase().padStart(pad, '0');
const incrementHex = (hex, increment = 1, max = 255) => {
  let int = hexToInt(hex);
  int += increment;
  int = (int > max) ? 0 : int;
  return intToHex(int, 2);
};
const updateBodyBackground = (hexColor) => { document.body.style.backgroundColor = hexColor; };

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

const handlePrimaryColorChange = (e) => {
  const val = e.target.value;
  const [, hexCode] = val.match(HEXADECIMAL_COLOR_REGEX);

  if (!hexCode) return;
  const [red, blue, green] = hexCode.match(/.{2}/g); // split into 3 groups of 2
  baseHexColors.push(red, blue, green);

  redInput.value = red;
  blueInput.value = blue;
  greenInput.value = green;

  const redRate = Number(colorFields.querySelector('#redRate').textContent);
  const blueRate = Number(colorFields.querySelector('#blueRate').textContent);
  const greenRate = Number(colorFields.querySelector('#greenRate').textContent);

  updateBodyBackground(`#${hexCode}`);
  setInterval(() => increaseRBG(redRate, blueRate, greenRate), 100);
};

const handleRateChange = (e) => {
  const target = e.target.closest('.arrow');
  if (!target) return;
  const { operate, color } = target.dataset;
  if (!operate || !color) return;

  const rateEl = colorFields.querySelector(`#${color}Rate`);
  rateEl.textContent = (operate === 'decrease') ? Math.max(0, Number(rateEl.textContent) - 1) : Number(rateEl.textContent) + 1;
};

primaryColorInput.addEventListener('change', handlePrimaryColorChange);
colorFields.addEventListener('click', handleRateChange);
