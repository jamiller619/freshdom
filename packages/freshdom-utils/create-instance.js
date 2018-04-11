/**
 * Calls a function that may, or may not be, a constructor
 *
 * @param {Function} func The function we're using to create the instance.
 * @param {Object} props The props being passed to the instance.
 * @return {Object}
 */
export default (func, props) => {
  return func.prototype && 'constructor' in func.prototype
    ? new func(props)
    : func(props)
}
