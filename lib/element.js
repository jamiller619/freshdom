import morphdom from 'morphdom'
import customElementsLib from './customElementsLib'
import {triggerCallback, eventType} from './events'
import render from './render'

export default class extends HTMLElement {
  constructor(props) {
    super()
    this.isAttached = false
    this.props = props
  }

  render() {
    triggerCallback(this, { eventType: eventType.onBeforeRender })
    render(this.template, this, false)
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
    const event = {
      eventType: eventType.attributeChangedCallback,
      args: args
    }
    triggerCallback(this, event)
  } 
}

// function CustomElement({ name: '', props = {} }) {
//   constructor(props) {
//     this.isAttached = false
//     this.props = props
//   }

//   render() {
//     triggerCallback(this, { eventType: eventType.onBeforeRender })
//     const customExtends = this.constructor.__is
//     const replaceRoot = customExtends !== undefined || false
//     render(this.template, this, replaceRoot)
//     triggerCallback(this, { eventType: eventType.onRender })
//   }

//   connectedCallback() {
//     triggerCallback(this, { eventType: eventType.onBeforeConnected })
//     this.render()
//     this.isAttached = true
//     triggerCallback(this, { eventType: eventType.onConnected })
//   }

//   disconnectedCallback() {
//     this.isAttached = false
//     triggerCallback(this, { eventType: eventType.onDisconnected })
//   }

//   adoptedCallback(...args) {
//     triggerCallback(this, { eventType: eventType.adoptedCallback })
//   }

//   attributeChangedCallback(...args) {
//     const event = {
//       eventType: eventType.attributeChangedCallback,
//       args: args
//     }
//     triggerCallback(this, event)
//   }
// }

// function Element() {
//   const target = new.target
//   const ElementClass = target.__is || HTMLElement

  

//   Object.setPrototypeOf(this.prototype, ElementClass.prototype)
//   Object.setPrototypeOf(this, ElementClass)

//   // this.prototype = Object.create(CustomElement.prototype)
//   // return Reflect.construct(this.prototype, [], this.constructor)

//   // Only thing ive found so far that "kinda" works
//   // this.prototype = Object.create(CustomElement.prototype)
//   // this.prototype.constructor = CustomElement
//   // return Reflect.construct(CustomElement, [], new.target) OR return Reflect.construct(ElementClass, [], new.target)
// }

// export default Element
