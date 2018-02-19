import morphdom from 'morphdom'

const render = (element, parentNode, replaceRoot = false) => {
  if (!element) return
  // if (replaceRoot) {
  //   const fromEl = element
  //   morphdom(parentNode, element) {
  //     childrenOnly: false
  //   })
  //   // parentNode.replaceWith(fromEl)
  //   // parentNode = null
  // } else {
    morphdom(parentNode, element, {
      childrenOnly: true
    })
  // }
}

export default render
