import render from './render'
import createInstance from './create-instance'
import initState from './init-state'
import merge from '../utils/merge'
import {eventTypes, trigger} from './events'

const TYPE = Symbol('fresh.element')

/**
 * Fresh instance base properties and methods
 */
const Base = {}
Object.defineProperties(Base, {
  $$__typeof: {
    value: TYPE
  },
  isInitialized: {
    writable: true,
    value: false
  },
  isAttached: {
    writable: true,
    value: false
  },
  connectedCallback: {
    value: async function() {
      renderOnAttach(this) 
    }
  },
  disconnectedCallback: {
    value: function() {
      this.isAttached = false
      trigger(this, eventTypes.onDetach)
    }
  },
  attributeChangedCallback: {
    value: function() {
      trigger(this, eventTypes.onUpdate, null, ...args)
    }
  }
})

const renderOnAttach = async inst => {
  await trigger(inst, eventTypes.onBeforeAttach)
  if ('template' in inst || 'render' in inst) {
    await render(inst.template || inst.render(), inst)
  }

  inst.isAttached = true

  trigger(inst, eventTypes.onAttach)
}

export const extend = (HTMLInterface, init) => {
  class HTMLBase extends HTMLInterface {
    constructor(props) {
      if (init) {
        console.dir(init)
        init.call(super(), init, props)
      }
      // createInstance.call(super(), init, props)
    }
  }
  merge(HTMLBase.prototype, Base)
  return HTMLBase
}

export default init => {
  return extend(HTMLElement, init)
}
