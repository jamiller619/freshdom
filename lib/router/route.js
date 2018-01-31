import { triggerCallback, eventType } from '../events'
import { replaceNode } from '../helpers'

const route = ({ path, selector } = {}) => {
  return target => {
    window.router.on(path, async () => {
      const el = new target(router.params)

      let container = document.body

      if (selector && selector !== '') {
        container = document.querySelector(selector)
      }

      const elLeaving = container.firstChild || undefined

      triggerCallback(el, {
        eventType: eventType.onTransitionBeforeEnter,
        args: [container, elLeaving]
      })

      container.appendChild(el)

      triggerCallback(el, {
        eventType: eventType.onTransitionEnter,
        args: [container, elLeaving]
      })

      if (elLeaving) {
        await triggerCallback(elLeaving, {
          eventType: eventType.onTransitionLeave,
          args: [container, el]
        })
        container.removeChild(elLeaving)
      }

      replaceNode(container, el)
    })
  }
}

export default route

// import createElement from '../createElement'
// import Element from '../jasmin'
// import render from '../render'
// import { triggerCallback, eventType } from '../events'

// class Route extends Element {
  
//   onAttach() {
//     window.router.on(this.props.path, () => {
//       this.renderOnDemand()
//     })
//   }

//   renderOnDemand() {
//     const container = this.parentNode
//     console.log(window.router.params)
//     const el = new this.props.renders(window.router.params)
//     const elLeaving = container.firstChild || undefined

//     render({ element: el, container: container, replaceContainer: true })

//     // triggerCallback(el, {
//     //   eventType: eventType.onTransitionBeforeEnter,
//     //   args: [container, elLeaving]
//     // })

//     // // container.appendChild(el)
//     // render({ element: el, container: container, replaceNode: false })

//     // triggerCallback(el, {
//     //   eventType: eventType.onTransitionEnter,
//     //   args: [container, elLeaving]
//     // })

//     // if (elLeaving) {
//     //   triggerCallback(elLeaving, {
//     //     eventType: eventType.onTransitionLeave
//     //   })
//     //   container.removeChild(elLeaving)
//     // }
//     // replaceNode(container, el)
//   }
// }

// export default Route
