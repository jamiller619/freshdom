![freshdom](https://jamiller.me/static/fresh-logo.jpg)
<p>
  [![badge-better-code-hub]][url-bch]
  [![badge-npm]][url-npm]
  [![badge-npm-downloads]][url-npm]
  ![badge-license]
</p>
A fresh approach to creating modern user interfaces on the web with a focus on standards.

<hr />

So why use Fresh?
 - You want to develop a UI with a modern, **component-based** architecture and **JSX**.
 - You want **little to no overhead** when learning this new library or framework.
 - You like the idea of Web Components, especially Custom Elements.
 - You want a library to include **simple yet scalable and extensible** modules that solve common problems like **routing** and **state management**.
 - Allow for both **functional** and **classical OO** styles.

And that's why I made Fresh. So without further ado, lets jump right in.

## Install
via [npm][url-npm] or [yarn][url-yarn] as the `freshdom` package. Also available on a CDN via [unpkg](https://unpkg.com/freshdom/).

## A few examples

```js
import fresh from 'freshdom'

const App = props => (
  <main>
    <h1>Hey, { props.user }!</h1>
  </main>
)

document.body.appendChild(<App user="Jeff" />)
```
Okay, so this is pretty basic, but shows what a *functional, stateless component* in Fresh looks like.

And here is something a bit more complex that creates a Custom Element:

```js
import fresh, { tag, observe } from 'freshdom'

@tag('crypto-app')
class App {
  @observe
  currentPrice = undefined

  endpoint = 'https://api.coinbase.com/v2/prices/BTC-USD/spot'

  async fetchPrice() {
    const response = await fetch(this.endpoint).then(result => result.json())
    if (response && response.data) {
      this.currentPrice = response.data.amount
    }
  }

  onAttach() {
    this.timer = setInterval(() => this.fetchPrice(), 1000)
  }

  onDetach() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <template>
        <h2>BTC</h2>
        <div class="price">{ this.currentPrice }</div>
      </template>
    )
  }
}

document.body.appendChild(<App />)
```
Ok, so a few things to take note of here:
 1. Instead of using the `extends` keyword to inherit from a base class, Fresh elements are defined by the `@tag` decorator, and are responsible for transforming our `App` component into an `HTMLElement`. In addition, this allows `App` to extend any class we want without losing any inheritance along the way.
 1. The root `<template>` node in our render function is not required and will not be rendered in the HTML output. It is simply a convenience feature to satisfy the JSX requirement of having a single root node.
 1. Notice the `class` attribute in `<div class="price">`? Yeah, `className` is unnecessary, and discouraged in favor of `class`. But either would work.

## API (Coming Soon)

---

Created with ❤ &nbsp;by Jeff Miller – [@jamiller619](https://twitter.com/jamiller619)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://jamiller.me](https://jamiller.me) – [hello@jamiller.me](hello@jamiller.me)

<!-- Markdown link & img dfn's -->
[url-npm]: https://npmjs.org/package/freshdom
[url-yarn]: https://yarnpkg.com/en/package/freshdom
[url-bch]: https://bettercodehub.com/results/jamiller619/freshdom
[badge-npm]: https://img.shields.io/npm/v/freshdom.svg?style=flat-square
[badge-npm-downloads]: https://img.shields.io/npm/dw/freshdom.svg?style=flat-square
[badge-better-code-hub]: https://bettercodehub.com/edge/badge/jamiller619/freshdom?branch=master&style=flat-square
[badge-license]: https://img.shields.io/github/license/jamiller619/freshdom.svg?style=flat-square