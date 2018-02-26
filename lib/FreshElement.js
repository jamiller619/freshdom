import polyfill from './helpers/polyfill'
import render from './render'
import events from './events'
import DOMInterface from './dom/DOMInterface'

const TYPE = Symbol('fresh.element')

export default extendsElement => {
  const HTMLInterface = (extendsElement && DOMInterface[extendsElement]) || HTMLElement

  return class FreshElement extends HTMLInterface {
    createdCallback(props) {
      this.isAttached = false

      Object.defineProperties(this, {
        $$__typeof: {
          configurable: false,
          writable: false,
          value: TYPE
        },
        state: {
          configurable: true,
          enumerable: false,
          get: () => {
            return this.constructor.$$__state || {}
          }
        },
        store: {
          configurable: true,
          enumerable: false,
          value: {}
        },
        props: {
          configurable: true,
          enumerable: true,
          value: props || {}
        }
      })
    }

    setState(state) {
      this.constructor.$$__state = Object.assign(
        {},
        this.constructor.$$__state,
        state
      )
    }

    async render() {
      events.trigger(this, {type: events.type.onBeforeRender})
      if (this.template) {
        await render(this.template, this)
      }
      events.trigger(this, {type: events.type.onRender})
    }

    async connectedCallback() {
      events.trigger(this, {type: events.type.onBeforeAttach})
      await this.render()
      this.isAttached = true
      events.trigger(this, {type: events.type.onAttach})
    }

    disconnectedCallback() {
      this.isAttached = false
      events.trigger(this, {type: events.type.onDetach})
    }

    attributeChangedCallback(...args) {
      const evt = {
        type: events.type.onUpdate,
        args: args
      }
      events.trigger(this, evt)
    }
  }
}
