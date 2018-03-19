import transpose from './transpose'
import events from './events'

const TYPE = Symbol('fresh.element')

async function render() {
  await events.trigger(this, {type: events.type.onBeforeRender})
  if (this.template) {
    await transpose(this.template, this)
  }
  events.trigger(this, {type: events.type.onRender})
}

/**
 * The base Fresh object
 *
 * Adds additional properties and methods not related to the
 * Custom Elements lifecycle events API
 */
const FreshBase = {
  $$__typeof: TYPE,

  async $$__render() {
    await render.call(this)
  }
}

/**
 * The Custom Elements base object with methods defined by the Custom Elements API
 */
const CustomElementBase = {
  createdCallback() {
    events.trigger(this, {type: events.type.init})
  },

  async connectedCallback() {
    await events.trigger(this, {type: events.type.onBeforeAttach})
    await render.call(this)
    this.isAttached = true
    events.trigger(this, {type: events.type.onAttach})
  },

  disconnectedCallback() {
    this.isAttached = false
    events.trigger(this, {type: events.type.onDetach})
  },

  attributeChangedCallback(...args) {
    const evt = {
      type: events.type.onUpdate,
      args: args
    }
    events.trigger(this, evt)
  }
}

export default Object.assign({}, FreshBase, CustomElementBase)
