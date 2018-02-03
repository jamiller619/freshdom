import customElementsLib from './customElementsLib'

const tag = props => {
  let name = undefined
  if (typeof props === 'object') {
    name = props && props.name
  } else if (typeof props === 'string') {
    name = props
  }
  return target => customElementsLib.define({ target, name })
}

export default tag
