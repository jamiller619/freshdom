import { fastdom, isFreshElement } from 'freshdom-utils'
import morphdom from 'morphdom'
import { isTemplate } from './types/is-html'

/**
 * All DOMs in tha house!
 *
 * @param {HTMLElement} host
 * @param {HTMLElement[]} content
 * @returns {HTMLElement}
 */
export default async (host, content, options) => {
  content = Array.isArray(content) ? content : Array.of(content)
  content = isTemplate(content[0]) ? content[0].childNodes : content

  const wrappedContent = fragmentWrap(content)

  return await sync(host, wrappedContent, options)
}

/**
 * The core DOM reconciler
 *
 * Syncs a host element's current DOM content with
 * a newly rendered copy of its content.
 *
 * @param {HTMLElement} host
 * @param {HTMLElement} content
 * @returns {HTMLElement}
 */
const sync = async (host, content, options) => {
  // Only morph if the container has children
  if (host.childElementCount > 0) {
    const opts = Object.assign(morphdomDefaultOptions, options)
    console.dir(opts)

    await fastdom.mutate(() =>
      morphdom(host, content, opts)
    )
  } else {
    host.append(content)
  }

  return host
}

const morphdomDefaultOptions = {
  childrenOnly: true
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
