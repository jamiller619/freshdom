import attachStore from './attachStore'

const store = storeObject => {
  return target => {
    attachStore(target.prototype, storeObject)
  }
}

export default store
