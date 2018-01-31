
export const assignTagNameTo = (target, name, elementExtends) => {
  const el = target.prototype
  if (name && !name.includes('-')) {
    throw new Error('Custom elements names must contain a hyphen "-"')
  }
  el.is = name
  el.constructor.__customElementIs = name
  el.constructor.__customElementExtends = elementExtends
}

const tag = props => {
  const name = props && props.name
  const elementExtends = props && props['extends']
  return target => assignTagNameTo(target, name, elementExtends)
}

export default tag
