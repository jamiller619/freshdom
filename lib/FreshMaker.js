import HTMLInterfaces from './types/HTMLInterfaces'
import ElementBase from './element/Base'

/**
 * Traverses the "target" prototype chain and adds another level
 * of prototypes so it can correctly render HTML elements.
 * Also initializes state and prop on the target element itself.
 *
 * This is ONLY necessary because we allow "customized built-in"
 * elements which require the specific inheritance of that element's interface
 *
 * @param {String} name The element's name
 * @param {Function} target The constructor function for the element
 * @param {String} extendsElement The element's tag name if using customized built-in elements
 * @return {Function} The modified target constructor
 */
export const make = ({name, target, extendsElement}) => {
  const HTMLInterface =
    (extendsElement && HTMLInterfaces[extendsElement]) || HTMLElement
  const tagName = validateElementName(name)
  const Target = getLastInProtoChain(target)

  setInternalStaticProps(target, {
    name: tagName,
    extendsElement
  })

  initState(target.prototype)

  const FreshMade = function FreshMade() {}

  FreshMade.prototype = Object.create(
    HTMLInterface.prototype,
    convertObjectsToPropDefinition(ElementBase, {
      constructor: FreshMade
    })
  )

  Object.setPrototypeOf(Target.prototype, FreshMade.prototype)

  return target
}

/**
 * Creates an HTMLElement.
 *
 * @param {Function} FreshConstructor The constructor function that will create the element.
 * @param {Object} props The props to be assigned to the element.
 * @return {HTMLElement}
 */
export const createInstance = (FreshConstructor, props) => {
  if (FreshConstructor.prototype instanceof HTMLElement) {
    try {
      return validateInstance(setProps(createDOM(FreshConstructor), props))
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
 * Gets the last prototype in a chain.
 *
 * @param {Function} Constructor The constructor function to begin searching
 * @return {Function} The last constructor function in the prototype chain
 */
const getLastInProtoChain = Constructor => {
  const proto = Object.getPrototypeOf(Constructor)
  if (proto !== Function.prototype) {
    return getLastInProtoChain(proto)
  }
  return Constructor
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
 * Initializes the "state" property on an element.
 *
 * @param {HTMLElement} inst An instance of the HTMLElement
 * @return {HTMLElement} Returns the "modified-in-place" element
 */
const initState = inst =>
  (inst => {
    const localState = Object.create(null)
    return Object.defineProperties(inst, {
      setState: {
        writable: false,
        configurable: false,
        enumerable: false,
        value: function(state) {
          Object.assign(localState, state)
        }
      },
      state: {
        configurable: false,
        enumerable: false,
        get() {
          return localState
        }
      }
    })
  })(inst)

/**
 * Creates an HTMLElement (or DOM node) from a constructor function.
 *
 * @param {Function} FreshConstructor The constructor function capable of producing HTMLElements
 * @return {HTMLElement}
 */
const createDOM = FreshConstructor => {
  const {extendsElement, name} = getInternalStaticProps(FreshConstructor)

  return extendsElement
    ? document.createElement(extendsElement, {is: name})
    : document.createElement(name)
}

/**
 * Sets the necessary static properties that are used in this library.
 *
 * @param {Function} FreshConstructor
 * @param {Object} props The properties object with properties "name" and "extendsElement"
 * @return {Function} The "modified-in-place" constructor function.
 */
const setInternalStaticProps = (FreshConstructor, props) => {
  return Object.defineProperties(FreshConstructor, {
    $$__name: {
      value: props.name
    },
    $$__extends: {
      value: props.extendsElement
    }
  })
}

/**
 * Gets the static properties used throughout the library.
 *
 * @param {Function} FreshConstructor
 * @return {Object} An object with properties "name" and "extendsElement".
 */
const getInternalStaticProps = FreshConstructor => {
  return {
    name: FreshConstructor.$$__name,
    extendsElement: FreshConstructor.$$__extends
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