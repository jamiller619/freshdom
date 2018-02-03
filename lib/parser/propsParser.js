import attachStore from '../store/attachStore'
import customElementsLib from '../customElementsLib'

const propsParser = (element, props = {}) => {
  const isObject = typeof element === 'object'
  const nodeAttrs = isObject ? element.attributes : {}
  const attr = Object.assign({}, props, nodeAttrs)
  const isSVG = element instanceof SVGElement

  if (attr.class || attr.className) {
    const className = attr.class || attr.className
    if (attr.className) {
      console.warn(`oh please dear god use "class"`)
    }
    if (typeof className === 'string') {
      element.setAttribute('class', className)
      delete props.class && delete props.className
      delete attr.class && delete attr.className
    } else {
      throw new Error(`Expected "string" but instead got ${ typeof attr.class }`)
    }
  }

  if (attr.id) {
    // TODO: Validate input
    element.id = attr.id
    delete attr.id
  }

  if (attr.style) {
    const styles = attr.style
    Object.keys(styles).map(prop => {
      const value = styles[prop]
      if (typeof value === 'number') {
        element.style[prop] = `${value}px`
      } else if (typeof value === 'string') {
        element.style[prop] = value
      } else {
        throw new Error(`Expected "number" or "string" but instead got "${ typeof value }"`)
      }
    })
  }

  if (props.store) {
    attachStore(element, props.store)
    delete attr.store && delete props.store
  }
  
  Object.keys(attr).forEach(prop => {
    const attrValue = attr[prop]
    if (attrValue && attrValue instanceof Attr) {
      element.setAttributeNode(attrValue)
    } else {
      element.setAttribute(prop, attr[prop])
    }
  })

  return element
}

export default propsParser
