/**
 * Taken from https://github.com/30-seconds/30-seconds-of-code.
 * Chunks an array into smaller arrays of a specified size. E.g.
 *
 *    chunk([1, 2, 3, 4, 5], 2); // [[1,2], [3,4], [5]]
 *
 * @param {any[]} arr
 * @param {number} size
 * @returns {Array} multidimensional array
 */
module.exports = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
