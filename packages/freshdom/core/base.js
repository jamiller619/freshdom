import render from './render'
import createElement from './createElement'
import {eventTypes, trigger} from './events'

const TYPE = Symbol('fresh.element')

/**
 * Fresh instance base
 *
 * Adds additional properties and methods not related to the
 * Custom Elements lifecycle events API defined below
 */
const FreshBase = {}

Object.defineProperties(FreshBase, {
  $$__typeof: {
    value: TYPE
  },
  isAttached: {
    writable: true,
    value: false
  },
  template: {
    get: function() {
      return this.$$__template
    },
    set: function(value) {
      this.$$__template = value
    }
  }
})

/**
 * Custom Elements API
 * Only official API methods/implementation should reside here
 */
const CustomElementBase = {}

Object.defineProperties(CustomElementBase, {
  connectedCallback: {
    value: async function() {
      await trigger(this, eventTypes.onBeforeAttach)
      const renderedContent = 'template' in this
        ? this.template
        : this.render()

      if (renderedContent) {
        await render(renderedContent, this)
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
    value: function(...args) {
      trigger(this, eventTypes.onUpdate, ...args)
    }
  }
})

/**
 * Static
 */
Object.defineProperty(CustomElementBase.constructor, 'observedAttributes', {
  value: []
})

export default Object.assign(
  {}, 
  Object.getOwnPropertyDescriptors(FreshBase), 
  Object.getOwnPropertyDescriptors(CustomElementBase)
)
