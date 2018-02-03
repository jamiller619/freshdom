import config from './config'
// check if custom elements are supported
// window.customElements instanceof CustomElementRegistry

if (!window.customElementsStore) window.customElementsStore = {}

const customElementsLib = {
  get (tagName) {
    return window.customElementsStore[tagName]
  },

  create ({ target, params }) {
    let el = undefined
    if (typeof target === 'string' && target.includes('-')) {
      // if (this.store[target]) {
      el = customElementsStore[target]
      // el = this.store[target] || customElements.get(target) || this.define({ target: target })
    } else if (target && target.prototype instanceof HTMLElement) {
      el = target
    } else {
      el = target(params)
    }
    return new el(params)
  },

  define ({ target, name }) {
    // debugger
    const ctor = target.prototype.constructor
    const tagName = (name || ctor.tagName || `${ config.tagPrefix }-${ ctor.name }`).toLowerCase()
    // if (this.store[tagName]) {
    //   return this.store[tagName]
    // }
    // if (!ctor.tagName || ctor.tagName !== tagName) {
    //   ctor.tagName = tagName
    // }
    // const el = customElements.get(tagName)
    // if (el !== undefined) {
    //   this.addToStore(tagName, el)
    //   return this.store[tagName]
    // }

    if (!this.get(tagName)) {
      customElements.define(tagName, target)
      window.customElementsStore[tagName] = customElements.get(tagName)
    }

    return this.get(tagName)
  }
}

export default customElementsLib
