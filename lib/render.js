import morphdom from 'morphdom'
import fd from './helpers/fastdom'

// Replace the root <template> element if found
const composeTemplateRoot = content => {
  const isTemplateElement = (content instanceof HTMLTemplateElement)
  if (isTemplateElement) {
    const frag = document.createDocumentFragment()
    Array.from(content.childNodes).map(node => {
      frag.appendChild(node)
    })
    return frag
  }

  return content
}

// Look for placeholder <slot> template helpers
// and merge all template properties on the object
const mergeTemplates = ({content, host}) => {
  const slots = content.querySelectorAll('slot')
  if (slots && slots.length > 0) {
    Array.from(slots).map(slot => {
      const name = slot.hasAttribute('name') && slot.getAttribute('name') || undefined
      if (name) {
        const slotable = (host[name] instanceof HTMLElement) ? host[name] : undefined
        if (slotable) slot.replaceWith(slotable)
      }
    })
  }

  return {content, host}
}

const renderContentToHost = async (content, host) => {
  const resolvedContent = composeTemplateRoot(content)
  const {content: newContent, host: newHost} = mergeTemplates({content: resolvedContent, host})

  // Check if our host has any child nodes
  // because we can skip the morphdom step 
  // completely and render directly to it
  if (newHost.firstChild) {
    await fd.mutate(() => {
      morphdom(newHost, newContent)
    })
  } else {
    newHost.appendChild(newContent)
  }
}

export default async (content, host) => {
  try {
    await renderContentToHost(content, host)
  } catch (e) {
    throw new Error(`Unable to render "${host.localName}": ${e}`)
  }
}
