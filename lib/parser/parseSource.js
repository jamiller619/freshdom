import svgNodes from './html/svg'

const parseSource = (source, props = {}) => {
  const nodeType = typeof source === 'object' ? source.name : source
  if (typeof source === 'function') {
    return new source(props)
  } else if (nodeType === 'template') {
    return document.createDocumentFragment()
  } else if (svgNodes.includes(nodeType)) {
    return document.createElementNS('http://www.w3.org/2000/svg', nodeType)
  }

  return document.createElement(nodeType)
}

export default parseSource
