
const type = {
  onCreate: 'onCreate',
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
  const customEvent = new CustomEvent(type, {
    detail: data || null
  })
  
  FreshElement.dispatchEvent(customEvent)

  if (typeof FreshElement[type] === 'function') {
    await FreshElement[type].apply(FreshElement, args)
  }
}

export default { 
  type,
  trigger
}
