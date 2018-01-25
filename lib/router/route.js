import { triggerCallback, eventType } from '../events'
import { replaceNode } from '../helpers'

const route = ({ path, selector } = {}) => {
  return target => {
    window.router.on(path, () => {
      const el = new target(router.params)

      let container = document.body

      if (selector && selector !== '') {
        container = document.querySelector(selector)
      }

      const elLeaving = container.firstChild || undefined

      triggerCallback(el, {
        eventType: eventType.onTransitionBeforeEnter,
        args: [container, elLeaving]
      })

      container.appendChild(el)

      triggerCallback(el, {
        eventType: eventType.onTransitionEnter,
        args: [container, elLeaving]
      })

      if (elLeaving) {
        triggerCallback(elLeaving, {
          eventType: eventType.onTransitionLeave
        })
        container.removeChild(elLeaving)
      }

      replaceNode(container, el)
    })
  }
}

export default route
