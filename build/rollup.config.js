import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import cleanup from 'rollup-plugin-cleanup'
import common from 'rollup-plugin-commonjs'
import banner from './banner'
const path = require('./path')

export default {
  input: [
    path.dev('fresh.js'),
    path.dev('router.js')
  ],
  output: {
    format: 'es',
    dir: path.ROOT_DIST,
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
