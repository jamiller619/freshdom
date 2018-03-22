import renderNode from './render'
import {eventTypes, trigger} from './events'

const TYPE = Symbol('fresh.element')

/**
 * Fresh instance base
 *
 * Adds additional properties and methods not related to the
 * Custom Elements lifecycle events API defined below
 */
const FreshBase = {
  $$__typeof: TYPE
}

Object.defineProperties(FreshBase, {
  isAttached: {
    writable: true,
    value: false
  }
})

/**
 * Custom Elements API
 * Only official API methods/implementation should reside here
 */
const CustomElementBase = {
  async connectedCallback() {
    await trigger(this, eventTypes.onBeforeAttach)
    await renderContent(this)
    this.isAttached = true
    trigger(this, eventTypes.onAttach)
  },

  disconnectedCallback() {
    this.isAttached = false
    trigger(this, eventTypes.onDetach)
  },

  attributeChangedCallback(...args) {
    trigger(this, eventTypes.onUpdate, ...args)
  }
}

/**
 * Static Base
 */
Object.defineProperty(CustomElementBase.constructor, 'observedAttributes', {
  value: []
})

/**
 * @void Base Renderer
 *
 * Renders and assigns value of the `content`
 * property on the element.
 *
 * Defined outside Base for privacy,
 * for whatever that's worth.
 * 
 * @param {CustomElementBase} context: `this` context
 *
 * @async
 */
const renderContent = async context => {
  await trigger(context, eventTypes.onBeforeRender)
  if (context.render && typeof context.render === 'function') {
    await renderNode(context.render.call(context), context)
  }
  trigger(context, eventTypes.render)
}

export default Object.assign({}, FreshBase, CustomElementBase)
