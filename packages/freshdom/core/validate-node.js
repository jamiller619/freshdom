import { FreshElement } from 'freshdom-utils'

import XMLNamespace from './types/xml-namespaces'
import SVGNodes from './types/svg-nodes'
import HTMLNodes from './types/html-nodes'
import { isElement } from './types/is-html'

const validators = [
  {
    // HTML/SVG Element
    check: node => isElement(node),
    parse: node => node
  },
  {
    // Function
    check: node => typeof node === 'function',
    parse: (node, props) => FreshElement(node, props)
  },
  {
    // Text
    check: node => typeof node === 'string' || typeof node === 'number',
    parse: node => {
      if (SVGNodes.includes(node)) {
        return document.createElementNS(XMLNamespace.SVG, node)
      }

      if (HTMLNodes.includes(node)) {
        return document.createElement(node)
      }

      return document.createTextNode(node)
    }
  },
  {
    // Array
    check: node =>
      Array.isArray(node) ||
      node instanceof HTMLCollection ||
      node instanceof NodeList,
    parse: nodes => {
      return nodes.map(node => {
        if (isElement(node)) {
          return node
        }
      })
    }
  }
]

export default (type, props) => {
  const index = validators.findIndex(validator =>
    validator.check(type)
  )

  if (index >= 0) {
    return validators[index].parse(type, props)
  } else {
    console.dir(type)
    throw new Error(
      `Couldn't create element. Expected either a valid HTML element name, an Array or a Function, but instead received: "${typeof type}"`
    )
  }
}
