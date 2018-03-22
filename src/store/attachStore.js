import { createElementObservable } from './observe'

const attachStore = (target, storeObject) => {
  target.store = storeObject
  // look for observables
  const observedAttributes = storeObject.constructor.observedAttributes
  if (observedAttributes && observedAttributes.length > 0) {
    observedAttributes.map(attr => {
      createElementObservable(target, attr)
    })
    storeObject.__update = (key, value) => {
      target[key] = value
    }
  }
}

export default attachStore
