import Element from '../element'
import customElementsLib from '../customElementsLib'
import router from './router'
import { triggerCallback, eventType } from '../events'

export default customElementsLib.define({
  name: 'app-route',
  target: class extends Element {
    onAttach() {
      this.container = this.parentNode
      this.container.removeChild(this)
      router.on(this.props.path, () => {
        this.renderComponent()
      })
    }

    async renderComponent() {
      const name = typeof this.props.renders === 'function' ? this.props.renders(router.params) : this.props.renders
      const def = customElementsLib.get(name)
      const el = new def(router.params)
      const elLeaving = this.container.firstChild || null

      triggerCallback(el, {
        eventType: eventType.onTransitionBeforeEnter,
        args: [this.container, elLeaving]
      })
      
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
    }
  }
})
