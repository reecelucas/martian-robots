/**
 * Removes whitespace characters from a string
 * and returns an array of substrings specified by
 * the `split` parameter.
 *
 * @param {string} str
 * @param {string} split
 * @returns {string[]}
 */
module.exports = (str, split = '') =>
  str
    .replace(/\s/g, '')
    .trim()
    .split(split);
