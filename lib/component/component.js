import morphdom from 'morphdom'

export default class Component {
  constructor(props = {}) {
    this.props = props
    this.dom = this.render()
    if (this.store && this.store.addUpdateListener) {
      this.store.addUpdateListener(() => this.update())
    }
  }
  update() {
    const vdom = this.render()
    if (this.dom) {
      this.dom = morphdom(this.dom, vdom)
    }
  }
}
