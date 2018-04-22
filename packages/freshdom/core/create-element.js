import parseNodeType from './parse-node-type'

import HTMLAttributes from './types/html-attributes'
import SVGAttributes from './types/svg-attributes'

/**
 * Creates a DOM node
 *
 * @param {string|Function} type: Either a string representing the element's tag name, or a function
 * @param {Object} props
 * @param {...createElement} children
 * @return {HTMLElement}
 */
// export default (type, props, ...children) => {

// }

export default (type, props, ...children) => {
  props = props || {}

  props.children = Object.freeze(...children)

  return appendChildren(
    setNodeAttributes(parseNodeType(type, props), props),
    ...children
  )
}

const appendChildren = (host, ...children) => {
  if (children.length === 0) {
    return host
  }

  // const freshChildNodes = children.filter(node => node.$$__type && node.$$__type === freshType.element)
  const childNodes = children.map(childNode => parseNodeType(childNode))

  host.append(...childNodes)

  return host
}

/**
 * Filters a `prop` object for valid HTML attributes and sets them on a node
 *
 * @param {HTMLElement} node
 * @param {Object} props
 * @return {HTMLElement}
 */
const setNodeAttributes = (node, props) => {
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
  let attributeKey = key

  if (key === 'className') {
    attributeKey = 'class'
  }

  if (typeof value === 'object') {
    Object.assign(node[attributeKey], value)
  }

  if (value === true) {
    node.setAttribute(attributeKey, '')
  } else if (value !== false && value !== null) {
    node.setAttribute(attributeKey, value)
  }
}

// Stayin' DRY
const objectFilter = (obj, filter) => Object.keys(obj).filter(filter)

/**
 * Determines the validity of a single attribute
 *
 * @param {string} attribute
 * @return {bool}
 */
const isValidAttribute = attribute =>
  HTMLAttributes.includes(attribute) ||
  attribute.includes('data-') ||
  SVGAttributes.includes(attribute)

/**
 * Filters a collection of attributes for validity
 *
 * @param {string} attributes
 * @return {Array} List of valid attributes
 */
const filterNodeAttributes = attributes =>
  objectFilter(attributes, key => isValidAttribute(key))

/**
 * Filters a collection of attributes for event handlers
 *
 * @param {string} attributes
 * @return {Array} List of valid event handlers
 */
const filterEventAttributes = attributes =>
  objectFilter(attributes, attr => attr.startsWith('on') && attr !== 'on')
