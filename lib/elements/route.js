import Element from '../Element'
import ElementFactory from '../ElementFactory'
import router from '../router'
import events from '../events'

const route = ElementFactory.define({
  tag: 'app-route',
  target: class extends Element {
    onAttach() {
      this.container = this.parentNode
      this.container.removeChild(this)
      
      router.on(this.props.path, () => {
        this.renderRoute()
      })
    }

    async renderRoute() {
      const tag = typeof this.props.renders === 'function' ? this.props.renders(router.params) : this.props.renders
      const Element = ElementFactory.get(tag)
      const el = new Element(router.params)
      const elLeaving = this.container.firstChild || null

      events.trigger(el, {
        type: events.type.onTransitionBeforeEnter,
        args: [this.container, elLeaving]
      })
      
      this.container.appendChild(el)

      events.trigger(el, {
        type: events.type.onTransitionEnter,
        args: [this.container, elLeaving]
      })

      if (elLeaving) {
        await events.trigger(elLeaving, {
          type: events.type.onTransitionLeave,
          args: [this.container, el]
        })

        this.container.removeChild(elLeaving)

        await events.trigger(elLeaving, {
          type: events.type.onTransitionComplete,
          args: [this.container, el]
        })
      }
    }
  }
})

export default route
