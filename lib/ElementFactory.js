import isDefined from './helpers/isDefined'
import DOMInterface from './dom/DOMInterface'
import Element from './Element'

// Global store of Custom Elements defined within this library
// This should mimic exactly what is in CustomElementsRegistry
if (process.env.NODE_ENV !== 'production') {
  if (!window.$$__freshCEStore) window.$$__freshCEStore = {}
}

const defineElement = ({ name, target, elementExtends }) => {
  let Element = getElement(name)

  if (Element) {
    return Element
  }

  // return isDefined(Element) && Element

  let opts = {}

  window.customElements.define(name, target, opts)
  
  Element = getElement(name) 
  window.$$__freshCEStore[name] = Element

  return Element
}

const getElement = tag => {
  return window.customElements.get(tag) 
}

export default { 
  define: defineElement, 
  get: getElement 
}
