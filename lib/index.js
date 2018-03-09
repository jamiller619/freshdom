import router, {Route} from './router'
import createDOM from './createDOM'
import FreshElement from './FreshElement'
import Behavior from './FreshBehavior'
import tag from './tag'
import has from './has'

const Element = FreshElement()

const fresh = {
  createDOM,
  Element
}

export {
  fresh as default,
  Element,
  Behavior,
  tag,
  has,
  router,
  Route
}
