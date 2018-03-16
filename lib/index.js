/**
 * TODO: create separate module for polyfill
 * since it's not always needed or necessary
 */
import polyfill from './helpers/polyfill'
import createElement from './createElement'
import router, {Route, RouteLink} from './router'
import store, {observe} from './store'
import Element, {tag} from './element'

const fresh = {
  createElement,
  Element
}

export {
  fresh as default,
  tag,
  Element,
  router,
  Route,
  RouteLink,
  store,
  observe
}
