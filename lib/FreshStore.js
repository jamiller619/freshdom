import FreshInstance from './FreshInstance'

// Global store of Custom Elements defined within this library
// This should mimic exactly what is in CustomElementsRegistry
if (!window.$$__freshElementStore) {
  window.$$__freshElementStore = new Map()
}

const globalStore = window.$$__freshElementStore

const define = ({name, target, extendsElement}) => {
  const freshName =
    name && name.includes('-') ? name : `fresh-${name || extendsElement}`
  const previouslyDefined = get(freshName)

  if (previouslyDefined) return previouslyDefined

  const FreshElement = FreshInstance.make(target, {
    name: freshName,
    extendsElement
  })

  window.customElements.define(freshName, FreshElement, {
    extends: extendsElement
  })

  globalStore.set(freshName, FreshElement)

  return FreshElement
}

const get = name => {
  return (
    (globalStore.has(name) && globalStore.get(name)) ||
    window.customElements.get(name) ||
    undefined
  )
}

export default {
  define,
  get
}
