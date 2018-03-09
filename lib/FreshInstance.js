import FreshElement from './FreshElement'
import DOMInterface from './dom/DOMInterface'

const ConstructError = (FreshConstructor, e) => {
  return new Error(
    `Could not create element "${FreshConstructor.$$__name}": ${e}`)
}

const make = (FreshConstructor, {name, extendsElement}) => {
  const HTMLInterface = DOMInterface[extendsElement] || HTMLElement

  if (!(FreshConstructor.prototype instanceof HTMLInterface)) {
    const Fresh = FreshElement(extendsElement)
    Object.setPrototypeOf(
      FreshConstructor.prototype,
      Fresh.prototype
    )
  }

  return setInternalProps(FreshConstructor, {name, extendsElement})
}

const create = (FreshConstructor, props) => {
  if (FreshConstructor && FreshConstructor.prototype instanceof HTMLElement) {
    try {
      return createElement(FreshConstructor, props)
    } catch (e) {
      throw ConstructError(FreshConstructor, e)
    }
  } else {
    try {
      return FreshConstructor(props)
    } catch(e) {
      try {
        return new FreshConstructor(props)
      } catch (e) {
        throw ConstructError(FreshConstructor, e)
      }
    }
  }
}

const defineProps = (inst, initialValue) => Object.defineProperty(inst, 'props', {
  value: initialValue && typeof initialValue === 'object' ? initialValue : {},
  writable: false,
  configurable: false,
  enumerable: false
})

const defineState = inst => (inst => {
  // Is there any benefit to creating an object without
  // a prototype? This used to be "const localState = {}"
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
})(inst)

const createElement = (FreshConstructor, props) => {
  const {extendsElement, name} = getInternalProps(FreshConstructor)
  FreshConstructor.prototype.props = props
  if (extendsElement && name) {
    return document.createElement(extendsElement, {
      is: name
    })
  }

  return document.createElement(name)
}

const internalPropsMap = {
  name: {
    name: '$$__name'
  },
  extendsElement: {
    name: '$$__extends'
  },
  state: {
    name: '$$__state',
    def: {
      writable: true,
      configurable: true,
      enumerable: false
    }
  }
}

const internalPropsDefaultDefinition = {
  writable: false,
  configurable: false,
  enumerable: false
}

const setInternalProps = (FreshConstructor, props) => {
  const propDefinitions = {}

  Object.keys(props).forEach(key => {
    const prop = internalPropsMap[key]
    if (!prop) {
      throw new Error(`Cannot set property "${prop}"`)
    }
    const propDefinition = Object.assign(
      {},
      ( prop.def || internalPropsDefaultDefinition ), 
      { value: props[key] }
    )
    propDefinitions[prop.name] = propDefinition
  })

  return Object.defineProperties(FreshConstructor, propDefinitions)
}

const getInternalProps = FreshConstructor => {
  return {
    name: FreshConstructor.$$__name,
    extendsElement: FreshConstructor.$$__extends
  }
}

export default {
  create,
  make,
  setInternalProps,
  getInternalProps
}
