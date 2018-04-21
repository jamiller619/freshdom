export const element = Symbol('fresh.element')

export const viewStates = {
  initialize: 'initialize',
  rendering: 'rendering',
  fresh: 'fresh',
  refreshing: 'refreshing',
  stale: 'stale'
}

export const query = (context, type = element) => {
  return Array.from(context.children).filter(
    el => el.$$__type === type
  )
}
