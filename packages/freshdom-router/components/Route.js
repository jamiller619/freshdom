import fresh, {Component} from 'freshdom'
import {events, fastdom, createInstance} from 'freshdom-utils'
import PropTypes from 'freshdom-proptypes'

import router from '../router'
import eventTypes from '../event-types'

export default class Route extends Component {
  /**
   * Public API
   */
  static propTypes = {
    on: PropTypes.string,
    async: PropTypes.bool,
    renders: PropTypes.func
  };

  static tag = 'freshdom-route';

  constructor(props) {
    super(props).hide()
    router.on(props.on, this.handleRouteChange.bind(this))
  }

  onAttach() {
    this.setState({
      parentRef: this.parentNode
    })

    this.remove()
  }

  async renderComponent(props) {
    if (!this.state.componentRef || props !== this.state.componentPropsRef) {
      let component = {}

      if (this.props.async === true) {
        const dynamicallyImportedComponent = await this.props.renders()
        component = dynamicallyImportedComponent.default
      } else {
        component = this.props.renders()
      }
      
      const componentRef = createInstance(component, props)

      this.setState({
        componentRef,
        componentPropsRef: props
      })
    }

    return this.state.componentRef
  }

  async handleRouteChange(routeProps) {
    const container = this.state.parentRef
    const component = await this.renderComponent(routeProps)

    const elementLeaving = container.firstElementChild
    await events.trigger(
      component,
      eventTypes.onRouteBeforeAttach,
      elementLeaving
    )
    await fastdom.mutate(() => container.appendChild(component))
    await events.trigger(component, eventTypes.onRouteAttach, elementLeaving)

    if (elementLeaving) {
      await events.trigger(
        elementLeaving,
        eventTypes.onRouteBeforeDetach,
        component
      )
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
