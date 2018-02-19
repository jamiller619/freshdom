/**
 * This file needs to be refactored as extensions
 * to the rendering process
 */

import Element from '../element'
import customElementsLib from '../customElementsLib'
import svgNodes from './html/svg'

const sourceStringParser = function(sourceString, props = {}, ...children) {
  const nodeType = typeof sourceString === 'object' ? sourceString.name : sourceString
  if (typeof sourceString === 'function') {
    let el = undefined
    try {
      el = nodeType(props)
    } catch (e) {
      el = new nodeType(props, children)
    }
    return el
  } else if (typeof sourceString === 'string' && sourceString.includes('-')) {
    /**
     * Allow for special handling for Slots
     */
    // if ('is' in props && props.is === 'slot') {
    //   const dp = new DOMParser()
    //   dp.parseFromString(sourceString, 'text/html')

    //   try {
    //     if (db.body.firstElementChild.hasAttribute('is')) {
    //       const Slot = customElementsLib.get('element-slot')
    //       const slot = new Slot(props, ...children)
    //       const slotName = db.body.firstElementChild.localName
    //       slot.setAttribute('name', slotName)
    //       props.name = slotName
    //       delete props.is
    //       return slot
    //     }
    //   } catch (e) {
    //     console.log(`! Warning: Error when parsing as slot, ${sourceString}`)
    //   }
    // }

    return customElementsLib.create({ target: sourceString, params: props })

  } else if ('is' in props && customElementsLib.get(nodeType)) {
    return customElementsLib.create({ target: sourceString, params: props })
  } else if (svgNodes.includes(nodeType)) {
    return document.createElementNS('http://www.w3.org/2000/svg', nodeType)
  }

  return document.createElement(nodeType)
}

export default sourceStringParser
