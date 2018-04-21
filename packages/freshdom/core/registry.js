import config from '../config'
import uuid from './uuid'

class Registry extends Map {
  /**
   * Records a Custom Element's contructor function with `id` and `name`
   * internal properties
   *
   * @param {string} name: The tag name
   * @param {Function} componentConstructor: The element's constructor function
   * @return {Function} Returns the modified constructor function
   */
  define(name, componentConstructor) {
    if (isDefined(name)) {
      return true
    }

    const {tag} = getSetInternalProps(name, componentConstructor)

    store.set(tag, componentConstructor)
    window.customElements.define(tag, componentConstructor)

    return false
  }
}

/**
 * Creates our registry as a Map object in the global scope
 *
 * @return {Map}
 */
const createGlobalRegistry = () => {
  const registry = new Registry()
  Object.defineProperty(window, '$$__fresh', {
    value: registry
  })
  return registry
}

const store = window.$$__fresh || createGlobalRegistry()

/**
 * Checks for an element definition that exists either in our
 * library's global store or the CustomElementRegistry
 *
 * @param {string} tag: The element's tag name to check
 * @return {bool}
 */
const isDefined = tag => {
  if (
    tag != null &&
    (store.get(tag) != null || window.customElements.get(tag) != null)
  ) {
    return true
  }

  return false
}

/**
 * Creates a valid Custom Element tag name
 *
 * @param {string} prefix
 * @param {string} suffix
 * @return {string}
 */
const createValidTagName = (prefix, suffix) => {
  prefix = prefix.toLowerCase()
  const validPrefix = prefix.charAt(0).match(/[^a-z]+/g)
    ? prefix.slice(1)
    : prefix
  return `${validPrefix}-${suffix}`
}

/**
 * Gets an element's `id` and `tag` properties.
 * If they don't exist, creates and assigns them to the
 * element's constructor as static properties
 *
 * @param {string} name
 * @param {function} componentConstructor
 * @return {object} Returns an object with `tag` and `id` properties
 */
const getSetInternalProps = (name = '', componentConstructor) => {
  const props = {
    id: {
      value: uuid.create()
    }
  }

  if (componentConstructor.tag == undefined) {
    props.tag = {
      value: name.includes('-')
        ? name
        : createValidTagName(componentConstructor.name, id)
    }
  }

  Object.defineProperties(componentConstructor, props)

  return ({id, tag} = componentConstructor)
}

export default store
