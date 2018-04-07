/**
 * Merge the property descriptors of `src` into `dest`
 *
 * @param {object} dest Object to add descriptors to
 * @param {...object} src Object or Objects to clone descriptors from
 * @returns {object} dest
 */
export default (dest, ...src) => {
  if (dest === undefined) {
    throw new TypeError('"dest" is required')
  }

  if (src.length === 0) {
    throw new TypeError('"src" is required')
  }

  return src.reduce((acc, curr) => {
    Object.getOwnPropertyNames(curr).forEach(prop => {
      if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
        Object.defineProperty(acc, prop, Object.getOwnPropertyDescriptor(curr, prop))
      }
    })
    return acc
  }, dest)
}
