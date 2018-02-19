import morphdom from 'morphdom'
import fastdom from './helpers/fastdom'

const renderContentToHost = async (content, host) => {
  // Check if content has any child nodes
  // because if it doesn't we can skip the 
  // whole morphdom step and render directly
  // to the host element
  if (host.firstChild) {
    await fastdom.mutate(() => {
      morphdom(host, content)
    })
  } else {
    host.appendChild(content)
  }
}

const render = async (content, host) => {
  try {
    await renderContentToHost(content, host)
  } catch (e) {
    throw new Error(`Unable to render ${host.localName}`)
  }
}

export default render
