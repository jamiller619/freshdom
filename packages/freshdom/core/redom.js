import { fastdom, isFreshElement } from 'freshdom-utils'
import morphdom from 'morphdom'
import { isTemplate } from './types/is-html'

/**
 * All DOMs in tha house!
 *
 * Compares and then modifies and adapts a collection of nodes onto a host.
 *
 * @param {HTMLElement} host
 * @param {HTMLElement} content
 * @returns {HTMLElement}
 */
export default async(host, content) => {
  content = isTemplate(content) ? fragmentWrap(...content.childNodes) : content

  return fastdom.mutate(
    async() => renderComplete(merge(host, content))
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
  // Only morph the DOM if the host has content
  if (host.firstChild) {
    return morphdom(host, content)
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
const fragmentWrap = (...content) => {
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

  return Promise.all(
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

    freshComponent.addEventListener('onattach', handleAttachEvent, {
      once: true,
      passive: true
    })
  })
}
