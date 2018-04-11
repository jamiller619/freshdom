import UrlPattern from 'url-pattern'

class Router {
  constructor() {
    this.history = []
    this.routes = []
    this.params = {}

    this.scrollRestoration = false

    window.addEventListener('popstate', e => {
      if (e && e.state) this.dispatch(e.state)
    })

    window.addEventListener('hashchange', () => {
      this.handleHashChangeEvent(location.hash)
    })

    document.body.addEventListener('click', this.handleBodyClick.bind(this))

    document.addEventListener('DOMContentLoaded', () => {
      this.pushState({
        url: window.location.pathname
      })
    })
  }

  on(...args) {
    if (args[0] && typeof args[0] === 'string') {
      this.saveRoute(args[0], args[1])
    } else if (args[0] && typeof args[0] === 'object') {
      Object.entries(args[0]).map(e => {
        this.saveRoute(e[0], e[1])
      })
    }
    return this
  }

  get scrollRestoration() {
    if ('scrollRestoration' in window.history) {
      return window.history.scrollRestoration
    }
    throw new Error(`Your browser doesn't support scrollRestoration`)
  }

  set scrollRestoration(value) {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = value ? 'auto' : 'manual'
    }
  }

  handleBodyClick(e) {
    const el = e.target.closest('a[data-route="local"]')
    if (el) {
      e.preventDefault()
      el.blur()
      if (el.hash) {
        this.handleHashChangeEvent(el.hash)
      } else {
        this.pushState({
          url: el.pathname
        })
      }
    }
  }

  handleHashChangeEvent(hash) {
    this.dispatch({url: hash})
    if (hash !== location.hash) {
      location.hash = hash
    }
  }

  dispatch(state) {
    if (state && state.url && state.url !== '') {
      const route = this.findRoute(state.url)
      if (route && route.action) {
        const params = route.url.match(state.url)
        Object.entries(params).forEach(([key, value]) => {
          this.params[key] = value
        })
        route.action(params)
      }
    }
  }

  pushState(state = {}) {
    if (state.url && state.url !== '') {
      if (window.history.state && window.history.state.url === state.url) {
        window.history.replaceState(state, '', state.url)
        if (this.history.length) this.history.pop()
      } else {
        window.history.pushState(state, '', state.url)
      }
      this.history.push(state)
      this.dispatch(state)
    }
  }

  saveRoute(url, action) {
    if (!this.findRoute(url)) {
      const route = {
        url: new UrlPattern(url),
        action: action
      }
      this.routes = [...this.routes, route]
    }
  }

  findRoute(url) {
    return this.routes.find(route => {
      return url.match(route.url.regex)
    })
  }
}

export default new Router()
