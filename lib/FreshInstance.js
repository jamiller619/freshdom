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
