
export const eventType = {
  onRender: 'onRender',
  onBeforeRender: 'onBeforeRender',
  onBeforeConnected: 'onBeforeAttach',
  onConnected: 'onAttach',
  onDisconnected: 'onDetach',
  attributeChangedCallback: 'onPropChange',
  onTransitionBeforeEnter: 'onTransitionBeforeEnter',
  onTransitionEnter: 'onTransitionEnter',
  onTransitionLeave: 'onTransitionLeave'
}

export function triggerCallback(el, { eventType, data = {}, args = [] }) {
  if (typeof el[eventType] === 'function') {
    el[eventType](...args)
  }
  const eventDetail = {
    detail: data || null
  }
  const event = new CustomEvent(eventType, eventDetail)
  el.dispatchEvent(event)
}
