import fresh from '../core/fresh'
import RouteBase from './RouteBase'

export default props => class extends RouteBase {
  init() {
    console.log(props)
    this.empty()
    this.createRouteChangeListener(props.path, props.renders)
  }
}
