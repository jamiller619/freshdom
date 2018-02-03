import Element from '../element'
import customElementsLib from '../customElementsLib'

export default customElementsLib.define({
  name: 'app-link',
  target: class extends Element {
    render() {
      const $link = document.createElement('a')
      $link.href = this.props.href
      $link.dataset.route = true
      // this.replaceWith($link)
      return $link
    }
  }
})
