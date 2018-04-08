import Fresh from '../core/fresh'
import Route from './Route'

export default props => class extends Fresh {
  onAttach() {
    const controller = this.parseController()

    Object.keys(controller).map(path => {
      this.createRouteChangeListener(path, controller[path](routeProps))
    })
  }

  parseController() {
    const controller = this.props.controller
    return typeof controller === 'function' && controller() || controller
  }
}
