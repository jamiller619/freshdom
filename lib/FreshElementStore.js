import FreshMaker, {validateElementName, validateInstance} from './FreshMaker'

// Global store of Custom Elements defined within this library
// This should mimic exactly what is in CustomElementsRegistry
if (!window.$$__freshElementStore) {
  window.$$__freshElementStore = new Map()
}

const globalStore = window.$$__freshElementStore

const define = ({name, target, extendsElement}) => {
  // If the element has previously been defined, return it now.
  // Typically only applies when in dev mode with HMR enabled.
  const tagName = validateElementName(name)

  const defined = get(tagName) || window.customElements.get(tagName)
  if (defined) {
    return defined
  }

  const FreshMade = FreshMaker({name: tagName, target, extendsElement})

  window.customElements.define(tagName, FreshMade, {
    extends: extendsElement
  })

  globalStore.set(tagName, FreshMade)

  return FreshMade
}

const get = name => {
  if (globalStore.has(name)) {
    return validateInstance(globalStore.get(name))
  }

  return window.customElements.get(name) || false
}

export default {
  define,
  get
}
