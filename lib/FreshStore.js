import isDefined from './helpers/isDefined'
import DOMInterface from './dom/DOMInterface'
import FreshElement from './FreshElement'

// Global store of Custom Elements defined within this library
// This should mimic exactly what is in CustomElementsRegistry
const globalStore = (() => {
  window.$$__freshElementStore = window.$$__freshElementStore || {}
  return window.$$__freshElementStore
})()

const define = ({ name, target, extendsElement }) => {
  const freshName = name && name.includes('-') ? name : `fresh-${name || extendsElement}`
  const previouslyDefined = get(freshName)

  if (previouslyDefined) return previouslyDefined

  const FreshElement = makeFresh({name: freshName, target, extendsElement})

  window.customElements.define(freshName, FreshElement, {
    extends: extendsElement
  })

  globalStore[freshName] = FreshElement

  return get(freshName)
}

const get = name => {
  return (
    (globalStore[name] && globalStore[name].target) ||
    window.customElements.get(name) ||
    undefined
  )
}

const makeFresh = ({name, target, extendsElement}) => {
  const HTMLInterface = DOMInterface[extendsElement] || HTMLElement

  if (!(target.prototype instanceof HTMLInterface)) {
    const Fresh = FreshElement(extendsElement)
    Object.setPrototypeOf(
      target.prototype,
      Fresh.prototype
    )

    target.prototype.constructor = target
  }

  return setConstructorProps({name, target, extendsElement})
}

const setConstructorProps = ({name, target, extendsElement}) => {
  target.$$__extends = extendsElement
  target.$$__name = name

  return target
}

export default Object.freeze({
  define: define,
  get: get
})
