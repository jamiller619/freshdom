import fastdom from 'fastdom'

export const toCamelCase = str => {
  return str.replace(/\W+(.)/g, (match, chr) => {
    return chr.toUpperCase()
  })
}

export const replaceNode = (oldNode, newNode) => {
  fastdom.mutate(() => {
    if (oldNode) {
      while (oldNode.firstChild) {
        oldNode.removeChild(oldNode.firstChild)
      }
      oldNode.appendChild(newNode)
    }
  })
}
