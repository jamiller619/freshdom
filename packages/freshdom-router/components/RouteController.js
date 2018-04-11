import {Component} from 'freshdom'
import PropTypes from 'freshdom-proptypes'

import Route from './Route'

export default class RouteController extends Component {
  static tagName = 'fd-route-controller';

  static propTypes = {
    controller: PropTypes.oneOf([
      PropTypes.func,
      PropTypes.object
    ])
  };

  onAttach() {
    const controller = this.parseController()

    Object.keys(controller).map(path => {
      // this.createRouteChangeListener(path, controller[path](routeProps))
    })
  }

  parseController() {
    const controller = this.props.controller
    return typeof controller === 'function' && controller() || controller
  }

  empty() {
    while(this.hasChildNodes()) {
      this.removeChild(this.lastChild)
    }
  }
}
