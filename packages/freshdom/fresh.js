import createElement from './core/createElement'
import fresh from './core/fresh'

Object.setPrototypeOf(fresh, Object.create({createElement}))

export {
  fresh as default
}
