import fd from '../helpers/fastdom'
import FreshElement from '../FreshElement'
import FreshStore from '../FreshStore'

export default FreshStore.define({
  name: 'fresh-slot',
  target: class extends FreshElement() {
    onAttach() {
      const t = fd.measure(() => {
        const target = document.querySelector(`[slot=${this.props.name}]`)
        if (target) {
          return fd.mutate(() => this.replaceWith(target))
        }
      })
    }
  }
})
