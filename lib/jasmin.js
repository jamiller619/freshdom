import morphdom from 'morphdom'
import { eventType, triggerCallback } from './events'
import defineElement from './defineElement'

const findTemplate = selector => {
  const template = document.querySelector(props)
  if (!template) {
    throw new Error(`Template cannot be null: using selector "${ props }"`)
  }
  return template
}

class Element extends HTMLElement {
  
  constructor(args) {
    defineElement(new.target)
    super()
    this.isAttached = false

    const argsType = typeof args
    if (argsType === 'string') {
      this.template = findTemplate(args)
    } else if (argsType === 'object') {
      this.props = args
    }
  }

  render() {
    triggerCallback(this, { eventType: eventType.onBeforeRender })
    morphdom(this, this.template, {
      childrenOnly: true
    })
    triggerCallback(this, { eventType: eventType.onRender })
  }

  connectedCallback() {
    triggerCallback(this, { eventType: eventType.onBeforeConnected })
    this.render()
    this.isAttached = true
    triggerCallback(this, { eventType: eventType.onConnected })
  }

  disconnectedCallback() {
    this.isAttached = false
    triggerCallback(this, { eventType: eventType.onDisconnected })
  }
  
  adoptedCallback(...args) {
    triggerCallback(this, { eventType: eventType.adoptedCallback })
  }
  
  attributeChangedCallback(...args) {
    triggerCallback(this, { 
      eventType: eventType.attributeChangedCallback,
      args: args
    })
  }
}

export default Element
