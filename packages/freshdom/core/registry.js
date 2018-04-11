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
    if (isDefined(componentConstructor)) {
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

const isDefined = componentConstructor => {
  const tagName = componentConstructor.$$__tag
  if (tagName != null && store.get(tagName) != null) {
    return true
  }

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
