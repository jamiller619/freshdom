
const composeEventPath = evt => {
  if (evt.path || typeof evt.composePath === 'function') {
    return evt.path || evt.composedPath()
  }

  const el = evt.target

  if (el === null || el.parentElement === null) {
    return []
  }

  const path = [el]
  while (el.parentElement !== null) {
    el = el.parentElement
    path.unshift(el)
  }
  return path
}

export default composeEventPath
