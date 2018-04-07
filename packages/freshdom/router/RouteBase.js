import {Component} from '../core/fresh'
import router from './router'
import fastdom from '../utils/fastdom'
import {trigger} from '../core/events'
import eventTypes from './event-types'

export default class RouteBase extends Component {
  createRouteChangeListener(path, component) {
    router.on(path, routeProps => this.renderComponent(component))
  }

  async renderComponent(el) {
    const elementLeaving = this.firstElementChild
    await trigger(el, routerEventTypes.onRouteBeforeAttach, elementLeaving)
    await fastdom.mutate(() => this.appendChild(el))
    await trigger(el, routerEventTypes.onRouteAttach, elementLeaving)

    if (elementLeaving) {
      await trigger(elementLeaving, routerEventTypes.onRouteBeforeDetach, el)
      await fastdom.mutate(() => elementLeaving.remove())
      await trigger(elementLeaving, routerEventTypes.onRouteDetach, el)
    }
  }

  empty() {
    while(this.hasChildNodes()) {
      this.removeChild(this.lastChild)
    }
  }
}
