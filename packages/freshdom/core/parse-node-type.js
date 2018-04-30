import { FreshElement } from 'freshdom-utils'

import XMLNamespace from './types/xml-namespaces'
import SVGNodes from './types/svg-nodes'
import HTMLNodes from './types/html-nodes'
import { isElement } from './types/is-html'

const returnSelf = res => res

const NodeTypes = {
  Element: node => {
    if (isElement(node)) {
      return () => node
    }
  },

  Func: node => {
    if (typeof node === 'function') {
      return props => FreshElement(node, props)
    }
  },

  Text: node => {
    if (typeof node === 'string' || typeof node === 'number') {
      if (SVGNodes.includes(node)) {
        return () => document.createElementNS(XMLNamespace.SVG, node)
      }

      if (HTMLNodes.includes(node)) {
        return () => document.createElement(node)
      }

      return () => document.createTextNode(node)
    }
  },

  Array: node => {
    if (Array.isArray(node) || node instanceof HTMLCollection || node instanceof NodeList) {
      return () => {
        const container = document.createDocumentFragment()
        container.append(...node)
        return container
      }
    }
  }
}

const parseType = type => {
  let result = false
  Object.values(NodeTypes).forEach(checkType => {
    if (result === false) {
      result = checkType(type) || false
    }
  })
  return result || returnSelf
}

const parse = (type, props = {}) => {
  const node = parseType(type)(props)

  if (!isElement(node)) {
    return parse(node, props)
  }

  return node
}

export default parse
