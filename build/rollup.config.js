import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'

const fpath = {
  dev: file => `lib/${ file }`,
  dist: file => `dist/${ file }`
}

const config = {}
const modules = ['', 'router', 'store']

const pluginDefs = [resolve(), commonjs(), babel({
  exclude: 'node_modules/**'
}), cleanup()]

const make = (module, minify = false) => {
  const resolvedName = module === '' ? 'jasmin' : module
  const plugins = minify
    ? [...pluginDefs, babelMinify({ comments: false })]
    : pluginDefs

  return {
    input: fpath.dev(`${ module }/index.js`),
    output: {
      file: `${ fpath.dist(resolvedName) }${ minify ? '.min' : '' }.js`,
      format: 'cjs'
      // format: 'iife',
      // name: resolvedName
    },
    plugins: plugins,
    interop: false
  }
}

config.default = modules.map(module => make(module))
config.minify = modules.map(module => make(module, true))

export default config[process.env.config]
