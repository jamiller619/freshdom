import isDefined from './helpers/isDefined'
import FreshElementStore from './FreshElementStore'
import {createInstance} from './FreshMaker'
import HTMLAttributes from './types/HTMLAttributes'
import SVGNodeTypes from './types/SVGNodes'
import ElementTypes from './types/Elements'

export default (type, props = {}, ...children) => {
  if (props === null) {
    props = {}
  }

  const dom = new DOMRenderer(type, props)
    .mergeProps(props)
    .appendChildren(...children)

  return dom.node
}

const container = (type, node) => {
  return {type, node}
}

const parseNodeType = (type, props) => {
  // Element type: Functional
  if (typeof type === 'function') {
    return container(ElementTypes.FRESH, createInstance(type, props))
  }

  // Element type: Autonomous or customized built-in
  if (typeof type === 'string' && type.includes('-')) {
    return container(ElementTypes.CUSTOM, FreshElementStore.get(type))
  }

  // Element type: SVG
  if (SVGNodeTypes.includes(type)) {
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', type)
    return container(ElementTypes.SVG, svgNode)
  }

  // Element type: All others...
  return container(ElementTypes.DEFAULT, document.createElement(type))
}

const DOMRenderer = function(type, props) {
  const container = parseNodeType(type, props)
  this.type = container.type
  this.node = container.node
}

DOMRenderer.prototype = {
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

    return this
  },

  appendChildren(...children) {
    children.filter(childNode => isDefined(childNode)).forEach(childNode => {
      if (childNode instanceof HTMLElement || childNode instanceof SVGElement) {
        this.node.appendChild(childNode)
      } else if (typeof childNode === 'function') {
        this.node.appendChild(createInstance(childNode))
      } else if (Array.isArray(childNode)) {
        childNode.forEach(childOfChild => this.node.appendChild(childOfChild))
      } else if (
        typeof childNode === 'string' ||
        typeof childNode === 'number'
      ) {
        this.node.appendChild(document.createTextNode(childNode))
      } else {
        throw new Error(
          `Expected "object" or "string" but instead got ${typeof childNode}`
        )
      }
    })
    return this
  }
}

const concatStringAttr = (attrNameList, attrCollection) => {
  return attrCollection
    .map(group => {
      return attrNameList
        .map(key => group[key])
        .filter(val => val)
        .join()
    })
    .join(' ')
    .trim()
}

// Filters attr list to only valid,
// non-internal, mostly non-props, HTML attributes
const validateNodeAttr = props => {
  return Object.keys(props)
    .filter(key => HTMLAttributes.includes(key) || key.includes('data-'))
    .reduce((obj, key) => {
      obj[key] = props[key]
      return obj
    }, {})
}

// Convert HTMLElement.attributes (NamedNodeList) to Object map
const createAttrMap = node => {
  return (
    node.attributes &&
    Array.from(node.attributes).reduce((acc, cur, i) => {
      acc[cur.name] = cur.value
      return acc
    }, {})
  )
}

const setNodeAttr = (node, attrList) => {
  Object.keys(attrList)
    .filter(k => attrList[k])
    .map(p => {
      node.setAttribute(p, attrList[p])
    })
  return node
}
