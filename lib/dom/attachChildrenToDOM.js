import isDefined from '../helpers/isDefined'

const attachChildrenToDOM = ({ domContainer, children = [] }) => {
  const {node} = domContainer
  children.filter(childNode => isDefined(childNode))
    .map(childNode => {
      if (childNode instanceof HTMLElement || childNode instanceof SVGElement) {
        node.appendChild(childNode)
      } else if (childNode instanceof Array) {
        childNode.forEach(childOfChildNode => node.appendChild(childOfChildNode))
      } else if (typeof childNode === 'string' || typeof childNode === 'number') {
        node.appendChild(document.createTextNode(childNode))
      } else {
        throw new Error(`Expected "object" or "string" but instead got "${typeof value}"`)
      }
    }
  )

  return {
    type: domContainer.type,
    node: node
  }
}

export default attachChildrenToDOM
