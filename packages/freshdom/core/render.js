import 'morphdom'
import fastdom from '../helpers/fastdom'

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
  content = hasTemplateRoot(content) ? removeTemplateRoot(content) : content

  await fastdom.mutate(() => {
    // Skip the morphdom step if the host doesn't
    // have any content (childNodes)
    if (host.firstChild) {
      morphdom(host, content)
    } else {
      host.appendChild(content)
    }
  })

  return host
}

/**
 * Removes a <template> node at the supplied content's root
 *
 * @param {HTMLElement} content: The content
 * @returns {HTMLElement} Returns the actual content
 */
const removeTemplateRoot = content => {
  const frag = document.createDocumentFragment()
  Array.from(content.childNodes).map(node => {
    frag.appendChild(node)
  })
  return frag
}

/**
 * Checks if the passed in content node has a
 * <template> node as its root
 *
 * @param {HTMLElement} content: The content
 * @returns {bool}
 */

const hasTemplateRoot = content => {
  return content instanceof HTMLTemplateElement
}
