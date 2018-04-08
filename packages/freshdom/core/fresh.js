import reconcile from './reconciler'
import events from './events'
import registry from './registry'
import createState from './create-state'

const FreshElement = function FreshElement() {}

FreshElement.$$__type = Symbol('fresh.element')

FreshElement.prototype.connectedCallback = async function() {
  await events.trigger(this, events.type.onBeforeAttach)
  await this.forceUpdate()
  this.isAttached = true
  await events.trigger(this, events.type.onAttach)
}

FreshElement.prototype.disconnectedCallback = function() {
  this.isAttached = false
  events.trigger(this, events.type.onDetach)
}

FreshElement.prototype.attributeChangedCallback = function() {
  this.forceUpdate()
}

FreshElement.prototype.forceUpdate = async function() {
  if (this.render && typeof this.render === 'function') {
    await reconcile(this.render(), this)
  }
}

const createProps = props => Object.freeze(props)

const elementInterface = HTMLInterface => {
  class Element extends HTMLInterface {
    constructor(props = {}) {
      registry.define(new.target.tagName, new.target)
      super()
      this.props = createProps(props)
    }
  }

  Object.defineProperties(
    createState(Element.prototype),
    Object.getOwnPropertyDescriptors(FreshElement.prototype)
  )

  return Element
}

export default elementInterface(HTMLElement)
