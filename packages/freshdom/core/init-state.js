/**
 * State Initializer
 * Within closure for encapsulation
 *
 * @param {HTMLElement} inst An instance of the HTMLElement
 * @return {HTMLElement} Returns the "modified-in-place" element
 */
export default Component =>
  (Component => {
    let oldState = {}
    return Object.defineProperties(Component, {
      setState: {
        value(newState) {
          oldState = Object.assign({}, oldState, newState)
        }
      },
      state: {
        get() {
          return oldState
        }
      }
    })
  })(Component)
  