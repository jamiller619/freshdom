const freshElementType = Symbol('fresh.element')

const assignType = el => {
  return Object.defineProperty(el, '$$__type', {
    configurable: true,
    value: freshElementType
  })
}

export const isFreshElement = el => el.$$__type === freshElementType

/**
 * Creates a Fresh Element
 *
 * @param {Function} func Constructor function - could be called without `new` if
 * created as a functional, stateless component.
 * @param {Object} props The props being passed to the instance.
 * @return {Object}
 */
export const FreshElement = (func, props) => {
  const el =
    func.prototype && 'constructor' in func.prototype
      ? new func(props)
      : func(props)

  return assignType(el)
}
