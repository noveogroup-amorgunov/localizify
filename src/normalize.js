const isPlainObject = val => val !== null && Object.prototype.toString.call(val) === '[object Object]';
const isString = val => typeof val === 'string';

/**
 * Normalize not flatten object to one-level object
 * @param {*} object
 * @param {array} acc
 * @param {object} results
 */
const normalize = (object, acc = [], results = {}) => {
  if (isString(object)) {
    results[acc.join('.')] = object; // eslint-disable-line
  } else if (isPlainObject(object)) {
    Object.keys(object).forEach(key => normalize(object[key], [...acc, key], results));
  }
  return results;
};

module.exports = normalize;
