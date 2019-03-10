/**
 * Replaces multiple occurrences of the newline character
 * in a string with a single newline character.
 *
 * @param {string} string
 * @returns {string}
 */
module.exports = string => string.replace(/[\r\n]{2,}/g, '\n');
