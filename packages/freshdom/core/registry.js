import uuid from './uuid'
import config from './config'

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
    if (isDefined(name, componentConstructor)) {
      return componentConstructor
    }

    const {tagName} = getSetInternalProps(name, componentConstructor)

    store.set(tagName, componentConstructor)
    window.customElements.define(tagName, componentConstructor)

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

const isDefined = (name, componentConstructor) => {
  if (componentConstructor.isDefined && store.get(name)) {
    return true
  }

  Object.defineProperty(componentConstructor, 'isDefined', {
    value: true
  })

  return false
}

const getSetInternalProps = (name = '', componentConstructor) => {
  const id = uuid.create()
  const tagName = name.includes('-') ? name : `${config.tagPrefix}-${id}`

  Object.defineProperties(componentConstructor, {
    $$__id: {
      value: id
    },
    $$__tag: {
      value: tagName
    }
  })

  return {id, tagName}
}

export default store
