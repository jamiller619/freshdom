import HTMLInterfaces from '../types/HTMLInterfaces'
import Base from './base'
import {trigger, eventTypes} from './events'
import registry, {record} from './registry'
import merge from '../helpers/merge'

/**
 * Entry point for creating Custom Element Components.
 *
 * Here, we simply parse the range of acceptable arguments
 */
export default (...args) => {
  let name,
    inherits = undefined
  const isUnnamedComponent = args.length === 1 || typeof args[0] === 'function'
  const isNamedComponent = !isUnnamedComponent
  const template = isUnnamedComponent && args.length === 2 ? args[1] : undefined
  const component = parseComponentCallback(
    isNamedComponent ? parseComponentDefinition(args[1]) : args[0]
  )

  if (previouslyDefinedCheck(component)) {
    return component
  }

  return make(
    Object.assign(
      { 
        template
      },
      parseComponentCallback(
        isNamedComponent ? parseComponentDefinition(args[1]) : args[0]
      )
    )
  )
}

/**
 * Creates a constructor function capable of producing Custom Elements.
 *
 * @param {function} component: The component as an object literal
 * @param {string} component.name: The element's name, or name and inherits
 * @param {string} name: The element's tag name
 * @param {string} inherits: The element's tag name to extend from
 * @return {Function} The constructor function to create future instances
 */
const make = (component = {}) => {
  const {name, inherits, template} = component
  class Fresh extends getHTMLInterface(inherits) {
    constructor(...props) {
      super()
      if (component['constructor']) {
        component['constructor'].call(this, ...props)
      }
    }
  }

  Object.defineProperties(
    initState(Fresh.prototype),
    merge(Base, Object.getOwnPropertyDescriptors(component))
  )

  return record(name, Fresh, inherits)
}

/**
 * Simple check for previously defined elements to prevent throwing
 * CustomElementRegistry "name already used in the registry" errors.
 *
 * @param {string} name The name to check in the registry
 * @return {function|false} If the element was previously defined, return its constructor function, otherwise return false
 */
const previouslyDefinedCheck = name => {
  return name && registry.get(name) || false
}

/**
 * Parses a single "definition" argument and returns an object with
 * two properties, name and inherits
 *
 * @param {Object|string} definition
 * @return {Object}
 */
const parseComponentDefinition = definition => {
  if (typeof definition === 'object') {
    return {
      name: definition.name,
      inherits: definition.inherits
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
  if (typeof componentCallback === 'object') {
    return componentCallback
  }
  try {
    return componentCallback()
  } catch (e) {
    return new componentCallback()
  }
}

/**
 * Returns the HTML Interface based on inherits
 *
 * @param {string} inherits The tagName of the element to extend
 * @return {Object}
 */
const getHTMLInterface = inherits => {
  return (inherits && HTMLInterfaces[inherits]) || HTMLElement
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
