import isDefined from '../helpers/isDefined'

const attachChildrenToDOM = ({ dom, children = [] }) => {
  children.filter(childNode => isDefined(childNode))
    .map(childNode => {
      if (childNode instanceof HTMLElement || childNode instanceof SVGElement) {
        dom.appendChild(childNode)
      } else if (typeof childNode === 'string' || typeof childNode === 'number') {
        dom.appendChild(document.createTextNode(childNode))
      } else {
        throw new Error(`Expected "object" or "string" but instead got "${typeof value}"`)
      }
    }
  )

  return dom
}

export default attachChildrenToDOM
