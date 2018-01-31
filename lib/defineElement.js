// check if custom elements are supported
// window.customElements instanceof CustomElementRegistry

const customElementTypes = {
  'HTMLButtonElement': 'button'
}

const defineElement = target => {
  const el = target.prototype
  const elCtor = el.constructor
  const name = el.is || `jasmin-${ elCtor.name.toLowerCase() }`
  if (customElements.get(name) === undefined) {
    let opts = {}
    const elementExtends = elCtor.__customElementExtends
    if (elementExtends && elementExtends in customElementTypes) {
      opts['extends'] = customElementTypes[elementExtends] || ''
    } else {
      customElements.define(name, target, opts)
    }
  }
}

export default defineElement
