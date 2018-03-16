import batchRender from './batchRender'
import events from './events'

const TYPE = Symbol('fresh.element')

const ElementBase = {
  $$__typeof: TYPE,

  async render() {
    events.trigger(this, {type: events.type.onBeforeRender})
    if (this.template) {
      await batchRender(this.template, this)
    }
    events.trigger(this, {type: events.type.onRender})
  },

  async onBeforeDetach() {
    await events.trigger(this, {type: events.type.onBeforeDetach})
    this.remove()
  }
}

const ElementLifecycle = {
  createdCallback() {
    events.trigger(this, {type: events.type.init})
  },

  async connectedCallback() {
    events.trigger(this, {type: events.type.onBeforeAttach})
    await this.render()
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

export default Object.assign({}, ElementBase, ElementLifecycle)
