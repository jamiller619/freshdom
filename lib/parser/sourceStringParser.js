import Element from '../element'
import customElementsLib from '../customElementsLib'
import svgNodes from './html/svg'

const sourceStringParser = (sourceString, props = {}) => {
  const nodeType = typeof sourceString === 'object' ? sourceString.name : sourceString

  if (typeof sourceString === 'function') {
    return new nodeType(props)
  } else if (typeof sourceString === 'string' && sourceString.includes('-')) {
    const customElement = customElementsLib.create({ target: sourceString, params: props })
    return customElement
    // return new customElement(props)
  } else if (nodeType === 'template') {

    return document.createDocumentFragment()

  } else if (svgNodes.includes(nodeType)) {

    return document.createElementNS('http://www.w3.org/2000/svg', nodeType)

  } //else if (typeof nodeType === 'string' && nodeType.includes('-')) {

  //   // const el = customElements.get(nodeType)
  //   // return new el(props)
  //   return customElementsLib.create({ target: nodeType, params: props })
  // }

  return document.createElement(nodeType)
}

export default sourceStringParser
