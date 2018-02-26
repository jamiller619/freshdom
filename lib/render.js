import morphdom from 'morphdom'
import fastdom from './helpers/fastdom'

const renderContentToHost = async (content, host) => {
  // Replace the "template" element
  const isTemplateElement = (content instanceof HTMLTemplateElement)
  let hostContent = {}
  if (isTemplateElement) {
    const frag = document.createDocumentFragment()
    Array.from(content.childNodes).map(node => {
      frag.appendChild(node)
    })
    hostContent = frag
  } else {
    hostContent = content
  }

  // Check if content has any child nodes
  // because if it doesn't we can skip the 
  // whole morphdom step and render directly
  // to the host element
  if (host.firstChild) {
    await fastdom.mutate(() => {
      morphdom(host, hostContent)
    })
  } else {
    host.appendChild(hostContent)
  }
}

const render = async (content, host) => {
  try {
    await renderContentToHost(content, host)
  } catch (e) {
    throw new Error(`Unable to render "${host.localName}": ${e}`)
  }
}

export default render
