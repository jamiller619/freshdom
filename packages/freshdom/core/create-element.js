import { isFreshElement } from 'freshdom-utils'

import validateNode from './validate-node'
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
export default (type, props, ...children) => {
  props = props || {}

  if (
    children.length === 1 &&
    Array.isArray(children[0]) &&
    children[0].length > 0
  ) {
    children = children[0]
  }

  props.children = children

  const element = setNodeAttributes(validateNode(type, props), props)

  /**
   * If the newly created element is a Fresh element, we delegate
   * the responsibility of rendering its children to the component,
   * so return it now before attaching any child nodes.
   */
  if (isFreshElement(element)) {
    return element
  }

  element.append(...children.map(childNode => validateNode(childNode)))

  return element
}

const normalizeEventName = eventName =>
  eventName.replace('on', '').toLowerCase()

/**
 * Filters a `prop` object for valid HTML attributes and sets them on a node
 *
 * @param {HTMLElement} node
 * @param {Object} props
 * @return {HTMLElement}
 */
const setNodeAttributes = (node, props) => {
  filterEventAttributes(props).forEach(event => {
    node.addEventListener(normalizeEventName(event), props[event])
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
