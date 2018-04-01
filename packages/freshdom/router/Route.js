import fresh from '../core/fresh'
import fd from '../helpers/fastdom'
import router from './router'
import {trigger} from '../core/events'

const routerEventTypes = {
  onRouteBeforeAttach: 'onRouteBeforeAttach',
  onRouteAttach: 'onRouteAttach',
  onRouteBeforeDetach: 'onRouteBeforeDetach',
  onRouteDetach: 'onRouteDetach'
}

export default fresh('fresh-route', props => {
  return {
    onAttach() {
      this.empty()

      const {path, renders, controller} = props

      if (controller) {
        const routeConfig = typeof controller === 'function' && controller() || controller
        Object.keys(routeConfig).map(path => {
          router.on(path, routeProps => {
            this.onRouterUpdate(routeConfig[path](routeProps))
          })
        })
      } else {
        router.on(path, routeProps => {
          this.onRouterUpdate(renders)
        })
      }
    },

    empty() {
      while(this.hasChildNodes()) {
        this.removeChild(this.lastChild)
      }
    },

    async onRouterUpdate(el) {
      const elementLeaving = this.firstElementChild
      await trigger(el, routerEventTypes.onRouteBeforeAttach, elementLeaving)
      await fd.mutate(() => this.appendChild(el))
      await trigger(el, routerEventTypes.onRouteAttach, elementLeaving)

      if (elementLeaving) {
        await trigger(elementLeaving, routerEventTypes.onRouteBeforeDetach, el)
        await fd.mutate(() => elementLeaving.remove())
        await trigger(elementLeaving, routerEventTypes.onRouteDetach, el)
      }
    }
  }
})
