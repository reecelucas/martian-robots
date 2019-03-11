const withinBounds = require('./helpers/withinBounds');
const { instructions, compassPoints } = require('./constants');

const { FORWARDS, RIGHT, LEFT } = instructions;
const { NORTH, EAST, SOUTH, WEST } = compassPoints;

const positionHasScent = (scents, position) =>
  scents.some(({ x, y }) => x === position.x && position.y === y);

/**
 * Takes a robot's position object and returns the next x & y
 * coordinates based on the current x & y values and orientation.
 *
 * @param {Object} position - robot position object
 * @param {number} position.x
 * @param {number} position.y
 * @param {string} position.orientation - one of 'N', 'E', 'S' or 'W'
 * @returns {Object}
 */
const getNextCoordinates = ({ x, y, orientation }) => {
  switch (orientation) {
    case NORTH:
      return { x, y: y + 1 };
    case EAST:
      return { x: x + 1, y };
    case SOUTH:
      return { x, y: y - 1 };
    case WEST:
      return { x: x - 1, y };
    default:
      return { x, y };
  }
};

/**
 * Called in response to a "FORWARDS" instruction. Calculates a robot's next
 * position based on the current position and previous robot "scents".
 *
 * @param {Object} params
 * @param {Object} params.position - robot position object
 * @param {Object} params.gridArea - gridArea state object
 * @param {Array}  params.scents - robot scent array
 * @returns {Object} new robot position object
 */
const handleMoveInstruction = ({ position, gridArea, scents }) => {
  const nextCoordinates = getNextCoordinates(position);
  const newPosition = { ...position, ...nextCoordinates };

  if (withinBounds(gridArea, newPosition)) {
    return newPosition;
  }

  /**
   * If we've made it here the new position is outside of the grid
   * and the robot is about to be instructed to "fall off".
   */
  if (positionHasScent(scents, position)) {
    /**
     * If the current position has a scent, a previous robot as fallen
     * off the grid from this point, so we ignore the instruction move.
     */
    return position;
  }

  /**
   * If we've made it here the robot's current position does not
   * have a scent, so we instruct it to move off the grid, recording
   * the current position in the scents array before doing so.
   *
   * TODO: refactor this approach to avoid mutating `scents`.
   */
  scents.push({ x: position.x, y: position.y });
  return {
    ...newPosition,
    lost: true
  };
};

/**
 * Called in response to a "LEFT" or "RIGHT" instruction. Calculates a
 * robot's next orientation based on the current orientation and instruction.
 *
 * @param {Object} params
 * @param {string} params.instruction
 * @param {Object} params.position - robot position object
 * @returns {Object} new robot position object
 */
const handleOrientationInstruction = ({ instruction, position }) => {
  const left = instruction === LEFT;
  const right = instruction === RIGHT;
  const nextOrientations = {
    N: left ? WEST : right ? EAST : NORTH,
    E: left ? NORTH : right ? SOUTH : EAST,
    S: left ? EAST : right ? WEST : SOUTH,
    W: left ? SOUTH : right ? NORTH : WEST
  };

  return {
    ...position,
    orientation: nextOrientations[position.orientation]
  };
};

const instructionHandlers = {
  [FORWARDS]: handleMoveInstruction,
  [RIGHT]: handleOrientationInstruction,
  [LEFT]: handleOrientationInstruction
};

/**
 * Takes the application state as an argument and returns a new state
 * object with updated robot positions based on each robot's instructions array.
 *
 * @param {Object} state
 * @returns {Object} new state object
 */
module.exports = state => {
  let scents = [];

  return {
    ...state,
    robots: state.robots.map(robot => {
      // Make a shallow copy of the robot object to avoid mutating the original
      let rb = { ...robot };

      for (const instruction of rb.instructions) {
        // For each instruction in the array calculate the robot's next position
        const getNewPosition = instructionHandlers[instruction];
        rb.position = getNewPosition({
          instruction,
          position: rb.position,
          gridArea: state.gridArea,
          scents
        });
      }

      return rb;
    })
  };
};
