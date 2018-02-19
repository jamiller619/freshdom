import 'fastdom/extensions/fastdom-promised'
import Element from './element'
import customElementsLib from './customElementsLib'

export default customElementsLib.define({
  name: 'element-slot',
  target: class extends Element {
    onAttach() {
      const t = fastdom.measure(() => {
        const target = document.querySelector(`[slot=${this.props.name}]`)
        if (target) {
          return fastdom.mutate(() => this.replaceWith(target))
        }
      })
    }
  }
})
