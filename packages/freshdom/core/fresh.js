import { events } from 'freshdom-utils'
import deepEqual from 'deep-equal'

import syncdom from './sync-dom'
import { isTemplate } from './types/is-html'
import registry from './registry'

const FreshComponent = function FreshComponent() {}

Object.defineProperties(FreshComponent.prototype, {
  /**
   * Lifecycle callbacks as defined by the Custom Element spec
   */
  connectedCallback: {
    value: async function() {
      await events.trigger(this, events.type.beforeRender)
      await this.renderUpdate()

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
    value: async function() {
      await this.renderUpdate()
    }
  },

  /**
   * Public properties
   */
  isAttached: {
    writable: true,
    value: false
  },

  state: {
    get: function() {
      return this.$$__state
    },
    set: function(value) {
      Object.defineProperty(this, '$$__state', {
        configurable: true,
        value: value
      })
    }
  },

  /**
   * Public methods
   */
  setState: {
    value: async function(state) {
      const prevState = this.$$__state
      const newState = clone(prevState, state)

      Object.defineProperty(this, '$$__state', {
        configurable: true,
        value: newState
      })

      await this.renderUpdate()
    }
  },

  renderUpdate: {
    value: async function() {
      if (this.shouldRender() === false) {
        return
      }

      const content = await this.render()

      await syncdom(this, content, {
        onBeforeElUpdated(fromEl, toEl) {
          if (fromEl.$$__type && fromEl.shouldRender) {
            return fromEl.shouldRender(fromEl, toEl)
          }
        }
      })

      await events.trigger(this, events.type.renderComplete)
    }
  },

  /**
   * Only render an element if its state and props haven't
   * changed since its last render.
   */
  shouldRender: {
    value: function(fromEl, toEl) {
      if (this.render && typeof this.render === 'function') {
        if (!toEl) {
          return true
        }

        if (
          fromEl.$$__state &&
          toEl.$$__state &&
          deepEqual(fromEl.state, toEl.state) === false
        ) {
          return true
        }

        return deepEqual(fromEl.props, toEl.props) === false
      }

      return false
    }
  }
})

/**
 * Mostly truly private methods
 */
const clone = (target, ...sources) => Object.assign({}, target, ...sources)

const createStateProps = (inst, ...props) => {
  Object.defineProperties(inst, {
    props: {
      configurable: true,
      value: Object.assign({}, ...props)
    }
  })

  return inst
}

const define = (ctor, ...props) => {
  registry.define(ctor.tag, ctor)
}

const init = (ctor, ...props) => {
  define(ctor, ...props)
  return inst => createStateProps(inst, ...props)
}

/**
 * The Factory
 *
 * Returns a constructor with all prototypes in place,
 * ready to be used in a prototype chain or extend.
 *
 * Can extend any HTML Interface ala . Defaults to "HTMLElement"
 */
export const Fresh = (HTMLInterface = window.HTMLElement) => {
  class Element extends HTMLInterface {
    constructor(...props) {
      init(new.target, ...props)(super())
    }
  }

  Object.defineProperties(
    Element.prototype,
    Object.getOwnPropertyDescriptors(FreshComponent.prototype)
  )

  return Element
}

export default Fresh()
