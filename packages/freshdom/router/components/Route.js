import Fresh from '../core/base'
import router from './router'
import fastdom from '../utils/fastdom'
import {trigger} from '../core/events'
import eventTypes from './event-types'

export default class Route extends Fresh {
  constructor(props) {
    super(props)
    this.hide()
  }

  createRouteChangeListener(path, component) {
    router.on(path, routeProps => this.renderElement(component))
  }

  async renderElement(el) {
    const elementLeaving = this.firstElementChild
    await trigger(el, eventTypes.onRouteBeforeAttach, elementLeaving)
    await fastdom.mutate(() => this.appendChild(el))
    await trigger(el, eventTypes.onRouteAttach, elementLeaving)

    if (elementLeaving) {
      await trigger(elementLeaving, eventTypes.onRouteBeforeDetach, el)
      await fastdom.mutate(() => elementLeaving.remove())
      await trigger(elementLeaving, eventTypes.onRouteDetach, el)
    }
  }

  empty() {
    while(this.hasChildNodes()) {
      this.removeChild(this.lastChild)
    }
  }

  hide() {
    this.style.visibility = 'hidden'
    return this
  }

  show() {
    this.style.visibility = ''
    return this
  }
}
