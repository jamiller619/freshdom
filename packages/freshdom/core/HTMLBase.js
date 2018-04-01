import render from './render'
import merge from '../helpers/merge'
import {eventTypes, trigger} from './events'

const TYPE = Symbol('fresh.element')

/**
 * Fresh instance base properties and methods
 */
const Base = {}
Object.defineProperties(Base, {
  $$__typeof: {
    value: TYPE
  },
  isAttached: {
    writable: true,
    value: false
  },
  connectedCallback: {
    value: async function() {
      await trigger(this, eventTypes.onBeforeAttach)
      if ('template' in this || 'render' in this) {
        await render(this.template || this.render(), this)
      }

      this.isAttached = true

      trigger(this, eventTypes.onAttach)
    }
  },
  disconnectedCallback: {
    value: function() {
      this.isAttached = false
      trigger(this, eventTypes.onDetach)
    }
  },
  attributeChangedCallback: {
    value: function() {
      trigger(this, eventTypes.onUpdate, ...args)
    }
  }
})

export const extend = (HTMLInterface, init = function() {}) => {
  class HTMLBase extends HTMLInterface {
    constructor(props) {
      init(super(), props)
    }
  }
  merge(HTMLBase.prototype, Base)
  return HTMLBase
}

export default init => {
  return extend(HTMLElement, init)
}
