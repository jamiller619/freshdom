import fd from '../helpers/fastdom'
import FreshElementStore from '../FreshElementStore'
import router from './router'

const events = {
  onRouteBeforeAttach: 'onRouteBeforeAttach',
  onRouteAttach: 'onRouteAttach',
  onRouteBeforeDetach: 'onRouteBeforeDetach',
  onRouteDetach: 'onRouteDetach'
}

const triggerEvent = async (type, el, ...params) => {
  if (el[type] && typeof el[type] === 'function') {
    await el[type].call(el, ...params)
  }
}

export default FreshElementStore.define({
  name: 'fresh-route',
  target: class Route {
    onAttach() {
      const {path, renders, controller} = this.props
      this.$container = this.parentNode

      this.remove()

      if (controller) {
        const routeConfig = typeof controller === 'function' && controller() || controller
        Object.keys(routeConfig).map(path => {
          router.on(path, routeProps => {
            this.render(routeConfig[path](routeProps))
          })
        })
      } else {
        router.on(path, routeProps => {
          this.render(renders)
        })
      }
    }

    async render(el) {
      const elementLeaving = this.$container.firstElementChild
      await triggerEvent(events.onRouteBeforeAttach, el, elementLeaving)
      await fd.mutate(() => this.$container.appendChild(el))
      await triggerEvent(events.onRouteAttach, el, elementLeaving)

      if (elementLeaving) {
        await triggerEvent(events.onRouteBeforeDetach, elementLeaving, el)
        await fd.mutate(() => elementLeaving.remove())
        await triggerEvent(events.onRouteDetach, elementLeaving, el)
      }
    }
  }
})
