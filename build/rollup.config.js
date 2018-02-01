import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import banner from './banner'

const config = {}

const pathDev = file => `./lib/${ file }`
const pathDist = file => `./dist/${ file }`

const modules = [
  {
    name: 'jasmin',
    source: pathDev('jasmin.js')
  },
  {
    name: 'router',
    source: pathDev('router/index.js')
  },
  {
    name: 'store',
    source: pathDev('store/index.js')
  }
]

const pluginDefs = [resolve(), commonjs(), babel({
  exclude: 'node_modules/**'
}), cleanup()]

const make = (module, minify = false) => {
  const plugins = minify
    ? [...pluginDefs, babelMinify({ 
        comments: false
      })]
    : pluginDefs

  return {
    input: module.source,
    output: {
      file: `${ pathDist(module.name) }${ minify ? '.min' : '' }.js`,
      format: 'cjs'
    },
    plugins: plugins,
    banner: banner,
    interop: false
  }
}

config.default = modules.map(module => make(module))
config.minify = modules.map(module => make(module, true))

export default config[process.env.config]
