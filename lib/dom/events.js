const type = {
  init: 'init',
  onRender: 'onRender',
  onBeforeRender: 'onBeforeRender',
  onBeforeAttach: 'onBeforeAttach',
  onAttach: 'onAttach',
  onBeforeDetach: 'onBeforeDetach',
  onDetach: 'onDetach',
  onUpdate: 'onUpdate',
  onAdopt: 'onAdopt',
  onTransitionBeforeEnter: 'onTransitionBeforeEnter',
  onTransitionEnter: 'onTransitionEnter',
  onTransitionLeave: 'onTransitionLeave',
  onTransitionComplete: 'onTransitionComplete'
}

const trigger = async (inst, { type, data = {}, args = [], triggerInstanceMethod = true }) => {
  const customEvent = new CustomEvent(type, {
    detail: data || null
  })
  
  inst.dispatchEvent(customEvent)

  if (triggerInstanceMethod === true && typeof inst[type] === 'function') {
    await inst[type].apply(inst, args)
  }
}

export default { 
  type,
  trigger
}
