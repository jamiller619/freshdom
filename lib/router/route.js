import Element from '../element'
import router from './router'
import { replaceNode } from '../helpers'
import { triggerCallback, eventType } from '../events'

class Route extends Element {
  onAttach() {
    this.container = this.parentNode
    router.on(this.props.path, () => {
      this.renderComponent()
    })
  }

  async renderComponent() {
    const el = new this.props.renders(router.params)
    const elLeaving = this.container.firstChild || undefined

    triggerCallback(el, {
      eventType: eventType.onTransitionBeforeEnter,
      args: [this.container, elLeaving]
    })

    // render(el.template, container)
    this.container.appendChild(el)

    triggerCallback(el, {
      eventType: eventType.onTransitionEnter,
      args: [this.container, elLeaving]
    })

    if (elLeaving) {
      await triggerCallback(elLeaving, {
        eventType: eventType.onTransitionLeave,
        args: [this.container, el]
      })
      this.container.removeChild(elLeaving)
    }

    replaceNode(this.container, el)
  }
}

export default Route
