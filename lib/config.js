
const defs = {
  tagPrefix: 'app'
}

const config = {
  get tagPrefix() {
    return defs.tagPrefix
  },
  set tagPrefix(value) {
    defs.tagPrefix = value
  }
}

export default config
