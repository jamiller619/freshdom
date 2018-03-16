
/**
 * Extends one class with another.
 *
 * @param {Function} target The class that should be inheriting things.
 * @param {Function} source The parent class that should be inherited from.
 * @return {Object} The prototype of the parent.
 */
export const extend = (target, source) => {
  target.prototype = Object.create(source.prototype)
  target.prototype.constructor = target
  return source.prototype
}

/**
 * Extends one class with an Object Literal.
 *
 * @param {Function} target The class that should be inheriting things.
 * @param {Function} obj The object that should be inherited from.
 * @return {Object} The prototype of the parent.
 */
export const extendObject = (target, obj) => {
  const extensible = function extensible() {}
  extensible.prototype = Object.create(obj)
  extensible.prototype.constructor = extensible
  return extend(target, extensible)
}
