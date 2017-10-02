
import UrlPattern from 'url-pattern';

const _dispatch = Symbol('dispatch');
const _pushState = Symbol('pushState');
const _saveRoute = Symbol('saveRoute');
const _findRoute = Symbol('findRoute');

class Router {
  constructor({ opts = { scrollRestoration: true }}) {
    this.opts = opts;
    this.history = [];
    this.routes = [];

    window.addEventListener('popstate', (e) => {
      this[_dispatch](e.state);
    });

    document.body.addEventListener('click', (e) => {
      const path = e.path || (e.composedPath && e.composedPath()) || this.composedPath(e.target);
      const el = path.find(el => el.dataset && (el.dataset.route === '' || el.dataset.route === 'true'))
      if (el) {
        e.preventDefault();
        this[_pushState]({
          url: el.pathname
        });
      }
    });

    // Handle scroll restoration option
    if (!this.opts.scrollRestoration === true && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }

  init() {
    // Handle initial page load
    this[_pushState]({
      url: window.location.pathname
    });
  }

  on(...args) {
    if (args[0] && typeof args[0] === 'string') {
      this[_saveRoute](args[0], args[1]);
    } else if (args[0] && typeof args[0] === 'object') {
      Object.entries(args[0]).map(e => {
        this[_saveRoute](e[0], e[1]);
      })
    }
    return this;
  }

  composePath(el) {
    let path = [];
    while (el) {
      path.push(el);
      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);

        return path;
      }
      el = el.parentElement;
    }
  }

  [_dispatch](state = {}) {
    if (state.url && state.url !== '') {
      const path = state.url;
      const route = this[_findRoute](path);
      if (route && route.action) route.action(route.url.match(path));
    }
  }

  [_pushState](state = {}) {
    if (state.url && state.url !== '') {
      window.history.pushState(state, '', state.url);
      this.history.push(state);
      this[_dispatch](state);
    }
  }

  [_saveRoute](url, action = function() {}) {
    if (!this[_findRoute](url)) {
      this.routes.push({
        url: new UrlPattern(url),
        action: action
      });
    }
  }

  [_findRoute](url) {
    return this.routes.find(route => {
      return url.match(route.url.regex);
    });
  }
}

export default Router;