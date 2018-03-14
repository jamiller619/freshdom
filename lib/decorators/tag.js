import FreshElementStore from '../FreshElementStore'

export default args => target => {
  const opts = {
    target: target
  }

  if (typeof args === 'object') {
    opts.name = args.name
    opts.extendsElement = args.extends
  } else {
    opts.name = args
  }

  FreshElementStore.define(opts)
}
