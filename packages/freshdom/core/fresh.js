import {events} from 'freshdom-utils'
import compare from 'deep-equal'

import reconcile from './reconciler'
import registry from './registry'

const FreshElement = function FreshElement() {}

Object.defineProperties(FreshElement.prototype, {
  $$__type: {
    value: Symbol('fresh.element')
  },

  isAttached: {
    writable: true,
    value: false
  },

  connectedCallback: {
    value: async function() {
      await events.trigger(this, events.type.onBeforeAttach)
      await this.renderUpdateState()
      this.isAttached = true
      await events.trigger(this, events.type.onAttach)
    }
  },
  
  disconnectedCallback: {
    value: function() {
      this.isAttached = false
      events.trigger(this, events.type.onDetach)
    }
  },
  
  attributeChangedCallback: {
    value: function() {
      this.renderUpdateState()
    }
  },

  $$__state: {
    configurable: true,
    value: Object.freeze({})
  },

  state: {
    get: function() {
      return this.$$__state || {}
    },
    set: function() {
      throw new Error('`state` cannot be used as a setter. Use `setState` instead!')
    }
  },

  setState: {
    value: async function(state, renderUpdates = false) {
      Object.defineProperty(this, '$$__state', {
        configurable: true,
        value: Object.freeze(Object.assign({}, this.$$__state, state))
      })

      if (renderUpdates === true) {
        await this.renderUpdateState()
      }
    }
  },
  
  renderUpdateState: {
    value: async function() {
      if (this.render && typeof this.render === 'function') {
        const rendered = await this.render()
        await reconcile(rendered, this)
        await events.trigger(this, events.type.onRender)
      }
    }
  }
})

const createProps = (inst, props) => {
  inst.props = Object.freeze(props)
  return inst
}

const define = (ctor, props = {}) => {
  registry.define(ctor.tagName, ctor)
  return inst => createProps(inst, props)
}

export const Fresh = HTMLInterface => {
  class Element extends HTMLInterface {
    constructor(props = {}) {
      define(new.target, props)(super())
    }
  }

  Object.defineProperties(
    Element.prototype,
    Object.getOwnPropertyDescriptors(FreshElement.prototype)
  )

  return Element
}

export default Fresh(HTMLElement)
