import config from './config'
import render from './render'
// check if custom elements are supported
// window.customElements instanceof CustomElementRegistry

if (!window.__jasminElementsStore) window.__jasminElementsStore = {}

const customElementsLib = {
  get (tagName) {
    return window.__jasminElementsStore[tagName]
  },

  create ({ target, params }) {
    let el = undefined
    
    if (typeof target === 'string' && target.includes('-')) {
      el = this.get(target)
      // if (!el) {
      //   // console.log(target, params)
      //   // el = target(params)
      // }
    } else if (target && 'is' in params) {
      el = this.get(params.is)
    } else {
      el = target(params)
    }

    if (el && el.constructor) {
      return new el(params)
    } else {
      
      // return el({ params })
    }
  },

  define ({ target, name, is }) {
    const ctor = target.prototype.constructor
    const tagName = (name || ctor.__tag || `${ config.tagPrefix }-${ ctor.name }`).toLowerCase()

    if (!this.get(tagName)) {
      const customElementOptions = {
        extends: is || ctor.__is
      }
      customElements.define(tagName, target, customElementOptions)
      window.__jasminElementsStore[tagName] = customElements.get(tagName)
    }

    if (!ctor.__tag) ctor.__tag = tagName
    if (!ctor.__is) ctor.__is = is

    return this.get(tagName)
  }
}

export default customElementsLib
