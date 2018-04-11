import {fastdom} from 'freshdom-utils'
import morphdom from 'morphdom'

/**
 * All doms in tha house
 *
 * Modifies, in place, the `container` element to
 *  1: Append new `element`
 *  2: Parse template helpers
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} container
 * @returns {HTMLElement}
 */

export default async (element, container) => {
  element = hasTemplateRoot(element) ? removeTemplateRoot(element) : element

  await fastdom.mutate(() => {
    // Skip the morphdom step if the container doesn't
    // have any element (childNodes)
    if (container.firstChild) {
      morphdom(container, element, {
        childrenOnly: true
      })
    } else {
      container.appendChild(element)
    }
  })

  return container
}

/**
 * Removes a <template> node at the supplied element's root
 *
 * @param {HTMLElement} element: The element
 * @returns {HTMLElement} Returns the actual element
 */
const removeTemplateRoot = element => {
  const frag = document.createDocumentFragment()
  Array.from(element.childNodes).map(node => {
    frag.appendChild(node)
  })
  return frag
}

/**
 * Checks if the passed in element node has a
 * <template> node as its root
 *
 * @param {HTMLElement} element: The element
 * @returns {bool}
 */

const hasTemplateRoot = element => {
  return element instanceof HTMLTemplateElement
}
