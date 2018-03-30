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

export default () => fresh('fresh-route', {
  onAttach() {
    this.empty()

    const {path, renders, controller} = this.props

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
    await trigger(this, routerEventTypes.onRouteBeforeAttach, el, elementLeaving)
    await fd.mutate(() => this.appendChild(el))
    await trigger(this, routerEventTypes.onRouteAttach, el, elementLeaving)

    if (elementLeaving) {
      await trigger(this, routerEventTypes.onRouteBeforeDetach, elementLeaving, el)
      await fd.mutate(() => elementLeaving.remove())
      await trigger(this, routerEventTypes.onRouteDetach, elementLeaving, el)
    }
  }
})
