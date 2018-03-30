import isDefined from '../helpers/isDefined'
import HTMLAttributes from '../types/HTMLAttributes'
import SVGNodeTypes from '../types/SVGNodes'
import ElementTypes from '../types/Elements'

/**
 * Creates an HTMLElement as the entry point for JSX rendering
 *
 * @param {string|Function} type: This will be either a string representing the element's tag name, or a function
 * @param {Object} props: Props object parameters
 * @param {...childNodes} children: Child nodes to be constructed alongside the parent. These will typically be other calls to this function.
 * @return {HTMLElement} The HTMLElement node
 */
export default (type, props = {}, ...children) => {
  if (props === null) {
    props = {}
  }

  const dom = new DOMRenderer(type, props)
    .mergeProps(props)
    .appendChildren(...children)

  return dom.node
}

/**
 * The Renderer
 *
 * @param {string|Function} type: This will be either a string representing the element's tag name, or a function
 * @param {Object} props: Props object parameters
 * @param {...Function} children: Child nodes to be constructed within the parent. These will typically be recursive calls to this function.
 * @return {HTMLElement} The HTMLElement node
 */
const DOMRenderer = function(type, props) {
  const container = parseNodeType(type, props)
  this.type = container.type
  this.node = container.node
}

DOMRenderer.prototype = {
  /**
   * Normalizes JSX props passed to an element.
   * The resulting element will only have valid props assigned in its attributes collection.
   *
   * @param {Object} props: The props object to render
   * @return {this}
   */
  mergeProps(props = {}) {
    const nodeAttr = createAttrMap(this.node)

    // Concat or merge (instead of Object.assign) string value attributes
    const attrList = nodeAttr ? [nodeAttr, props] : [props]
    const mergedClassNames = concatStringAttr(['class', 'className'], attrList)
    const mergedStyles = concatStringAttr(['style'], attrList, ';')

    // Merge newly created string attributes
    const mergedAttrList = Object.assign({}, nodeAttr, props, {
      class: mergedClassNames,
      style: mergedStyles
    })

    // No need to account for the countless SVG
    // attributes, so stop now and return
    const finalAttrList =
      this.type === ElementTypes.SVG
        ? mergedAttrList
        : validateNodeAttr(mergedAttrList)

    setNodeAttr(this.node, finalAttrList)

    return this.setProps(props)
  },

  setProps(props) {
    props = props || {}
    Object.defineProperty(this.node, 'props', {
      writable: true,
      value: props
    })
    return this
  },

  /**
   * Validate and render children of the root node
   *
   * @param {...function} children
   * @return {this}
   */
  appendChildren(...children) {
    children
      .filter(childNode => isDefined(childNode))
      .forEach(childNode => renderChildNode(childNode, this.node))
    return this
  }
}

/**
 * Normalizes the "type" parameter
 *
 * @param {string|Function} type: Either a string representing the element's tag name, or a function
 * @param {Object} props: Props object parameters
 * @return {Object} Returns an object with type and node properties
 */
const parseNodeType = (type, props) => {
  // Element type: Functional
  if (typeof type === 'function') {
    return container(ElementTypes.FRESH, createInstance(type, props))
  }

  // Element type: Autonomous or customized built-in
  if (typeof type === 'string' && type.includes('-')) {
    const customElement =
      window.customElements.get(type) || document.createElement(type)
    return container(ElementTypes.CUSTOM, customElement)
  }

  // Element type: SVG
  if (SVGNodeTypes.includes(type)) {
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', type)
    return container(ElementTypes.SVG, svgNode)
  }

  // Element type: All others...
  return container(ElementTypes.DEFAULT, document.createElement(type))
}

/**
 * Small helper to more easily use named parameters
 *
 * @return {Object} Returns an object with type and node properties
 */
const container = (type, node) => {
  return {type, node}
}

const renderChildNode = (childNode, container) => {
  if (childNode instanceof HTMLElement || childNode instanceof SVGElement) {
    container.appendChild(childNode)
    return container
  } else if (typeof childNode === 'function') {
    container.appendChild(createInstance(childNode))
    return container
  } else if (Array.isArray(childNode)) {
    childNode.forEach(childOfChild => container.appendChild(childOfChild))
    return container
  } else if (typeof childNode === 'string' || typeof childNode === 'number') {
    container.appendChild(document.createTextNode(childNode))
    return container
  } else {
    throw new Error(
      `Expected "object" or "string" but instead got ${typeof childNode}`
    )
  }
}

/**
 * Attempts to create an HTMLElement instance from the given function.
 *
 * @param {Function} func The function we're using to create the element.
 * @param {Object} props The props being passed to the element.
 * @return {HTMLElement}
 */
const createInstance = (func, ...props) => {
  try {
    return func(...props)
    // return new (func(...props))()
  } catch (e) {
    try {
      return new func(...props)
    } catch (e) {
      throw new Error(`Unable to create element instance: ${e}`)
    }
  }
}

/**
 * Concatenates strings from multiple keys within multiple objects
 *
 * @param {string[]} attrNameList: The array of keys to combine
 * @param {Object[]} attrMap: Object map of key value pairs
 * @return {string} A single string
 */
const concatStringAttr = (attrNameList, attrMap) => {
  return attrMap
    .map(group => {
      return attrNameList
        .map(key => group[key])
        .filter(val => val)
        .join()
    })
    .join(' ')
    .trim()
}

/**
 * Filters an array of attributes to contain only valid HTML attributes.
 * This will remove ALL props originally sent to the element, unless the
 * prop key used was a valid attribute, i.e. "name" would be preserved.
 *
 * @param {string[]} attrMap: object map of key value pairs
 * @return {string[]} Returns an object map containing only valid attributes
 */
const validateNodeAttr = attrMap => {
  return Object.keys(attrMap)
    .filter(key => HTMLAttributes.includes(key) || key.includes('data-'))
    .reduce((obj, key) => {
      obj[key] = attrMap[key]
      return obj
    }, {})
}

/**
 * Converts NamedNodeList to object map
 *
 * @param {HTMLElement} node: The node to get attributes from
 * @return {Object} An object map of key value pairs
 */
const createAttrMap = node => {
  return (
    node.attributes &&
    Array.from(node.attributes).reduce((acc, cur, i) => {
      acc[cur.name] = cur.value
      return acc
    }, {})
  )
}

/**
 * Set an attribute on an element with validity check on
 * the attribute key/name
 *
 * @param {HTMLElement} node: The node to set the attribute on
 * @param {Object[]} attrList: Object map of key value pairs
 * @return {Object} An object map of key value pairs
 */
const setNodeAttr = (node, attrList) => {
  Object.keys(attrList)
    .filter(k => attrList[k])
    .map(p => {
      node.setAttribute(p, attrList[p])
    })
  return node
}
