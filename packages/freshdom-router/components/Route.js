import {Component} from 'freshdom'
import {events, fastdom, createInstance} from 'freshdom-utils'
import PropTypes from 'freshdom-proptypes'

import router from '../router'
import eventTypes from '../event-types'

export default class Route extends Component {
  static propTypes = {
    on: PropTypes.string,
    renders: PropTypes.func
  };

  constructor(props) {
    super(props)

    router.on(this.props.on, this.renderRouteUpdate.bind(this))
    this.hide()
  }

  onAttach() {
    this.setState({
      parentRef: this.parentNode
    })

    this.remove()
  }

  async renderRouteUpdate(routeProps) {
    const container = this.state.parentRef
    const component = await createInstance(this.props.renders, routeProps)

    const elementLeaving = container.firstElementChild
    await events.trigger(component, eventTypes.onRouteBeforeAttach, elementLeaving)
    await fastdom.mutate(() => container.appendChild(component))
    await events.trigger(component, eventTypes.onRouteAttach, elementLeaving)

    if (elementLeaving) {
      await events.trigger(elementLeaving, eventTypes.onRouteBeforeDetach, component)
      await fastdom.mutate(() => elementLeaving.remove())
      await events.trigger(elementLeaving, eventTypes.onRouteDetach, component)
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
