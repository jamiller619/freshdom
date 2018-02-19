
const mergePropsToDOM = ({ dom, props = {} }) => {
  const domAttributes = {}

  // Convert NamedNodeList (element.attributes) to Array
  Array.from(dom.attributes).forEach(attr => {
    domAttributes[attr.name] = attr.value
  })

  const attrs = {}

  if (domAttributes.class && (props.class || props.className)) {
    attrs.class = `${domAttributes.class} ${props.class || props.className}`
  }

  if (domAttributes.style && props.style) {
    const style = parseStyle(dom)
    attrs.style = Object.assign({}, style, props.style)
  }

  return dom
}

const parseStyle = dom => {
  const styles = {}
  Array.from(dom.style).forEach(style => {
    const key = dom.style[i]
    const value = dom.style[key]
    styles[key] = value
  })
  return styles
}

export default mergePropsToDOM
