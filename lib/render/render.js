import EVENTS from './html/events.js'
import ATTRIBUTES from './html/attributes.js'
import NODES from './html/nodes.js'

export default render = (nodeName, props = {}, ...children) => {
  if (props === null) {
    props = {}
  }
  
  if (typeof nodeName === 'function') {
    return new nodeName(props).dom
  }

  // Custom elements won't be in the HTML_NODES array
  const node = nodeName
  // const node = nodeName
  const object = typeof node === 'object'
  const localAttrs = object ? node.attributes || {} : {}
  const attrs = Object.assign({}, ATTRIBUTES, localAttrs)
  const nodeType = object ? node.name : node;
  const el = document.createElement(nodeType)
  Object.keys(props).map(prop => {
    if (prop in attrs) {
      el.setAttribute(attrs[prop], props[prop])
    }
    if (prop in EVENTS) {
      el.addEventListener(EVENTS[prop], props[prop])
    }
  })
  if ('style' in props) {
    const styles = props.style
    Object.keys(styles).map(prop => {
      const value = styles[prop]
      if (typeof value === 'number') {
        el.style[prop] = `${value}px`
      } else if (typeof value === 'string') {
        el.style[prop] = value
      } else {
        throw new Error(`Expected "number" or "string" but instead got "${typeof value}"`)
      }
    })
  }
  children.map(childNode => {
    if (typeof childNode === 'object' && childNode instanceof HTMLElement) {
      el.appendChild(childNode)
    } else if (typeof childNode === 'string' || typeof childNode === 'number') {
      el.appendChild(document.createTextNode(childNode))
    } else {
      throw new Error(`Expected "object" or "string" but instead got "${typeof value}"`)
    }
  })
  return el
}
