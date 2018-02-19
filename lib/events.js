
const type = {
  onRender: 'onRender',
  onBeforeRender: 'onBeforeRender',
  onBeforeAttach: 'onBeforeAttach',
  onAttach: 'onAttach',
  onDetach: 'onDetach',
  onUpdate: 'onUpdate',
  onAdopt: 'onAdopt',
  onTransitionBeforeEnter: 'onTransitionBeforeEnter',
  onTransitionEnter: 'onTransitionEnter',
  onTransitionLeave: 'onTransitionLeave',
  onTransitionComplete: 'onTransitionComplete'
}

const trigger = async (FreshElement, { type, data = {}, args = [] }) => {
  if (typeof FreshElement[type] === 'function') {
    await FreshElement[type].apply(FreshElement, ...args)
  }

  const eventDetail = {
    detail: data || null
  }

  const customEvent = new CustomEvent(type, eventDetail)
  FreshElement.dispatchEvent(customEvent)
}

export default { 
  type,
  trigger
}
