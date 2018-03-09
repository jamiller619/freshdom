import htmlAttributes from './types/htmlAttributes'
import ElementTypes from './ElementTypes'

export default mergePropsToDOM = ({ domContainer, props = {} }) => {
  const {node, type} = domContainer
  const nodeAttributes = copyNodeAttributes(node)

  // Concat (or merge instead of Object.assign) string value attributes
  const combinedAttributes = [nodeAttributes, props]
  const mergedClassNames = mergeStringKeys(['class', 'className'], combinedAttributes)
  const mergedStyle = mergeStringKeys(['style'], combinedAttributes, ';')

  // Merge our attribute objects
  const mergedProps = Object.assign({}, nodeAttributes, props, {
    class: mergedClassNames,
    style: mergedStyle
  })

  // No need to account for the countless SVG
  // attributes, so stop now and return
  if (domContainer.type === ElementTypes.SVG) {
    return {
      type: domContainer.type,
      node: setNodeAttributes(domContainer.node, mergedProps)
    }
  }

  const validAttributes = filterValidProps(mergedProps)

  return {
    type: domContainer.type,
    node: setNodeAttributes(node, validAttributes)
  }
}

const mergeStringKeys = (stringKeys, attributes) => {
  return attributes.map(group => {
    return stringKeys.map(key => group[key]).filter(val => val).join()
  }).join(' ').trim()
}

// Filters props to only valid HTML attributes
const filterValidProps = props => {
  return Object.keys(props)
    .filter(key => htmlAttributes.includes(key) || key.includes('data-'))
    .reduce((obj, key) => {
      obj[key] = props[key]
      return obj
    }, {})
}

// Convert HTMLElement.attributes (NamedNodeList) to Map
const copyNodeAttributes = node => {
  const attributes = {}
  if (node.attributes) {
    Array.from(node.attributes).forEach(attr => {
      attributes[attr.name] = attr.value
    })
  }
  return attributes
}

const setNodeAttributes = (node, attributes) => {
  Object.keys(attributes).filter(k => attributes[k]).map(p => {
    node.setAttribute(p, attributes[p])
  })
  return node
}
