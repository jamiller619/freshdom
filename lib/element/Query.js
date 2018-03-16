/**
 * This isn't currently being used anywhere, but I would
 * like to think of an easy way to extend the Base object
 * with additional object literals.
 */
export default {
  find(selector) {
    return this.querySelector(selector)
  },

  wrap(container) {
    this.template = container.appendChild(this.template)
    return this
  },

  addClass(...classNames) {
    classNames.map(className => this.classList.add(className))
    return this
  },

  removeClass(...classNames) {
    classNames.map(className => this.classList.remove(className))
    return this
  },

  attr(key, value) {
    if (this.hasAttribute(key)) {
      this.setAttribute(key, value)
    }
    return this
  }
} 
