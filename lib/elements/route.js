import FreshElement from '../FreshElement'
import FreshStore from '../FreshStore'
import router from '../router'
import events from '../events'

const Route = FreshStore.define({
  name: 'fresh-route',
  target: class extends FreshElement() {
    onAttach() {
      this.container = this.parentNode
      this.container.removeChild(this)
      
      router.on(this.props.path, () => {
        this.renderRoute()
      })
    }

    async renderRoute() {
      const tag = typeof this.props.renders === 'function' ? this.props.renders(router.params) : this.props.renders
      const Fresh = FreshStore.get(tag)
      const el = new Fresh(router.params)
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

export default Route
