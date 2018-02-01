import morphdom from 'morphdom'

// const render = ({ element, container, replaceContainer = false }) => {
//   if (!element) return
//   morphdom(container, element, {
//     childrenOnly: !replaceContainer
//   })
// }

const render = (element, parentNode) => {
  if (!element) return
  morphdom(parentNode, element, {
    childrenOnly: true
  })
}

export default render
