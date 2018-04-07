import { createElementObservable } from './observe'

export default (target, store) => {
  target.store = store
  // look for observables
  const observedAttributes = store.constructor.observedAttributes
  if (observedAttributes && observedAttributes.length > 0) {
    observedAttributes.map(attr => {
      createElementObservable(target, attr)
    })
    store.__update = (key, value) => {
      target[key] = value
    }
  }
}
