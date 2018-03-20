import HTMLInterfaces from './types/HTMLInterfaces'
import Base from './element/Base'
import {trigger, eventTypes} from './element/events'

/**
 * Creates a constructor function that will be used to create 
 * our element and initializes its state and prop objects.
 *
 * @param {string|Object} definition: The element's name, or name and extendsType
 * @param {Object} component: The component as an object literal
 * @return {Function} The constructor function to create future instances
 */
export default function(definition, component) {
  const {name, extendsType} = parseComponentDefinition(definition)
  const HTMLInterface = (extendsType && HTMLInterfaces[extendsType]) || HTMLElement
  const ctor = component['constructor']

  class Fresh extends HTMLInterface {
    constructor(...props) {
      super()
      Object.defineProperty(this, 'isAttached', {
        writable: true,
        value: false
      })
      ctor.call(this)
    }
  }

  Object.defineProperties(
    Fresh.prototype, 
    convertObjectsToPropDefinition(Base, component)
  )

  initState(Fresh.prototype)
  setInternalStaticProps(Fresh, {name, extendsType})

  window.customElements.define(name, Fresh)

  return Fresh
}

/**
 * Parses a single "definition" argument to extract
 *  name, extendsType
 * properties
 *
 * @param {Object|string} definition The argument
 * @return {Object} A common object with "name" and "extendsType" properties
 */
const parseComponentDefinition = definition => {
  if (typeof definition === 'object') {
    return {
      name: validateElementName(definition.name),
      extendsType: definition.extendsType
    }
  }

  return {
    name: validateElementName(definition),
    extendsType: undefined
  }
}

/**
 * Attempts to create an HTMLElement instance given a constructor.
 *
 * @param {Function} FreshConstructor The constructor function that will create the element.
 * @param {Object} props The props to be assigned to the element.
 * @return {HTMLElement}
 */
export const createInstance = (FreshConstructor, props) => {
  if (FreshConstructor.prototype instanceof HTMLElement) {
    try {
      return validateInstance(setProps(createDOM(FreshConstructor), props))
      // return validateInstance(new FreshConstructor(props))
    } catch (e) {
      throw ConstructError(FreshConstructor, e)
    }
  }

  try {
    return validateInstance(FreshConstructor(props))
  } catch (e) {
    try {
      return validateInstance(new FreshConstructor(props))
    } catch (e) {
      throw ConstructError(FreshConstructor, e)
    }
  }
}

/**
 * Converts an object to one that can be used for defineProperty functions.
 *
 * @param {Object} obj The object or objects to create the defintion from
 * @return {Object} Property definition.
 */
const convertObjectsToPropDefinition = (...obj) => {
  const ret = {}
  obj.map(ob =>
    Object.keys(ob).map(key => {
      ret[key] = {
        value: ob[key]
      }
    })
  )
  return ret
}

/**
 * Validates element's tag name to meet Custom Element requirements.
 * If the name is invalid, returns a name using the prefix to meet requirements.
 *
 * @param {String} name
 * @param {String} prefix Used if "name" is invalid
 * @return {String} A valid Custom Element name
 */
export const validateElementName = (name, prefix = 'fresh') => {
  return name.includes('-') ? name : `${prefix}-${name}`
}

/**
 * Validation check for property constructred elements.
 *
 * TODO: add check for DEV ENV since this is not useful in
 * prod environments and slows down the process
 *
 * @param {HTMLElement} inst The element to validate.
 * @return {HTMLElement} The same inst will be returned.
 */
export const validateInstance = inst => {
  return inst

  // First make sure we only validate Fresh element instances
  // if (!inst.$$__typeof) return inst

  // const name = inst.name || inst.localName
  // const checks = Object.assign(Object.create(null), {
  //   hasStaticInternalProps: false,
  //   hasValidStaticInternalProps: false,
  //   hasProps: false,
  //   hasState: false
  // })

  // if ('$$__extends' in inst.constructor && '$$__name' in inst.constructor) {
  //   checks.hasStaticInternalProps = true
  //   const name = inst.constructor.$$__name
  //   if (typeof name === 'string' && name.trim() !== '') {
  //     checks.hasValidStaticInternalProps = true
  //   }
  // }

  // if ('props' in inst && typeof inst.props === 'object') {
  //   checks.hasProps = true
  // }

  // if ('state' in inst && 'setState' in inst && typeof inst.state === 'object') {
  //   checks.hasState = true
  // }

  // if (Object.values(checks).filter(c => c === false).length > 0) {
  //   console.warn(`Validation check for "${inst.localName || inst.name}" failed with`, checks)
  // }

  // return inst
}

/**
 * Sets the "prop" property, and attributes, on an element.
 *
 * @param {HTMLElement} element
 * @param {Object} props
 * @return {HTMLElement} Returns the "modified-in-place" element
 */
const setProps = (element, props) => {
  return Object.defineProperty(element, 'props', {
    value: props || {}
  })
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
    const oldState = {}
    return Object.defineProperties(Component, {
      setState: {
        value: function(newState) {
          oldState = Object.assign({}, oldState, newState)
        }
      },
      state: {
        get() { return oldState }
      }
    })
  }
)(Component)

/**
 * Creates an HTMLElement (or DOM node) from a constructor function.
 *
 * @param {Function} FreshConstructor The constructor function capable of producing HTMLElements
 * @return {HTMLElement}
 */
const createDOM = FreshConstructor => {
  const {extendsType, name} = getInternalStaticProps(FreshConstructor)

  return extendsType
    ? document.createElement(extendsType, {is: name})
    : document.createElement(name)
}

/**
 * Sets the necessary static properties that are used in this library.
 *
 * @param {Function} FreshConstructor
 * @param {Object} props The properties object with properties "name" and "extendsType"
 * @return {Function} The "modified-in-place" constructor function.
 */
const setInternalStaticProps = (FreshConstructor, props) => {
  return Object.defineProperties(FreshConstructor, {
    $$__name: {
      value: props.name
    },
    $$__extends: {
      value: props.extendsType
    }
  })
}

/**
 * Gets the static properties used throughout the library.
 *
 * @param {Function} FreshConstructor
 * @return {Object} An object with properties "name" and "extendsType".
 */
const getInternalStaticProps = FreshConstructor => {
  return {
    name: FreshConstructor.$$__name,
    extendsType: FreshConstructor.$$__extends
  }
}

/**
 * Creates an common Error object.
 *
 * @param {Function} FreshConstructor The constructor from where the error originates
 * @param {String} exceptions A string or strings of exception messages
 * @return {Error}
 */
const ConstructError = (FreshConstructor, ...exceptions) => {
  const exceptionString = exceptions.map(e => `${e.toString()}\n`).join('')
  console.dir(FreshConstructor)
  return new Error(
    `Failed to construct element "${
      FreshConstructor.$$__name
    }" (printed above for reference) with Exception: ${exceptionString}`
  )
}