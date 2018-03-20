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
  $$__typeof: TYPE,
  isAttached: false
}

/**
 * Custom Elements API
 * Only official API methods/implementation should reside here
 */
const CustomElementBase = {
  constructor() {},

  async connectedCallback() {
    await trigger(this, eventTypes.onBeforeAttach)
    renderContext(this)
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
 * Base Renderer: Renders and merge new view state context. 
 * Defined outside Base to keep private
 *
 * @async
 */
const renderContext = async context => {
  await trigger(context, eventTypes.onBeforeRender)
  if (context.render && typeof context.render === 'function') {
    await renderNode(context.render.call(this), context)
  }
  trigger(context, eventTypes.render)
}

export default Object.assign({}, FreshBase, CustomElementBase)
