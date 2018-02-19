import Element from './element'
import createElement from './createElement'
import config from './config'
import tag from './tag'
import slot from './slot'

const jasmin = {
  createElement: createElement,
  Element: Element,
  config: config,
  slot: slot
}

export {
  jasmin as default,
  tag
}
