import Element from './element'
import createElement from './createElement'
import config from './config'
import tag from './tag'

const jasmin = {
  createElement: createElement,
  Element: Element,
  config: config
}

export {
  jasmin as default,
  tag
}
