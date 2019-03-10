const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const test = require('tape');
const processInput = require('../src/processInput');

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const filesDir = path.resolve(`${__dirname}/sampleData`);
const getFilePath = file => path.resolve(`${filesDir}/${file}`);
const getOutputFile = inputFile => inputFile.replace('input', 'output');

const inputString =
  '5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL';
const outputString = '1 1 E\n3 3 N LOST\n2 3 S';

test(`processInput accepts a string with whitespace`, assert => {
  const actual = processInput(inputString);
  assert.equal(actual, outputString, 'returns the correct output');
  assert.end();
});

test(`processInput accepts a string without whitespace`, assert => {
  const actual = processInput(inputString.replace(/ /g, ''));
  assert.equal(actual, outputString, 'returns the correct output');
  assert.end();
});

test(`processInput accepts a file`, async assert => {
  try {
    const files = await readDir(filesDir);
    const inputFiles = files.filter(file => file.includes('input'));

    for (const inputFile of inputFiles) {
      const outputFile = getOutputFile(inputFile);
      const [inputString, outputString] = await Promise.all([
        readFile(getFilePath(inputFile), 'utf-8'),
        readFile(getFilePath(outputFile), 'utf-8')
      ]);

      const actual = processInput(inputString);

      assert.equal(
        actual,
        outputString,
        `returns the correct output for input file: ${inputFile}`
      );

      assert.end();
    }
  } catch (error) {
    throw new Error(error);
  }
});

test(`processInput throws an error if input format is incorrect`, assert => {
  const incorrectGridFormat = '536\n11E\nRFRFRFRF';
  const incorrectPositionFormat = '53\n11\nRFRFRFRF';

  assert.throws(() => {
    processInput(incorrectGridFormat);
  }, 'throws if grid coordinate length is incorrect');
  assert.throws(() => {
    processInput(incorrectPositionFormat);
  }, 'throws if robot position length is incorrect');
  assert.end();
});
