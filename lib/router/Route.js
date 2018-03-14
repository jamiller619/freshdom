import FreshElementStore from '../FreshElementStore'
import {Element} from '../FreshElement'
import {createInstance} from '../FreshMaker'
import {events} from '../dom'
import router from './router'

export default FreshElementStore.define({
  name: 'fresh-route',
  target: class Route extends Element {
    onAttach() {
      this.$container = this.parentNode
      this.$container.removeChild(this)

      const {path, renders, controller} = this.props

      if (controller) {
        const routeConfig = typeof controller === 'function' && controller() || controller
        Object.keys(routeConfig).map(path => {
          router.on(path, routeProps => {
            this.renderRoute(routeConfig[path], routeProps)
          })
        })
      } else {
        router.on(path, routeProps => {
          this.renderRoute(renders, routeProps)
        })
      }
    }

    async renderRoute(FreshConstructor, props) {
      const el = createInstance(FreshConstructor, props)
      const elLeaving = this.$container.firstChild || null

      events.trigger(el, {
        type: events.type.onTransitionBeforeEnter,
        args: [this.$container, elLeaving]
      })

      this.$container.appendChild(el)

      events.trigger(el, {
        type: events.type.onTransitionEnter,
        args: [this.$container, elLeaving]
      })

      if (elLeaving) {
        await events.trigger(elLeaving, {
          type: events.type.onTransitionLeave,
          args: [this.$container, el]
        })

        this.$container.removeChild(elLeaving)

        await events.trigger(elLeaving, {
          type: events.type.onTransitionComplete,
          args: [this.$container, el]
        })
      }
    }
  }
})
