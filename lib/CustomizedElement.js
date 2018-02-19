import render from './render'
import events from './events'
import ElementFactory from './ElementFactory'
import DOMInterface from './dom/DOMInterface'

const TYPE = Symbol('fresh.element')

const verifyElementDefinition = ({name, elementExtends, target}) => {
  if (!ElementFactory.get(name)) {
    ElementFactory.define({ name, elementExtends, target })
  }
  if (elementExtends) {
    return document.createElement(elementExtends, { is: name })
  }
}

const initFreshElement = element => {
  element.$$__typeof = TYPE
  element.isAttached = false
  element.store = {}
  element.props = {}
  return element
}

const constructCustomizedBuiltIn = ({ name, elementExtends, target }) => {
  // const Element = ElementFactory.get(name) || ElementFactory.define({
  //   name: name,
  //   elementExtends,
  //   target: target
  // })
  // const customElementInstance = Reflect.construct(HTMLElement, [], target)
  // const inst = initFreshElement(Element)
  // const inst = Reflect.construct(HTMLElement, [], target)
  // const inst = document.createElement(elementExtends, {is: name})
  // return initFreshElement(inst)
  // window.$$__freshStore[name]
  // return new Element()

  // return initFreshElement(customElementInstance)
}

export default Element = args => {
  const { name, elementExtends } = parseArgs(args)

  const HTMLInterface = (DOMInterface[elementExtends] || HTMLElement)
  
  return class FreshElement extends HTMLInterface {
    constructor(props) {
      if (elementExtends) {
        const Element = ElementFactory.get(name) || ElementFactory.define({
          name: name,
          elementExtends,
          target: new.target
        })
        return constructCustomizedBuiltIn({name, elementExtends, new.target})
      }
      super()
      initFreshElement(this)
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
}

const parseArgs = args => {
  if (typeof args === 'object') {
    return { name: args.name, elementExtends: args.extends }
  }
  return { name: args }
}
