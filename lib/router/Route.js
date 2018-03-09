import FreshElement from '../FreshElement'
import FreshStore from '../FreshStore'
import FreshInstance from '../FreshInstance'
import router from './router'
import events from '../events'

const Route = FreshStore.define({
  name: 'fresh-route',
  target: class extends FreshElement() {
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
      const el = FreshInstance.create(FreshConstructor, props)
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

    // async renderRoute(params) {
    //   const el = FreshInstance.create(this.props.renders, router.params)
    //   const elLeaving = this.$container.firstChild || null

    //   events.trigger(el, {
    //     type: events.type.onTransitionBeforeEnter,
    //     args: [this.$container, elLeaving, ...params]
    //   })

    //   this.$container.appendChild(el)

    //   events.trigger(el, {
    //     type: events.type.onTransitionEnter,
    //     args: [this.$container, elLeaving, ...params]
    //   })

    //   if (elLeaving) {
    //     await events.trigger(elLeaving, {
    //       type: events.type.onTransitionLeave,
    //       args: [this.$container, el, ...params]
    //     })

    //     this.$container.removeChild(elLeaving)

    //     await events.trigger(elLeaving, {
    //       type: events.type.onTransitionComplete,
    //       args: [this.$container, el, ...params]
    //     })
    //   }
    // }
  }
})

export {
  router as default,
  Route
}
