import { events } from 'freshdom-utils'

import mergeDOM from './merge-dom'
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
      // TODO: Add warning/error if $$__state has already been populated
      Object.defineProperty(this, '$$__state', {
        value: value
      })
    }
  },

  /**
   * Public methods
   */
  setState: {
    value: async function(state, callback) {
      const prevState = this.state
      const newState = clone(prevState, state)

      Object.defineProperty(this, '$$__state', {
        configurable: true,
        value: newState
      })

      await this.renderUpdate()

      if (callback) {
        callback.call(this, prevState, this.props)
      }
    }
  },

  renderUpdate: {
    value: async function() {
      let content =
        await (this.render && typeof this.render === 'function'
          ? this.render()
          : this.props.children)

      if (!Array.isArray(content)) {
        content = Array.of(content)
      }

      await mergeDOM(this, content)
    }
  }
})

/**
 * Mostly truly private methods
 */
const clone = (target, ...sources) => Object.assign({}, target, ...sources)

const createStateProps = (inst, props) => {
  Object.defineProperties(inst, {
    props: {
      configurable: true,
      value: props
    },
    $$__state: {
      configurable: true,
      value: {}
    }
  })

  return inst
}

const define = (ctor, props = {}) => {
  registry.define(ctor.tag, ctor)
  return inst => createStateProps(inst, props)
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
    constructor(props = {}) {
      define(new.target, props)(super())
    }
  }

  Object.defineProperties(
    Element.prototype,
    Object.getOwnPropertyDescriptors(FreshComponent.prototype)
  )

  return Element
}

export default Fresh()
