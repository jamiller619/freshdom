import attachStore from '../store/attachStore'

const parseProps = (el, props = {}) => {
  const isObject = typeof el === 'object'
  const nodeAttrs = isObject ? el.attributes : {}
  const attr = Object.assign({}, props, nodeAttrs)
  const isSVG = el instanceof SVGElement

  if (attr.class || attr.className) {
    const className = attr.class || attr.className
    if (typeof className === 'string') {
      el.setAttribute('class', className)
      delete props.class && delete props.className
      delete attr.class && delete attr.className
    } else {
      throw new Error(`Expected "string" but instead got ${ typeof attr.class }`)
    }
  }

  if (attr.id) {
    // TODO: Validate input
    el.id = attr.id
    delete attr.id
  }

  if (attr.style) {
    const styles = attr.style
    Object.keys(styles).map(prop => {
      const value = styles[prop]
      if (typeof value === 'number') {
        el.style[prop] = `${value}px`
      } else if (typeof value === 'string') {
        el.style[prop] = value
      } else {
        throw new Error(`Expected "number" or "string" but instead got "${ typeof value }"`)
      }
    })
  }

  if (props.store) {
    attachStore(el, props.store)
    delete attr.store && delete props.store
  }

  Object.keys(attr).forEach(prop => {
    el.setAttribute(prop, attr[prop])
  })

  return el
}

export default parseProps
