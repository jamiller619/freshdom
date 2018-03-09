import polyfill from './helpers/polyfill'
import render from './render'
import events from './events'
import DOMInterface from './dom/DOMInterface'

const TYPE = Symbol('fresh.element')

const defineProps = inst => Object.defineProperty(inst, 'props', {
  value: inst.props && typeof inst.props === 'object' ? inst.props : {},
  writable: false,
  configurable: false,
  enumerable: false
})

const defineState = inst => (inst => {
  // Is there any benefit to creating an object without
  // a prototype? This used to be "const localState = {}"
  const localState = Object.create(null)
  Object.defineProperties(inst, {
    setState: {
      writable: false,
      configurable: false,
      enumerable: false,
      value: function(state) {
        Object.assign(localState, state)
      }
    },
    state: {
      configurable: false,
      enumerable: false,
      get() {
        return localState
      }
    }
  })
})(inst)

const FreshElementProps = {
  render: {
    async value() {
      events.trigger(this, {type: events.type.onBeforeRender})
      if (this.template) {
        await render(this.template, this)
      }
      events.trigger(this, {type: events.type.onRender})
    }
  },

  createdCallback: {
    value() {
      typeof this.onCreate === 'function' && this.onCreate()
    }
  },

  connectedCallback: {
    async value() {
      events.trigger(this, {type: events.type.onBeforeAttach})
      await this.render()
      this.isAttached = true
      events.trigger(this, {type: events.type.onAttach})
    }
  },

  disconnectedCallback: {
    value() {
      this.isAttached = false
      events.trigger(this, {type: events.type.onDetach})
    }
  },

  attributeChangedCallback: {
    value(...args) {
      const evt = {
        type: events.type.onUpdate,
        args: args
      }
      events.trigger(this, evt)
    }
  }
}

export default extendsElement => {
  const HTMLInterface = (extendsElement && DOMInterface[extendsElement]) || HTMLElement
  
  const FreshElement = function FreshElement(inst) {
    inst = (inst || this)
    defineProps(inst)
    defineState(inst)
    return inst
  }

  FreshElement.prototype = Object.create(HTMLInterface.prototype, FreshElementProps)

  return FreshElement
}
