const getStateFromInput = require('./getStateFromInput');
const updateGridPositions = require('./updateGridPositions');
const getOutputFromState = require('./getOutputFromState');

module.exports = inputString => {
  const initialState = getStateFromInput(inputString);
  const finalState = updateGridPositions(initialState);
  return getOutputFromState(finalState);
};
