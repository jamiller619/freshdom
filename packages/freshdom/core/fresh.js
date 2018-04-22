import { events } from 'freshdom-utils'

import redom from './redom'
import registry from './registry'
import * as freshType from './types/fresh'

const FreshElement = function FreshElement() {}

Object.defineProperties(FreshElement.prototype, {
  /**
   * Lifecycle callbacks as defined by the Custom Element spec
   */
  connectedCallback: {
    value: async function() {
      await events.trigger(this, events.type.onBeforeAttach)
      await this.forceRefresh()
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
      await this.forceRefresh()
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
    set: function() {
      throw new Error(
        'Component state is immutable and cannot be used as a setter. Use "setState" instead.'
      )
    }
  },

  /**
   * Public methods
   */
  setState: {
    value: async function(...args) {
      const { state, shouldRender, callback } = parseSetStateArguments(...args)

      const prevState = clone(this.state)
      const newState = clone(this.state, state)

      Object.defineProperty(Object.getPrototypeOf(this), '$$__state', {
        configurable: true,
        value: newState
      })

      if (shouldRender === true) {
        await this.forceRefresh()
      }

      if (callback) {
        return callback.call(this, prevState, this.props)
      }
    }
  },

  forceRefresh: {
    value: async function() {
      if (this.render && typeof this.render === 'function') {
        const children = await this.render()
        await redom(this, children)
        await events.trigger(this, events.type.onRenderComplete)
      }
    }
  },

  /**
   * Private properties and methods
   */
  $$__type: {
    value: freshType.element
  },

  $$__state: {
    configurable: true,
    value: Object.freeze({})
  }
})

/**
 * Mostly truly private methods
 */
const parseSetStateArguments = (...args) => {
  if (args.length > 2) {
    throw new Error(
      `Invalid number of arguments passed to setState. Expected a maximum of 3 but received: ${
        args.length
      }.`
    )
  }

  const result = {
    state: {},
    shouldRender: false,
    callback: undefined
  }

  // The first item is always the new state
  result.state = args[0]

  // The second item can either be:
  //  a callback function or
  //  a boolean to re-render the component
  const additionalArgs = args.slice(1)
  for (let i of additionalArgs) {
    Object.assign(result.state, parseSetStateAdditionalArgument(i))
  }

  return result
}

const parseSetStateAdditionalArgument = arg => {
  if (typeof arg === 'function') {
    return { callback: arg }
  }

  if (typeof arg === 'boolean') {
    return { shouldRender: arg }
  }

  throw new Error(
    `Invalid argument passed to setState. Expected a callback function or boolean to indicate a re-render. Instead received: "${typeof arg}"`
  )
}

const clone = (obj, ...additionalObjects) =>
  Object.assign({}, obj, ...additionalObjects)

const createProps = (inst, props) => {
  inst.props = Object.freeze(props)
  return inst
}

const define = (ctor, props = {}) => {
  registry.define(ctor.tag, ctor)
  return inst => createProps(inst, props)
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
    Object.getOwnPropertyDescriptors(FreshElement.prototype)
  )

  return Element
}

export default Fresh()
