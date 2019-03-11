/**
 * Returns true if x & y `coordinates` fall within `bounds`.
 *
 * @param {Object} bounds
 * @param {number} bounds.top
 * @param {number} bounds.right
 * @param {number} bounds.bottom
 * @param {number} bounds.left
 *
 * @param {Object} coordinates
 * @param {number} coordinates.x
 * @param {number} coordinates.y
 *
 * @returns {boolean}
 */
module.exports = (bounds, coordinates) =>
  coordinates.x >= bounds.left &&
  coordinates.x <= bounds.right &&
  coordinates.y <= bounds.top &&
  coordinates.y >= bounds.bottom;
