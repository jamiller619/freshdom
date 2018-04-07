import attach from './attach'

const store = store => {
  return target => {
    attach(target.prototype, store)
  }
}

export default store
