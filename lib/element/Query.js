
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
