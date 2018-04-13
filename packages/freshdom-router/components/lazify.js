import fresh, {Component} from 'freshdom'

export default importComponent => {
  return class extends Component {
    async render() {
      if (!this.state.component) {
        const component = await importComponent()
        this.setState({
          component: component.default
        })
      }

      return fresh.createElement(this.state.component, this.props)
    }
  }
}
