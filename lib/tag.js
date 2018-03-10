import FreshStore from './FreshStore'

export default (props) => Target => {
  const propsObject = typeof props === 'object' && props.name ? props : { name: props }
  const opts = {
    target: Target,
    name: propsObject.name
  }
  if (props.extends) opts.extendsElement = props.extends
  FreshStore.define(opts)
}
