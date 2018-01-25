import Element from './jasmin'
import createElement from './createElement'
import observe from './observe'
import tag from './tag'

const jasmin = {
  createElement: createElement
}

export {
  jasmin as default,
  Element,
  observe,
  tag
}
