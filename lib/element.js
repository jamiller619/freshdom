import render from './render'
import events from './events'

const TYPE = Symbol('fresh.element')

export default class Fresh extends HTMLElement {
  constructor(props) {
    super()
    this.$$__typeof = TYPE
    this.isAttached = false
    this.store = {}
    this.props = props || {}
  }

  async render () {
    events.trigger(this, { type: events.type.onBeforeRender })
    await render(this.template, this)
    events.trigger(this, { type: events.type.onRender })
  }

  async connectedCallback () {
    events.trigger(this, { type: events.type.onBeforeAttach })
    await this.render()
    this.isAttached = true
    events.trigger(this, { type: events.type.onAttach })
  }

  disconnectedCallback () {
    this.isAttached = false
    events.trigger(this, { type: events.type.onDetach })
  }

  adoptedCallback(...args) {
    events.trigger(this, { type: events.type.onAdopt })
  }

  attributeChangedCallback (...args) {
    const evt = {
      type: events.type.onUpdate,
      args: args
    }
    events.trigger(this, evt)
  }
}
