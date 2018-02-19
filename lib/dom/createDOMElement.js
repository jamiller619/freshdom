import ElementFactory from '../ElementFactory'
import svgNodeTypes from './types/svgNodes'
import isDefined from '../helpers/isDefined'

const createDOMElement = ({ type, props = {} }) => {
  if (typeof type === 'function') {
    /**
     *  Functional or Class Element
     */
    try {
      return type(props)
    } catch (e) {
      return new type(props)
    }

    throw new Error(`Error rendering Element: ${type}`)

  } else if (typeof type === 'string' && type.includes('-') || isDefined(props.is)) {
    /**
     *  Autonomous or Customized built-in Element
     */
    return ElementFactory.get(type)
    
  } else if (svgNodeTypes.includes(type)) {
    /**
     *  SVG
     */
    return document.createElementNS('http://www.w3.org/2000/svg', type)
  }

  /**
   *  All others
   */
  return document.createElement(type)
}

export default createDOMElement
