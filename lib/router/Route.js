import fd from '../helpers/fastdom'
import FreshElementStore from '../FreshElementStore'
import router from './router'

export default FreshElementStore.define({
  name: 'fresh-route',
  target: class Route {
    onAttach() {
      const {path, renders, controller} = this.props
      this.$container = this.parentNode

      this.remove()

      if (controller) {
        const routeConfig = typeof controller === 'function' && controller() || controller
        Object.keys(routeConfig).map(path => {
          router.on(path, routeProps => {
            this.renderElement(routeConfig[path](routeProps))
          })
        })
      } else {
        router.on(path, routeProps => {
          this.renderElement(renders)
        })
      }
    }

    async renderElement(el) {
      const elementLeaving = this.$container.firstChild
      await fd.mutate(() => this.$container.appendChild(el))
      if (elementLeaving) {
        await fd.mutate(() => elementLeaving.remove())
      }
    }
  }
})
