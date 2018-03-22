import HTMLInterfaces from '../types/HTMLInterfaces'
import Base from './base'
import {trigger, eventTypes} from './events'
import registry, {record} from './registry'
import merge from '../helpers/merge'

/**
 * Entry point for creating Custom Element Components.
 *
 * Here, we simply parse the range of acceptable arguments,
 * and redirect as necessary.
 */
export default (...args) => {
  let component = {},
    name = undefined,
    extendsType = undefined

  if (!args[1]) {
    // Unnamed Component
    component = args[0]
  } else {
    // Named Component
    const parsedDefinition = parseComponentDefinition(args[0])
    name = parsedDefinition.name
    extendsType = parsedDefinition.extendsType
    component = args[1]
  }

  return make({
    name, 
    extendsType,
    component: parseComponentCallback(component)
  })
}

/**
 * Creates a constructor function capable of producing Custom Elements.
 *
 * @param {string|Object} definition: The element's name, or name and extendsType
 * @param {Function} component: The component as an object literal
 * @return {Function} The constructor function to create future instances
 */
const make = ({component, name, extendsType}) => {
  /**
   * TODO: This is currently an issue with at least Parcel's HMR because any
   * DOM insertion points on the client associated with the element that was
   * previously defined, will be ran again if simply returning the found element.
   * If anything else is returned, an error will be thrown on the client because
   * it's won't a valid node.
   *
   * A good option, that has been tested to work, is to create an adapter
   * for the various HMR utilites, or define ways for users to code a single
   * DOM insertion point that can be torn down and rebuilt without issue
   */
  if (name) {
    const previouslyDefined = previouslyDefinedCheck(name)
    if (previouslyDefined !== false) {
      return previouslyDefined
    }
  }

  const ctor = component['constructor']
  const HTMLInterface = getHTMLInterface(extendsType)

  class Fresh extends HTMLInterface {
    constructor() {
      super()
      ctor.call(this)
    }
  }

  const FreshProto = merge(
    initState(Fresh.prototype), 
    component, 
    Base
  )

  Object.defineProperties(
    Fresh.prototype,
    Object.assign({}, Object.getOwnPropertyDescriptors(FreshProto))
  )

  return record(name, Fresh, extendsType)
}

/**
 * Parses a single "definition" argument and returns an object with
 * two properties, name and extendsType
 *
 * @param {Object|string} definition
 * @return {Object}
 */
const parseComponentDefinition = definition => {
  if (typeof definition === 'object') {
    return {
      name: definition.name,
      extendsType: definition.extendsType
    }
  }

  return {
    name: definition
  }
}

/**
 * Parses componentCallback parameter which can either be a function or object.
 * If it's a function, execute it now
 *
 * @param {Object|function} The componentCallback parameter
 * @return {Object} The object used as the prototype for the new element
 */
const parseComponentCallback = componentCallback => {
  return typeof componentCallback === 'object'
    ? componentCallback
    : componentCallback()
}

/**
 * Returns the HTML Interface based on extendsType
 *
 * @param {string} extendsType The tagName of the element to extend
 * @return {Object}
 */
const getHTMLInterface = extendsType => {
  return (extendsType && HTMLInterfaces[extendsType]) || HTMLElement
}

/**
 * Simple check for previously defined elements to prevent errors
 * with CustomElementRegistry throwing an "name already used with the registry" errors.
 *
 * @param {string} name The name to check in the registry
 * @return {function|false} If the element was previously defined, return its constructor function, otherwise return false
 */
const previouslyDefinedCheck = name => {
  return registry.get(name) || false
}

/**
 * Returns the HTML Interface based on extendsType
 *
 * @param {string} extendsType The tagName of the element to extend
 * @return {Object}
 */
const mergeObjectsPropertyDescriptors = (...objs) => {
  return objs.reduce((acc, cur) => {
    return Object.getOwnPropertyDescriptors(cur)
  }, {})
}

/**
 * State Initializer
 * Within closure for encapsulation
 *
 * @param {HTMLElement} inst An instance of the HTMLElement
 * @return {HTMLElement} Returns the "modified-in-place" element
 */
const initState = Component =>
  (Component => {
    let oldState = {}
    return Object.defineProperties(Component, {
      setState: {
        value: function(newState) {
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
