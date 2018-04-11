import config from '../config'

/**
 * Generates a unique id based on the time.
 * Adapted from npm package `uniqid`
 */

const now = () => {
  const time = Date.now()
  const last = now.last || time
  return now.last = time > last ? time : last + 1
}

const create = () => {
  return now().toString(36)
}

export default {
  create
}
