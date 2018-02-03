
const parseSlot = node => {
  // const slotMem = new SlotMem(childNode, el)
}

const childElementsParser = (element, ...children) => {
  children.filter(childNode => childNode !== undefined && childNode !== null).map(childNode => {
    if (childNode instanceof HTMLElement || childNode instanceof SVGElement) {
      element.appendChild(childNode)
    } else if (childNode instanceof Array) {
      childNode.map(node => element.appendChild(node))
    } else if (typeof childNode === 'string' || typeof childNode === 'number') {
      element.appendChild(document.createTextNode(childNode))
    } else {
      throw new Error(`Expected "object" or "string" but instead got "${typeof value}"`)
    }
  })

  return element
}

export default childElementsParser
