// check if custom elements are supported
// window.customElements instanceof CustomElementRegistry

const defineElement = target => {
  const el = target.prototype
  const elCtor = el.constructor
  const name = el.is || `jasmin-${ elCtor.name.toLowerCase() }`
  if (customElements.get(name) === undefined) {
    const opts = elCtor.__customElementOpts
    customElements.define(name, target, opts)
  }
}

export default defineElement
