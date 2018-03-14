/**
 * TODO: create separate module for polyfill
 * since it's not always needed or necessary
 */
import polyfill from './helpers/polyfill'
import {tag} from './decorators'
import createElement from './createElement'
import {Element} from './FreshElement'
import router, {Route} from './router'
import {InternalLink} from './elements'
import store, {observe} from './store'

const fresh = {
  createElement,
  Element
}

export {
  fresh as default,
  Element,
  tag,
  router,
  Route,
  store,
  observe,
  InternalLink
}
