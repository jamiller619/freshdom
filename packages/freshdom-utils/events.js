const type = {
  render: 'render',
  onRenderComplete: 'onRenderComplete',
  onBeforeAttach: 'onBeforeAttach',
  onAttach: 'onAttach',
  onDetach: 'onDetach'
}

const trigger = async (context, type, ...args) => {
  const method =
    context[type] || (context.prototype && context.prototype[type]) || undefined
  const customEvent = new CustomEvent(type.toLowerCase(), {
    bubbles: true
  })

  context.dispatchEvent(customEvent)

  if (typeof method === 'function') {
    await method.call(context, ...args)
  }
}

export default { type, trigger }
