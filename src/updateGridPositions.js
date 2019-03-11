const withinBounds = require('./helpers/withinBounds');
const { instructions, compassPoints } = require('./constants');

const { FORWARDS, RIGHT, LEFT } = instructions;
const { NORTH, EAST, SOUTH, WEST } = compassPoints;

/**
 * Returns true if a robot's x & y coordinates have a "scent",
 * indicating that a robot has previously fallen off the grid
 * after receiving an instruction from this position.
 *
 * @param {Array} scents - array of coordinate objects, E.g. [{ x: 0, y: 2 }]
 * @param {Object} position - robot position object
 * @param {number} position.x
 * @param {number} position.y
 * @returns {boolean}
 */
const positionHasScent = (scents, position) =>
  scents.some(({ x, y }) => x === position.x && position.y === y);

/**
 * Takes a robot position object and returns the next x & y
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
 * position based on the current position and robot "scents".
 *
 * @param {Object} params
 * @param {Object} params.position - robot position object
 * @param {Object} params.gridArea - gridArea state object
 * @param {Array}  params.scents - robot scent array
 * @returns {Object} new robot position object
 */
const handleMoveInstruction = ({ position, gridArea, scents }) => {
  const nextCoordinates = getNextCoordinates(position);
  const nextPosition = { ...position, ...nextCoordinates };

  if (withinBounds(gridArea, nextPosition)) {
    return nextPosition;
  }

  /**
   * If we've made it here the next position is outside of the grid
   * and the robot is about to be instructed to "fall off".
   */
  if (positionHasScent(scents, position)) {
    /**
     * If the current position has a scent, a previous robot as fallen
     * off the grid from this point, so we ignore the instruction to move.
     */
    return position;
  }

  /**
   * If we've made it here the robot's current position does not
   * have a scent, so we instruct it to "fall off" the grid. We return
   * a scent object containing the previous x & y coordinates so that
   * the calling code can update the "scents" cache for subsequent moves.
   */
  return {
    ...nextPosition,
    scent: { x: position.x, y: position.y },
    lost: true
  };
};

/**
 * Called in response to a "LEFT" or "RIGHT" instruction. Calculates a
 * robot's next orientation based on the instruction and current orientation.
 *
 * @param {Object} params
 * @param {string} params.instruction
 * @param {Object} params.position - robot position object
 * @returns {Object} new robot position object
 */
const handleOrientationInstruction = ({ instruction, position }) => {
  const moveLeft = instruction === LEFT;
  const moveRight = instruction === RIGHT;
  const nextOrientations = {
    N: moveLeft ? WEST : moveRight ? EAST : NORTH,
    E: moveLeft ? NORTH : moveRight ? SOUTH : EAST,
    S: moveLeft ? EAST : moveRight ? WEST : SOUTH,
    W: moveLeft ? SOUTH : moveRight ? NORTH : WEST
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
        // For each instruction in the array calculate the robot's new position
        const handleInstruction = instructionHandlers[instruction];
        const { scent, ...newPosition } = handleInstruction({
          instruction,
          scents,
          position: rb.position,
          gridArea: state.gridArea
        });

        if (scent) {
          /**
           * Update the "scents" cache if the instruction has caused the robot to
           * "fall off" the grid. A scent is an object that contains the robot's
           * previous x & y coordinates.
           */
          scents.push(scent);
        }

        rb.position = newPosition;
      }

      return rb;
    })
  };
};
