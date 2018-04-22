import { fastdom } from 'freshdom-utils'
import morphdom from 'morphdom'
import { isTemplate } from './types/is-html'
import { query } from './types/fresh'

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
  content = isTemplate(content) ? rewrap(content) : content

  return fastdom.mutate(
    async() => renderComplete(adapt(host, content))
  )
}

/**
 * The core adaptation implementation.
 * Say that shit five times fast!
 *
 * @param {HTMLElement} host
 * @param {HTMLElement} content
 * @returns {HTMLElement}
 */
const adapt = (host, content) => {
  // Only morph the DOM if the host has content
  // Is it better to use Node.hasChildNodes method here? Pretty sure probably not...
  if (host.firstChild) {
    const childrenOnly = true
    return morphdom(host, content, { childrenOnly })
  }

  host.appendChild(content)
  return host
}

/**
 * Replaces a node collection's parent with a fragment.
 *
 * @param {HTMLElement} content
 * @returns {HTMLDocumentFragment}
 */
const rewrap = content => {
  const wrapper = document.createDocumentFragment()
  wrapper.append(...content.childNodes)
  return wrapper
}

/**
 * Creates a Promise that resolves when all children have finished rendering
 *
 * @param {HTMLElement} context
 * @returns {Promise}
 */
const renderComplete = async context => {
  const freshChildren = query(context)

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
