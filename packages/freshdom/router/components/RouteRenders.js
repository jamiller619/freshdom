import Fresh from '../core/fresh'
import Route from './Route'

export default class extends Fresh {
  constructor(props) {
    super(props)

    this.createRouteChangeListener(props.path, props.renders)
  }

  onAttach() {
    this.empty()
  }

  render() {
    return Route.renderComponent(props.path, props.renders)
  }
}
