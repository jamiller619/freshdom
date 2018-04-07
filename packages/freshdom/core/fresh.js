// import HTMLInterfaces from '../types/HTMLInterfaces'
import HTMLBase, {extend} from './element-base'
import createInstance from './create-instance'
import {trigger, eventTypes} from './events'
import registry from './registry'
import merge from '../utils/merge'
import UUID from './uuid'

/**
 * Entry point for creating Custom Element Components
 *
 * Specifically, this function parses a range of
 * arguments and returns a constructor function
 * that has been defined with the CustomElementRegistry
 */
export default (...args) => {
  let name = undefined
  let inherits = undefined

  const isUnnamedComponent = args.length === 1 || typeof args[0] === 'function'
  const isNamedComponent = !isUnnamedComponent
  // const template = isUnnamedComponent && args.length === 2 ? args[1] : undefined

  const component = isNamedComponent ? args[1] : args[0]
  const meta = parseComponentMeta(
    isNamedComponent ? args[0] : undefined
  )

  return previouslyDefinedCheck(meta.name) || make(component, meta)
}

/**
 * Creates a constructor function capable of producing Custom Elements.
 *
 * @param {function} component: The component as an object literal
 * @param {string} component.name: The element's tag name
 * @param {HTMLElement} template: The element's template
 * @param {string} inherits: The element's tag name to extend from
 * @return {Function} The constructor function to create future instances
 */
const make = (component, meta) => {
  // const {name, inherits, template} = meta
  // const HTMLInterface = getHTMLInterface(inherits)

  class Fresh extends HTMLBase((inst, props) => {
    constructElement(inst, component, props)
  }) {}

  console.dir(Fresh)

  return registry.define(meta, Fresh)
}

/**
 * Merge and instantiates a new component
 *
 * @param {HTMLElement} target: The host instance to merge into
 * @param {object|function} component: The source component's constructor
 * @param {object} props
 * @return {HTMLElement} The merged result
 */
const constructElement = (target, source, props) => {
  const element = source === 'object' ? source : createInstance(source, props)
  // return element.prototype instanceof HTMLElement
  //   ? element 
  //   : merge(target, element)
  if (element.prototype instanceof HTMLElement) {
    return merge(target, element.prototype)
  } else {
    return merge(target, element)
  }
}

/**
 * Parses an options argument and returns the
 * component's "meta" object
 *
 * @param {object|string} options
 * @return {object}
 */
const parseComponentMeta = options => {
  const uuid = UUID.create()
  const meta = {
    id: uuid,
    name: uuid,
    inherits: undefined
  }

  switch (typeof options) {
    case 'object':
      meta.name = options.name
      meta.inherits = options.inherits
      break
    case 'string':
      meta.name = options
      break
  }

  return meta
}

export const Component = make({}, parseComponentMeta())

/**
 * Simple check for previously defined elements to prevent throwing
 * CustomElementRegistry "name already used in the registry" errors.
 *
 * @param {string} name The name to check in the registry
 * @return {function|false} If the element was previously defined, return its constructor function, otherwise return false
 */
const previouslyDefinedCheck = name => {
  return (name && registry.get(name)) || false
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
