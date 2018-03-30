/**
 * Merge the property descriptors of `src` into `dest`
 *
 * @param {object} dest Object to add descriptors to
 * @param {...object} src Object or Objects to clone descriptors from
 * @returns {object} dest
 * @public
 */

export default (dest, ...src) => {
  if (dest === undefined) {
    throw new TypeError('"dest" is required')
  }

  if (src.length === 0) {
    throw new TypeError('"src" is required')
  }

  return src.reduce((acc, curr) => {
    return Object.defineProperties(
      acc, 
      Object.getOwnPropertyDescriptors(curr))
  }, dest)
}
