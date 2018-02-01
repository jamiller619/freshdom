import Element from '../element'

class Link extends Element {
  constructor({ href }) {
    this.href = href
    this.dataset.route = true
  }
  get template() {
    return <a href={ this.href } data-route="true"></a>
  }
}

export default Link
