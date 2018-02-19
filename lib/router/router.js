import UrlPattern from 'url-pattern'

class Router {
  constructor() {
    this.history = []
    this.routes = []
    this.params = {}

    this.scrollRestoration = false

    window.addEventListener('popstate', e => {
      if (e && e.state) this.__dispatch(e.state)
    })

    window.addEventListener('hashchange', () => {
      this.__handleHashChangeEvent(location.hash)
    })

    document.body.addEventListener('click', e => {
      const el = e.target.closest('a[data-route="local"]')
      if (el) {
        e.preventDefault()
        el.blur()
        if (el.hash) {
          this.__handleHashChangeEvent(el.hash)
        } else {
          this.__pushState({
            url: el.pathname
          })
        }
      }
    })

    document.addEventListener('DOMContentLoaded', () => {
      this.__pushState({
        url: window.location.pathname
      })
    })
  }

  on (...args) {
    if (args[0] && typeof args[0] === 'string') {
      this.__saveRoute(args[0], args[1])
    } else if (args[0] && typeof args[0] === 'object') {
      Object.entries(args[0]).map(e => {
        this.__saveRoute(e[0], e[1])
      })
    }
    return this
  }

  get scrollRestoration () {
    if ('scrollRestoration' in window.history) {
      return window.history.scrollRestoration
    }
    throw new Error(`Your browser doesn't support scrollRestoration`)
  }

  set scrollRestoration (value) {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = value ? 'auto' : 'manual'
    }
  }

  __handleHashChangeEvent (hash) {
    this.__dispatch({ url: hash })
    if (hash !== location.hash) {
      location.hash = hash
    }
  }

  __dispatch (state) {
    if (state && state.url && state.url !== '') {
      const route = this.__findRoute(state.url)
      if (route && route.action) {
        const params = route.url.match(state.url)
        Object.entries(params).forEach(([key, value]) => {
          this.params[key] = value
        })
        route.action(params)
      }
    }
  }

  __pushState (state = {}) {
    if (state.url && state.url !== '') {
      if (window.history.state && window.history.state.url === state.url) {
        window.history.replaceState(state, '', state.url)
        if (this.history.length) this.history.pop()
      } else {
        window.history.pushState(state, '', state.url)
      }
      this.history.push(state)
      this.__dispatch(state)
    }
  }

  __saveRoute (url, action) {
    if (!this.__findRoute(url)) {
      const route = {
        url: new UrlPattern(url),
        action: action
      }
      this.routes = [...this.routes, route]
    }
  }

  __findRoute (url) {
    return this.routes.find(route => {
      return url.match(route.url.regex)
    })
  }
}

const router = new Router()

export default router
