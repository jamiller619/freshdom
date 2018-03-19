const CoreEvents = {
  init: 'init',
  onRender: 'onRender',
  onBeforeAttach: 'onBeforeAttach',
  onAttach: 'onAttach',
  onDetach: 'onDetach',
  onUpdate: 'onUpdate'
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
  type: CoreEvents,
  trigger
}
