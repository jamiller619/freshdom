/**
 * TODO: create separate module for polyfill
 * since it's not always needed or necessary
 */
// import polyfill from './helpers/polyfill'
import createElement from './createElement'
import fresh from './FreshMaker'
import router, {Route, RouteLink} from './router'
// import store, {observe} from './store'

Object.defineProperty(fresh, 'createElement', {
  value: createElement
})

export {
  fresh as default,
  router,
  Route,
  RouteLink,
  // store,
  // observe
}
