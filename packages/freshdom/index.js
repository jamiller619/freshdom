import Component from './core/fresh'
import createElement from './core/create-element'
import { tag } from './decorators'

const fresh = {
  createElement,
  Component
}

export {
  fresh as default,
  Component,
  tag
}
