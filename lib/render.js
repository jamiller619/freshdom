import morphdom from 'morphdom'

const render = ({ element, container, replaceContainer = false }) => {
  if (!element) return
  morphdom(container, element, {
    childrenOnly: !replaceContainer
  })
}

export default render
