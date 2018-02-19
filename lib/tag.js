import ElementFactory from './ElementFactory'

export default props => {
  const opts = {}

  if (typeof props === 'string') {
    opts.name = props
  } else {
    opts.name = props.name
  }

  return target => {
    opts.target = target
    ElementFactory.define(opts)
  }
}
