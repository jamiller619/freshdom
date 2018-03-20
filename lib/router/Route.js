import fd from '../helpers/fastdom'
import make from '../FreshMaker'
import {trigger} from '../element/events'
import router from './router'

const routerEventTypes = {
  onRouteBeforeAttach: 'onRouteBeforeAttach',
  onRouteAttach: 'onRouteAttach',
  onRouteBeforeDetach: 'onRouteBeforeDetach',
  onRouteDetach: 'onRouteDetach'
}

export default () => make('fresh-route', {
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
  },

  async render(el) {
    const elementLeaving = this.$container.firstElementChild
    await trigger(this, routerEventTypes.onRouteBeforeAttach, el, elementLeaving)
    await fd.mutate(() => this.$container.appendChild(el))
    await trigger(this, routerEventTypes.onRouteAttach, el, elementLeaving)

    if (elementLeaving) {
      await trigger(this, routerEventTypes.onRouteBeforeDetach, elementLeaving, el)
      await fd.mutate(() => elementLeaving.remove())
      await trigger(this, routerEventTypes.onRouteDetach, elementLeaving, el)
    }
  }
}
