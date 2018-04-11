import {createInstance} from 'freshdom-utils'

import domNamespaces from './types/dom-namespaces'
import svgNodeNames from './types/svg-node-names'
import htmlNodeNames from './types/html-node-names'
import htmlAttributes from './types/html-attributes'

/**
 * Creates a DOM node
 *
 * @param {string|Function} type: Either a string representing the element's tag name, or a function
 * @param {Object} props
 * @param {...createElement} children
 * @return {HTMLElement}
 */
export default (type, props, ...children) => {
  props = props || {}

  if (svgNodeNames.includes(type)) {
    props.namespace = domNamespaces.svg
  }

  const element = setNodeAttributes(createNode(type, props), props)

  children.forEach(childNode => {
    element.appendChild(createNode(childNode))
  })

  return element
}

const NodeTypes = {}

NodeTypes.element = {
  check: node => node instanceof HTMLElement || node instanceof SVGElement,
  parse: node => node
}

NodeTypes.func = {
  check: node => typeof node === 'function',
  parse: (node, props) => createInstance(node, props)
}

NodeTypes.array = {
  check: node => Array.isArray(node),
  parse: nodes => {
    const container = document.createDocumentFragment()
    return nodes.reduce((acc, curr) => {
      acc.appendChild(createNode(curr))
      return acc
    }, container)
  }
}

NodeTypes.text = {
  check: node => typeof node === 'string' || typeof node === 'number',
  parse: (node, props = {}) => {
    if (props.namespace) {
      return document.createElementNS(props.namespace, node)
    }

    if (htmlNodeNames.includes(node)) {
      return document.createElement(node)
    }

    return document.createTextNode(node)  
  }
}

/**
 * Creates an HTML node
 *
 * @param {string|Function} type: Either a string representing an element's tag name, or a function
 * @param {Object} props
 * @return {HTMLElement}
 */
const createNode = (nodeType, props) => {
  const type = Object.values(NodeTypes).find(({check}) => check(nodeType) === true)
  if (type) {
    return type.parse(nodeType, props)
  }
}

/**
 * Filters a `prop` object for valid HTML attributes and sets them on a node
 *
 * @param {HTMLElement} node
 * @param {Object} props
 * @return {HTMLElement}
 */
const setNodeAttributes = (node, props) => {
  if ('namespace' in props) {
    delete props.namespace
    Object.keys(props).map(key => node.setAttribute(key, props[key]))
    return node
  }

  filterEventAttributes(props).forEach(event => {
    node.addEventListener(event, props[event])
  })

  filterNodeAttributes(props).forEach(attr => {
    setNodeAttribute(node, attr, props[attr])
  })

  return node
}

/**
 * Sets a single attribute on a node
 *
 * @param {HTMLElement} node
 * @param {Object} attribute
 */
const setNodeAttribute = (node, key, value) => {
  switch (key) {
    case 'className':
      node.setAttribute('class', value)
      return
    case 'style':
      if (typeof value === 'object') {
        Object.assign(node.style, value)
        return
      }
  }

  if (value === true) {
    node.setAttribute(key, '')
  } else if (value !== false && value !== null) {
    node.setAttribute(key, value)
  }
}

/**
 * Determines the validity of a single attribute
 *
 * @param {string} attribute
 * @return {bool}
 */
const isValidAttribute = attribute => 
  htmlAttributes.includes(attribute) || attribute.includes('data-')

/**
 * Filters a collection of attributes for validity
 *
 * @param {string} attributes
 * @return {Array} List of valid attributes
 */
const filterNodeAttributes = attributes =>
  Object.keys(attributes).filter(key => isValidAttribute(key))

/**
 * Filters a collection of attributes for event handlers
 *
 * @param {string} attributes
 * @return {Array} List of valid event handlers
 */
const filterEventAttributes = attributes => {
  return Object.keys(attributes).filter(attr => attr.startsWith('on') && attr !== 'on')
}
