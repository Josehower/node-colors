const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const randomColor = require('randomcolor');
const chalk = require('chalk');

const inputSize = process.argv[2];
let inputColor;
if (inputSize) {
  inputColor =
    process.argv[4] || parseInt(inputSize.split('x')[0], 10)
      ? process.argv[3]
      : process.argv[2];
}

const inputLuminocity = process.argv[4] ? process.argv[4] : process.argv[3];

const isInputNotEmpty = !!process.argv[2];
//check for a size input
const squareW =
  isInputNotEmpty && parseInt(inputSize.split('x')[0], 10)
    ? parseInt(inputSize.split('x')[0], 10)
    : 31;
const squareH =
  isInputNotEmpty && parseInt(inputSize.split('x')[1], 10)
    ? parseInt(inputSize.split('x')[1], 10)
    : 9;

let countIndex = 0;
function hexIndex() {
  const myCount = countIndex;
  countIndex++;
  return myCount;
}

function createPattern(color) {
  const flexPattern = [];
  let shouldCreateACentralLine = false;
  const arr = new Array(squareW);
  const isSquareHEven = squareH % 2 === 0; //boolean

  for (let hashLine = 1; hashLine <= squareH; hashLine++) {
    /* if the loop is on the second third of the Heigth of the square
    shouldCreateACentralLine is true */
    shouldCreateACentralLine =
      hashLine > squareH / 3 && hashLine <= (squareH / 3) * 2 ? true : false;

    if (shouldCreateACentralLine) {
      //create lines with empty spaces
      flexPattern.push(
        [...arr]
          .map((i, index) => {
            if (index < 5 || index > squareW - 6) return '#';
            return ' ';
          })
          .join(''),
      );
    } else {
      //create full lines
      flexPattern.push([...arr].map(() => '#').join(''));
    }

    if (hashLine != squareH) flexPattern.push('\n');
  }

  //transform center line to allocate hex code
  flexPattern[Math.round(flexPattern.length / 2) - (isSquareHEven ? 2 : 1)] = [
    ...arr,
  ]
    .map((i, index) => {
      const lineCenter = Math.floor(squareW / 2);
      if (index < 5 || index > squareW - 6) return '#';
      if (index <= lineCenter + 3 && index >= lineCenter - 3)
        return color.charAt(hexIndex());
      return ' ';
    })
    .join('');

  return flexPattern.join('');
}

if (inputColor === 'ask') {
  rl.question('What is your color ? ', function (myColor) {
    rl.question('What is your luminocity ? ', function (myLuminocity) {
      const finalColor = randomColor({
        hue: myColor,
        luminosity: myLuminocity,
      });
      const pattern = createPattern(finalColor);
      console.log(chalk.hex(finalColor).bold(pattern));
      rl.close();
    });
  });
} else {
  const finalColor = inputColor
    ? randomColor({
        hue: inputColor,
        luminosity: inputLuminocity ? inputLuminocity : 'light',
      })
    : randomColor();
  const pattern = createPattern(finalColor);
  console.log(chalk.hex(finalColor).bold(pattern));

  rl.close();
}
