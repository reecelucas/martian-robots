/**
 * Takes a "robot" object and returns its position
 * as a string with the specified format (README#the-output).
 *
 * @param {Object}
 * @returns {string}
 */
const getRobotPosition = ({ position }) => {
  const { x, y, orientation, lost } = position;
  return `${x} ${y} ${orientation} ${lost ? 'LOST' : ''}`;
};

/**
 * Takes the state object and returns an "output" string
 * with the specified format (see README#sample-output).
 *
 * @param {Object}
 * @returns {string}
 */
module.exports = ({ robots }) =>
  robots
    .map(getRobotPosition)
    .map(str => str.trim())
    .join('\n');
