import {make, validateElementName, validateInstance} from './FreshMaker'

/**
 * The global store of Custom Elements defined with Fresh.
 */
if (!window.$$__freshElementStore) {
  window.$$__freshElementStore = new Map()
}

const globalStore = window.$$__freshElementStore

/**
 * Defines a class with the CustomElementRegistry.
 * Also adds a copy to the Fresh global store.
 *
 * @param {String} name The custom element's desired tag name
 * @param {Function} target The custom element constructor function
 * @param {String} extendsElement The tagname of the element to extend
 * @return {Function} The resulting constructor function used to create the element
 */
const define = ({name, target, extendsElement}) => {
  // If the element has previously been defined, return it now.
  // Typically only applies when in dev env with HMR.
  const tagName = validateElementName(name)

  const defined = get(tagName) || window.customElements.get(tagName)
  if (defined) {
    return defined
  }

  // Adds the necessary prototypes and returns the same object
  // but for distinction using a different name
  const FreshMade = make({name: tagName, target, extendsElement})

  window.customElements.define(tagName, FreshMade, {
    extends: extendsElement
  })

  globalStore.set(tagName, FreshMade)

  return FreshMade
}

/**
 * Returns a previously defined element from the global store or CustomElementRegistry.
 *
 * @param {String} name The custom element's tag name
 * @return {Function} The constructor function used to create the element
 */
const get = name => {
  if (globalStore.has(name)) {
    return validateInstance(globalStore.get(name))
  }

  return window.customElements.get(name) || false
}

export default {
  define,
  get
}
