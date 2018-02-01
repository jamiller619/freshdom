
export const createCustomElementObservable = (target, key) => {
  const proto = Object.getPrototypeOf(target)
  if (!proto.constructor.observedAttributes) {
    proto.constructor.observedAttributes = [key]
  } else {
    proto.constructor.observedAttributes.push(key)
  }
  return Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return this.getAttribute(key)
    },
    set(value) {
      if (this.getAttribute(key) !== value) {
        this.setAttribute(key, value)
        this.render()
      }
    }
  })
}

export const createObjectObservable = (target, key) => {
  if (!target.constructor.observedAttributes) {
    target.constructor.observedAttributes = [key]
  } else {
    target.constructor.observedAttributes.push(key)
  }
  const obj = Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return this[`_${ key }`]
    },
    set(value) {
      this[`_${ key }`] = value
      if (this.__update) {
        this.__update(key, value)
      }
    }
  })
  return obj
}

const observe = (target, key) => {
  if (target instanceof HTMLElement) {
    return createCustomElementObservable(target, key)
  } else {
    return createObjectObservable(target, key)
  }
}

export default observe
