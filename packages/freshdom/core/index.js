import createElement from './create-element'
import fresh, {Component} from './fresh'

Object.setPrototypeOf(fresh, Object.create({ createElement }))

export {
  fresh as default,
  Component
}
