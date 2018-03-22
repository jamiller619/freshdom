import 'morphdom'
import fd from '../helpers/fastdom'

/**
 * All doms in tha house
 * 
 * Modifies, in place, the `host` element to 
 *  1: Append new `content`
 *  2: Parse template helpers
 *
 * @param {HTMLElement} content
 * @param {HTMLElement} host
 * @returns {HTMLElement}
 */ 
export default async (content, host) => {
  const renderedContent = renderContent(content)

  /**
   * If our host has no child nodes,
   * just append and move on
   */
  if (host.firstChild) {
    await fd.mutate(() => {
      morphdom(host, renderedContent)
    })
  } else {
    await fd.mutate(() => {
      host.appendChild(renderedContent)
    })
  }
  return host
}

/**
 * Removes the <template> element as root
 * @param {HTMLElement} content: The content's root node
 * @returns {HTMLElement} the new content without <template>
 */ 
const renderContent = content => {
  const frag = document.createDocumentFragment()
  const isTemplateElement = (content instanceof HTMLTemplateElement)
  if (isTemplateElement) {
    Array.from(content.childNodes).map(node => {
      frag.appendChild(node)
    })
  }
  return frag
}

// Look for placeholder <slot> template helpers
// and merge all template properties on the object
// const parseTemplateHelpers = ({content, host}) => {
//   console.log('content', content)
//   console.log('host', host)
//   const slots = content.querySelectorAll('slot')
//   if (slots && slots.length > 0) {
//     Array.from(slots).map(slot => {
//       const name = slot.hasAttribute('name') && slot.getAttribute('name') || undefined
//       if (name) {
//         const slotable = (host[name] instanceof HTMLElement) ? host[name] : undefined
//         if (slotable) slot.replaceWith(slotable)
//       }
//     })
//   }
//   return {content, host}
// }
