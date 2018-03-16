const type = {
  init: 'init',
  onRender: 'onRender',
  onBeforeRender: 'onBeforeRender',
  onBeforeAttach: 'onBeforeAttach',
  onAttach: 'onAttach',
  onBeforeDetach: 'onBeforeDetach',
  onDetach: 'onDetach',
  onUpdate: 'onUpdate',
  onAdopt: 'onAdopt'
}

const trigger = async (element, { 
  type, 
  data = {}, 
  args = []
}) => {
  const method = element[type]
  const customEvent = new CustomEvent(type, {
    detail: data || null
  })
  
  element.dispatchEvent(customEvent)

  if (typeof method === 'function') {
    await method.apply(element, args)
  }
}

export default { 
  type,
  trigger
}
