import HTMLInterfaces from './types/HTMLInterfaces'
import FreshElement from './FreshElement'

export default ({name, target, extendsElement}) => {
  const HTMLInterface = (extendsElement && HTMLInterfaces[extendsElement]) || HTMLElement
  const HTMLBase = Object.create(HTMLInterface.prototype)
  const FreshMade = {}
  const tagName = validateElementName(name)
  
  FreshMade.prototype = Object.assign(HTMLBase, FreshElement)
  Object.setPrototypeOf(initState(target.prototype), FreshMade.prototype)

  return setInternalStaticProps(target, {
    name: tagName,
    extendsElement
  })
}

export const createInstance = (FreshConstructor, props) => {
  try {
    return validateInstance(FreshConstructor(props))
  } catch(e) {
    try {
      return validateInstance(new FreshConstructor(props))
    } catch(e) {
      try {
        return validateInstance(setProps(createDOM(FreshConstructor), props))
      } catch(e) {
        throw ConstructError(FreshConstructor, e)
      }
    }
  }
}

export const validateElementName = name => {
  return name.includes('-') ? name : `fresh-${name}`
}

/**
 * TODO: include check for dev env
 * and return the "inst" parameter for all others
 */
export const validateInstance = inst => {
  // First make sure we only validate Fresh element instances
  if (!inst.$$__typeof) return inst

  const name = inst.name || inst.localName
  const checks = Object.assign(Object.create(null), {
    hasStaticInternalProps: false,
    hasValidStaticInternalProps: false,
    hasProps: false,
    hasState: false
  })

  if ('$$__extends' in inst.constructor && '$$__name' in inst.constructor) {
    checks.hasStaticInternalProps = true
    const name = inst.constructor.$$__name
    if (typeof name === 'string' && name.trim() !== '') {
      checks.hasValidStaticInternalProps = true
    }
  }

  if ('props' in inst && typeof inst.props === 'object') {
    checks.hasProps = true
  }

  if ('state' in inst && 'setState' in inst && typeof inst.state === 'object') {
    checks.hasState = true
  }

  if (Object.values(checks).filter(c => c === false).length > 0) {
    console.warn(`Validation check for "${inst.localName || inst.name}" failed with`, checks)
  }

  return inst
}

const setProps = (inst, props) => {
  return Object.defineProperty(inst, 'props', {
    value: Object.assign(Object.create(null), props || {})
  })
}

const initState = inst => (inst => {
  const localState = Object.create(null)
  Object.defineProperties(inst, {
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
  return inst
})(inst)

const createDOM = FreshConstructor => {
  const {extendsElement, name} = getInternalStaticProps(FreshConstructor)

  return extendsElement
    ? document.createElement(extendsElement, { is: name })
    : document.createElement(name)
}

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

const getInternalStaticProps = FreshConstructor => {
  return {
    name: FreshConstructor.$$__name,
    extendsElement: FreshConstructor.$$__extends
  }
}

const ConstructError = (FreshConstructor, ...exceptions) => {
  const exceptionString = exceptions.map(e => `${e.toString()}\n`).join('')

  return new Error(
    `Failed to construct element "${FreshConstructor.$$__name}": ${exceptionString}`)
}
