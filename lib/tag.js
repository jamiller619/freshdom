
const tag = (name = '', options = {}) => {
  return target => {
    const el = target.prototype
    if (name && name !== '') {
      target.prototype.is = name
    }
    el.constructor.__customElementIs = name
    el.constructor.__customElementOpts = options
  }
}

export default tag
