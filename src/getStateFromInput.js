const chunk = require('./helpers/chunk');
const trimAndSplit = require('./helpers/trimAndSplit');
const removeMultipleNewlines = require('./helpers/removeMultipleNewlines');

const getGridArea = string => {
  const str = trimAndSplit(string);

  if (str.length !== 2) {
    throw new Error(`
      Input has incorrect format. Expected 2 characters on first line,
      received ${string.length}.
    `);
  }

  const [x, y] = str.map(coordinate => parseInt(coordinate, 10));
  return {
    top: y,
    right: x,
    bottom: 0,
    left: 0
  };
};

const getRobotPosition = string => {
  const str = trimAndSplit(string);

  if (str.length !== 3) {
    throw new Error(`
      Input has incorrect format. Expected 3 characters for robot position,
      received ${string.length}.
    `);
  }

  const [x, y, orientation] = str;
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    orientation
  };
};

/**
 * Takes an input string with the specified format
 * (see README#the-input). E.g:
 *
 *    5 3\n
 *    1 1 E\n
 *    RFRFRFRF\n
 *    3 2 N\n
 *    FRRFLLFFRRFLL\n
 *    0 3 W\n
 *    LLFFFLFLFL
 *
 * Note: whitespace characters are optional and multiple newline
 * characters can be present at the end of each line.
 *
 * Returns a state object with the following shape:
 *
 *    {
 *      gridArea: {
 *        top: number,
 *        right: number,
 *        bottom: number,
 *        left: number
 *      },
 *      robots: [
 *        {
 *          position: {
 *            x: number,
 *            y: number,
 *            orientation: string // One of 'N', 'E', 'S' or 'W'
 *          },
 *          instructions: string[] // E.g ['F', 'R', 'R', 'F', 'L']
 *        }
 *      ]
 *    }
 *
 * @param {string} inputString
 * @returns {Object}
 */
module.exports = inputString => {
  const [head, ...tail] = removeMultipleNewlines(inputString)
    .trim() // Remove trailing newline character (if present)
    .split('\n');

  const robotPairs = chunk(tail, 2);

  return {
    gridArea: getGridArea(head),
    robots: robotPairs.map(([positionString, instructionsString]) => ({
      position: getRobotPosition(positionString),
      instructions: trimAndSplit(instructionsString)
    }))
  };
};
