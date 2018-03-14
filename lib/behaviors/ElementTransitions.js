import {Element} from '../FreshElement'
import events from '../dom/events'

const ElementTransitions = {
  beginTransitionEnter: function(elementLeaving) {
    events.trigger(this, {
      type: events.type.onTransitionBeforeEnter,
      args: [elementLeaving]
    })

    this.render()

    events.trigger(this, {
      type: events.type.onTransitionEnter,
      args: [elementLeaving]
    })
  },

  beginTransitionLeave: function(elementEntering) {
    await events.trigger(this, {
      type: events.type.onTransitionLeave,
      args: [elementEntering]
    })

    this.remove()

    await events.trigger(this, {
      type: events.type.onTransitionComplete,
      args: [elementEntering]
    })
  }
}

export default () => Target => {
  Target.prototype = Object.create(ElementTransitions)
  Target.prototype.constructor = Target
  return Target
}
