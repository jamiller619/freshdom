import attachStore from './store/attachStore'

class Element {
  constructor(name) {
    this.name = name
  }
  render() {
    // Handle "class instance" nodeType
    if (typeof this.node === 'function') {
      el.node = new this.node(props)

    // Handle "custom element" nodeType
    } else if (typeof this.node === 'string' && this.node.includes('-')) {
      el.node = customElementsLib.create({ target: this.node, params: this.props })

    // Handle "template" nodeType
    // because the <template> tag is replaced with a document fragment
    } else if (this.node === 'template') {
      el.node = document.createDocumentFragment()

    // Handle "svg" nodeType
    } else if (svgNodes.includes(this.node)) {
      el.node = document.createElementNS('http://www.w3.org/2000/svg', this.node)

    // Default nodeType handler
    } else {
      el.node = document.createElement(this.node)
    }
  }
}

class ElementRenderer {
  constructor(node, props = {}, ...children) {
    this.el = this.createElement(node, props)
    this.props = props
    this.children = children
  }
  
  render() {
    
  }

  createElement(node, props) {
    const nodeName = typeof this.node === 'object' ? this.node.name : this.node
    return new Element(nodeName)

    // Handle "class instance" nodeType
    if (typeof this.node === 'function') {
      return new this.node(props)

    // Handle "custom element" nodeType
    } else if (typeof this.node === 'string' && this.node.includes('-')) {
      el.node = customElementsLib.create({ target: this.node, params: this.props })

    // Handle "template" nodeType
    // because the <template> tag is replaced with a document fragment
    } else if (this.node === 'template') {
      el.node = document.createDocumentFragment()

    // Handle "svg" nodeType
    } else if (svgNodes.includes(this.node)) {
      el.node = document.createElementNS('http://www.w3.org/2000/svg', this.node)

    // Default nodeType handler
    } else {
      el.node = document.createElement(this.node)
    }

    return el
  }

  renderProps() {
    const isObject = typeof this.element === 'object'
    const nodeAttrs = isObject ? this.element.attributes : {}
    const attr = Object.assign({}, this.props, nodeAttrs)
    const isSVG = this.element instanceof SVGElement

    if (attr.class || attr.className) {
      const className = attr.class || attr.className
      if (attr.className) {
        console.warn(`oh please dear god use "class"`)
      }
      if (typeof className === 'string') {
        this.element.setAttribute('class', className)
        delete this.props.class && delete this.props.className
        delete attr.class && delete attr.className
      } else {
        throw new Error(`Expected "string" but instead got ${ typeof attr.class }`)
      }
    }

    if (attr.id) {
      // TODO: Validate input
      this.element.id = attr.id
      delete attr.id
    }

    if (attr.style) {
      const styles = attr.style
      Object.keys(styles).map(prop => {
        const value = styles[prop]
        if (typeof value === 'number') {
          this.element.style[prop] = `${value}px`
        } else if (typeof value === 'string') {
          this.element.style[prop] = value
        } else {
          throw new Error(`Expected "number" or "string" but instead got "${ typeof value }"`)
        }
      })
    }

    if (this.props.store) {
      attachStore(this.element, this.props.store)
      delete attr.store && delete this.props.store
    }
    
    Object.keys(attr).forEach(prop => {
      const attrValue = attr[prop]
      if (attrValue && attrValue instanceof Attr) {
        this.element.setAttributeNode(attrValue)
      } else {
        this.element.setAttribute(prop, attr[prop])
      }
    })

    return this
  }

  parseChildren() {
    this.children.filter(childNode => childNode !== undefined && childNode !== null).map(childNode => {
      if (childNode instanceof HTMLElement || childNode instanceof SVGElement) {
        this.element.appendChild(childNode)
      } else if (childNode instanceof Array) {
        childNode.map(node => this.element.appendChild(node))
      } else if (typeof childNode === 'string' || typeof childNode === 'number') {
        this.element.appendChild(document.createTextNode(childNode))
      } else {
        throw new Error(`Expected "object" or "string" but instead got "${typeof value}"`)
      }
    })
    return this
  }
}
