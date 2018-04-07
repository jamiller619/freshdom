import fresh from '../core/fresh'
import RouteBase from './RouteBase'

export default props => class extends RouteBase {
  init() {
    this.hide()
  }

  onAttach() {
    const controller = this.getController()

    Object.keys(controller).map(path => {
      this.createRouteChangeListener(path, controller[path](routeProps))
    })
  }

  getController() {
    const controller = props.controller
    return typeof controller === 'function' && controller() || controller
  }

  hide() {
    this.style.visibility = 'hidden'
    return this
  }

  show() {
    this.style.visibility = ''
    return this
  }

  empty() {
    while(this.lastElementChild) {
      this.lastElementChild.remove()
    }
    return this
  }
}
