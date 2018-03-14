import render from './dom/render'
import events from './dom/events'

const FRESH_TYPE = Symbol('fresh.dom')

export class Element extends HTMLElement {}

export default FreshElement = {
  $$__typeof: FRESH_TYPE,
  async render() {
    events.trigger(this, {type: events.type.onBeforeRender})
    if (this.template) {
      await render(this.template, this)
    }
    events.trigger(this, {type: events.type.onRender})
  },

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
    events.trigger(this, {type: events.type.onBeforeDetach})
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
