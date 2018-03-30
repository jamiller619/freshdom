import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import cleanup from 'rollup-plugin-cleanup'
import common from 'rollup-plugin-commonjs'
import banner from './banner'

const finder = require('./finder')

export default {
  input: [
    finder.dev('fresh.js'),
    finder.dev('router.js')
  ],
  output: {
    format: 'es',
    dir: finder.ROOT_DIST,
    sourcemap: true,
    interop: false
  },
  experimentalCodeSplitting: true,
  experimentalDynamicImport: true,
  external: [
    'fastdom',
    'fastdom/extensions/fastdom-promised'
  ],
  plugins: [
    resolve({
      jsnext: true,
      browser: true
    }),
    common(),
    babel({
      exclude: 'node_modules/**'
    }),
    cleanup()
  ]
}
