import FreshStore from './FreshStore'

export default props => {
  return target => {
    const opts = {
      target: target,
      name: typeof props === 'string' ? props : props.name,
      extendsElement: typeof props === 'object' && props.extends || undefined
    }

    FreshStore.define(opts)
  }
}
