import { fastdom, isFreshElement } from 'freshdom-utils'
import morphdom from 'morphdom'
import { isTemplate } from './types/is-html'

/**
 * All DOMs in tha house!
 *
 * Compares and then modifies and adapts a collection of nodes onto a host.
 *
 * @param {HTMLElement} host
 * @param {HTMLElement[]} content
 * @returns {HTMLElement}
 */
export default (host, content) => {
  const wrappedContent = fragmentWrap(content)

  // return merge(host, wrappedContent)

  return fastdom.mutate(
    async () => await renderComplete(merge(host, wrappedContent))
  )
}

/**
 * The core merge node implementation.
 *
 * @param {HTMLElement} host
 * @param {HTMLElement} content
 * @returns {HTMLElement}
 */
const merge = (host, content) => {
  // Only morph if the container has children
  if (host.childNodes.length > 0) {
    return morphdom(host, content, {
      childrenOnly: true
    })
  }

  host.append(content)

  return host
}

/**
 * Wraps a node with a fragment.
 *
 * @param {HTMLElement} content
 * @returns {HTMLDocumentFragment}
 */
const fragmentWrap = content => {
  const wrapper = document.createDocumentFragment()
  wrapper.append(...content)
  return wrapper
}

/**
 * Filters an element's children looking for Custom Elements
 * of type Fresh
 *
 * @param {HTMLElement} context
 * @returns {HTMLElement[]}
 */
const findFreshElements = context => {
  return Array.from(context.children).filter(el => isFreshElement(el))
}

/**
 * Creates a Promise that resolves when all children have finished rendering
 *
 * @param {HTMLElement} context
 * @returns {Promise}
 */
const renderComplete = async context => {
  const freshChildren = findFreshElements(context)

  if (freshChildren.length === 0) {
    return Promise.resolve()
  }

  return await Promise.all(
    freshChildren.map(async child => addRenderingCompleteListener(child))
  )
}

/**
 * Adds an attach listener to a component that resolves once triggered
 *
 * @param {HTMLElement} freshComponent
 * @returns {Promise}
 */
const addRenderingCompleteListener = async freshComponent => {
  return new Promise(resolve => {
    const handleAttachEvent = () => {
      resolve()
    }

    freshComponent.addEventListener('rendercomplete', handleAttachEvent, {
      once: true,
      passive: true
    })
  })
}
