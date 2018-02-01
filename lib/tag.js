
export const assignTagNameTo = (target, name) => {
  const el = target.prototype
  if (name && !name.includes('-')) {
    throw new Error('Custom elements names must contain a hyphen "-"')
  }
  el.is = name
  el.constructor.__customElementIs = name
}

const tag = props => {
  const name = props && props.name
  /**
   * Keeping here for now in case I want to figure out
   * how to make Custom Elements 'extends' work in the future
   *
   * const elementExtends = props && props['extends']
   * return target => assignTagNameTo(target, name, elementExtends)
   */
  return target => assignTagNameTo(target, name)
}

export default tag
