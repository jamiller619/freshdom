import FreshStore from '../FreshStore'
import FreshInstance from '../FreshInstance'
import svgNodeTypes from './types/svgNodes'
import ElementTypes from './ElementTypes'

/**
 * TODO: Add Schema Validator
 */
const createDOMElement = ({name, props = {}}) => {
  if (typeof name === 'function') {
    /**
     *  Functional Element
     */
    return {
      type: ElementTypes.FRESH_ELEMENT,
      node: FreshInstance.create(name, props)
    }
  } else if (typeof name === 'string' && name.includes('-')) {
    /**
     *  Autonomous or Customized Built-In Element
     */
    return {
      type: ElementTypes.CUSTOM_ELEMENT,
      node: FreshStore.get(name)
    }
  } else if (svgNodeTypes.includes(name)) {
    /**
     *  SVG
     */
    return {
      type: ElementTypes.SVG,
      node: document.createElementNS('http://www.w3.org/2000/svg', name)
    }
  }

  /**
   *  All others
   */
  return {
    type: ElementTypes.DEFAULT,
    node: document.createElement(name, { props })
  }
}

export default createDOMElement
