import events from '../dom/events'

export default {
  beginTransitionEnter: function(container, elementLeaving) {
    events.trigger(this, {
      type: events.type.onTransitionBeforeEnter,
      args: [container, elementLeaving]
    })

    container.appendChild(this)

    events.trigger(this, {
      type: events.type.onTransitionEnter,
      args: [container, elementLeaving]
    })
  },

  beginTransitionLeave: async function(container, elementEntering) {
    await events.trigger(this, {
      type: events.type.onTransitionLeave,
      args: [container, elementEntering]
    })

    this.remove()

    await events.trigger(this, {
      type: events.type.onTransitionComplete,
      args: [container, elementEntering]
    })
  }
}
