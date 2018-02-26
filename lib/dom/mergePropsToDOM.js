
const mergePropsToDOM = ({ dom, props = {} }) => {
  // Convert NamedNodeList (element.attributes) to Array
  const sanitizedDOMAttributes = {}
  if (dom.attributes) {
    Array.from(dom.attributes).forEach(attr => {
      sanitizedDOMAttributes[attr.name] = attr.value
    })
  }

  // Merge attributes with props that would get
  // overwritten with Object.assign
  const mergedClassNames = {}
  if (sanitizedDOMAttributes.className || props.className) {
    mergedClassNames.class = `${sanitizedDOMAttributes} ${props.className} ${props.class}`
  }

  // Merge our attribute-containing objects
  const newProps = Object.assign({}, sanitizedDOMAttributes, props, mergedClassNames)

  if (typeof newProps.style === 'object') {
    Object.assign(dom.style, newProps.style)
  }

  Object.keys(newProps).map(p => {
    dom.setAttribute(p, newProps[p])
  })

  return dom
}

export default mergePropsToDOM
