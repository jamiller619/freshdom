import customElementsLib from './customElementsLib'

const tag = props => {
  let name = undefined
  let options = {}

  if (typeof props === 'object' && props !== undefined) {
    name = props.name
    options.is = props.is
  } else if (typeof props === 'string') {
    name = props
  }

  return target => {
    target.__tag = name
    target.__is = options.is

    customElementsLib.define({ target, name, options })
  }
}

export default tag
