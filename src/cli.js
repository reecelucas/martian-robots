const readline = require('readline');
const processInput = require('./processInput');

let lines = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/**
 * The `line` event is fired whenever `readline` reaches
 * the end of a line (\n, \r, or \r\n).
 */
rl.on('line', line => {
  if (!line || line.length === 0) {
    return;
  }

  lines.push(line.trim());
});

// The `close` event fires when `readline` reaches the end of the input stream
rl.on('close', () => {
  const inputString = lines.join('\n');
  console.log(processInput(inputString));
});
