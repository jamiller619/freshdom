/**
 * Our global store object as a Map
 */
if (!window.$$__f) {
  Object.defineProperty(window, '$$__f', {
    writable: true,
    value: new Map()
  })
}

const store = window.$$__f

/**
 * Records a contructor function capable of producing Custom Elements in
 * the library's global store and the CustomElementRegistry.
 * Also assigns a unique id to the element for use with CSS and naming the
 * element (if not named during the definition).
 *
 * @param {string} name: The valid name of the element
 * @param {Function} targetConstructor: The element's constructor function
 * @param {string} inherits: The element's tag name used to extend this element
 * @return {Boolean} Returns the modified constructor function
 */
const record = (name, targetConstructor, inherits) => {
  if (targetConstructor.$$__f) {
    // I'm at least 90% sure that I'm 100% sure this can't happen...
    console.warn(`This element has already been recorded: ${targetConstructor.$$__f}`)
    return targetConstructor
  }

  const id = uniqid('f-')
  name = name || id

  Object.defineProperty(targetConstructor, '$$__f', {
    value: { id, name, inherits }
  })

  store.set(name, targetConstructor)
  window.customElements.define(name, targetConstructor)

  return targetConstructor
}

/**
 * Generates a unique id based on the time.
 * Adapted from npm package `uniqid`
 *
 * @param {string} prefix: Optional prefix to prepend to the resulting id
 * @return {string} Returns a unique id
 */
const uniqid = prefix => {
  return (prefix || '') + now().toString(36)
}

// Helper function for uniqid
const now = () => {
  const time = Date.now()
  const last = now.last || time
  return now.last = time > last ? time : last + 1
}

export {
  store as default,
  record
}
