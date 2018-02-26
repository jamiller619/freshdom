import FreshStore from '../FreshStore'
import svgNodeTypes from './types/svgNodes'
import isDefined from '../helpers/isDefined'

const createFunctionalElement = (Element, props) => {
  try {
    if (Element.$$__extends) {
      return document.createElement(
        Element.$$__extends, {
          is: Element.$$__name
        }
      )
    }

    if (Element.$$__name) {
      return document.createElement(Element.$$__name)
    }

    return Element(props)

  } catch (e) {
    throw new Error(
      `Error creating Element "${Element.$$__name}"
       Make certain you're extending Fresh.Element correctly!
       Error: ${e}`
    )
  }
}

const createDOMElement = ({name, props = {}}) => {
  if (typeof name === 'function') {
    /**
     *  Functional or Class Element
     */
    return createFunctionalElement(name, props)
  } else if (typeof name === 'string' && name.includes('-')) {
    /**
     *  Autonomous or Customized built-in Element
     */
    return FreshStore.get(name)
  } else if (svgNodeTypes.includes(name)) {
    /**
     *  SVG
     */
    return document.createElementNS('http://www.w3.org/2000/svg', name)
  }

  /**
   *  All others
   */
  return document.createElement(name)
}

export default createDOMElement
