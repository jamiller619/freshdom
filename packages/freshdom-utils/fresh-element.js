export const freshdomType = Symbol('fresh.element')

export const isFreshElement = el => el.$$__type === freshdomType

/**
 * Creates a Fresh Element
 *
 * @param {Function} func Constructor function - could be called without `new` if
 * created as a functional, stateless component.
 * @param {Object} props The props being passed to the instance.
 * @return {Object}
 */
export const FreshElement = (func, props) =>
  func.prototype && 'constructor' in func.prototype
    ? new func(props)
    : func(props)
