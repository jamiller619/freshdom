import fastdom from 'fastdom'
import fastdomPromised from 'fastdom/extensions/fastdom-promised'
import Element from '../Element'
import ElementFactory from '../ElementFactory'

const slot = ElementFactory.define({
  name: 'route-slot',
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

export default slot
