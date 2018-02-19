// import parser from './index'
const parse = require('./index.js').parse

const file = `
// header.jsml

// import all the things
import jasmin from 'jasmin'
import from 'jasmin/jsm-link'
import from './header-menu'
import from './style-vars'

// Presentation definition - in authentic CSS!
// Ablility to define different types via "type" attribute
<style type="text/scss" scoped>
  .header {
    display: flex;
    align-items: center;
    color: $black;

    .brand {
      fill: currentColor;
    }

    .nav,
    .brand,
    .menu {
      flex: 1 1 0;
    }

    .menu {
      justify-content: flex-end;
    }
  }
</style>

// Content definition template - with optional JSX syntax
<app-header type="text/jsx" class="header">
  <div class="nav">
    <jsm-link href="/" class="btn-back">
      <svg viewBox="0 0 11.6 20" class="back" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polygon points="11.6 18.6 2.9 9.8 11.5 1.3 10 0 0 10 10.1 20" />
      </svg>
    </jsm-link>
  </div>
  <div class="brand">
    <svg viewBox="-7 5 210 68" class="logo" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g id="logo">
        <path d="M 152 57 L 204 57 L 204 5.25 L 178 27.22 L 152 5.25 L 152 57 Z" />
        <path d="M 76.83 57 L 129.56 57 L 103.19 5.04 L 76.83 57 Z" />
        <path d="M 55 28.31 L 55 28.47 C 55 44.51 42.93 57.2 26.44 57.2 C 15.64 57.21 9.21 53.38 3.45 47.23 L 44.72 5.25 C 51.21 10.56 55 19.31 55 28.31 Z" />
      </g>
    </svg>
  </div>
  <app-menu class="menu" />
</app-header>

// #FreeJavaScript2018 - JSML don't need yo <script> tags!
export default class extends jasmin.Element {
  onAttach () {
    this.$logo = this.querySelector('.logo')
    this.$backBtn = this.querySelector('.btn-back')
    this.$backBtn.addEventListener('click', () => history.back())
  }

  hideBackButton () {
    this.$backBtn.classList.add('hidden')
  }

  showBackButton () {
    this.$backBtn.classList.remove('hidden')
  }
}

`
const parsedContents = parse(file, 'style')

console.log(parsedContents)
