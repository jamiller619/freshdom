
class Registry extends Map {
  /**
   * Records a Custom Element's contructor function with meta
   * object in the library's global store and the CustomElementRegistry.
   *
   * @param {string} name: The valid name of the element
   * @param {Function} targetConstructor: The element's constructor function
   * @param {string} inherits: The element's tag name used to extend this element
   * @return {Boolean} Returns the modified constructor function
   */
  define(meta, componentConstructor) {
    if (componentConstructor.$$__meta) {
      // I'm at least 90% sure that I'm 100% sure this can't happen...
      console.warn(`This element has already been defined`)
      console.dir(componentConstructor.$$__meta)
      return componentConstructor
    }

    Object.defineProperty(componentConstructor, '$$__meta', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: meta
    })

    const {name} = meta

    store.set(name, componentConstructor)

    window.customElements.define(name, componentConstructor)

    return componentConstructor
  }
}

const createGlobalRegistry = () => {
  const registry = new Registry()
  Object.defineProperty(window, '$$__fresh', {
    value: registry
  })
  return registry
}

const store = window.$$__fresh || createGlobalRegistry()

export default store
