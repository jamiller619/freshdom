/**
 * This file isn't yet being exported from this
 * package, so no need to run eslint
 */

/* eslint-disable */

import fresh, {Component} from 'freshdom'
import PropTypes from 'freshdom-proptypes'

import Route from './Route'

export default class RouteController extends Component {
  /**
   * Public API
   */
  static propTypes = {
    controller: PropTypes.oneOf([
      PropTypes.func,
      PropTypes.object
    ])
  };

  static tag = 'route-controller';

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

  render() {
    
  }
}
