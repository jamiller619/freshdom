/**
 * State Initializer
 * Within closure for encapsulation
 *
 * @param {HTMLElement} inst An instance of the HTMLElement
 * @return {HTMLElement} Returns the "modified-in-place" element
 */

export default ComponentPrototype => {
  const localState = {}
  
  ComponentPrototype.setState = state => {
    localState = Object.assign({}, localState, state)
  }

  ComponentPrototype.state = localState

  Object.freeze(ComponentPrototype.state)
  Object.freeze(ComponentPrototype.setState)

  return ComponentPrototype
}
  