import fs from 'fs-extra'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import copy from 'rollup-plugin-copy'

import banner from './banner'

const config = {}

const ROOT = path.join(__dirname, '../')
const ROOT_DIST = path.join(ROOT, 'dist')
const ROOT_DEV = path.join(ROOT, 'lib')

fs.ensureDirSync(ROOT_DIST)

const dev = file => path.join(ROOT_DEV, file)
const dist = file => path.join(ROOT_DIST, file)

// TODO: Add splitter for modules
// Had to add the Router module to Core...

const modules = [{
  name: 'fresh',
  source: dev('index.js')
},
// {
//   name: 'router',
//   source: dev('router/index.js')
// },
{
  name: 'store',
  source: dev('store/index.js')
}, {
  name: 'elements',
  source: dev('elements/index.js')
}]

const pluginDefs = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**'
  }),
  cleanup(),
  copy({
    './LICENSE': './dist/LICENSE'
  })
]

const make = (module, minify = false) => {
  const plugins = minify
    ? [
        ...pluginDefs,
        babelMinify({
          comments: false
        })
      ]
    : pluginDefs

  return {
    input: module.source,
    output: {
      banner: banner,
      file: `${dist(module.name)}${minify ? '.min' : ''}.js`,
      format: 'cjs'
    },
    plugins: plugins,
    interop: false
  }
}

config.default = modules.map(module => make(module))
config.minify = modules.map(module => make(module, true))

export default config[process.env.config]
