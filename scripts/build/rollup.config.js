import path from 'path'
import deepExtend from 'deep-extend'

import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from 'rollup-plugin-commonjs'

const paths = require('../paths')
const packages = require('./packages')

// TODO: someday!
// import banner from './banner'

/**
 * freshdom packages
 *
 * This should simply iterate all folders in the `packages` dir, but there are
 * projects that are have just started, and I don't want to commit them yet
 *
 * If options need to be passed to rollup, define them in a `rollup` object on the root
 */
const pkgConfigs = [
  {
    name: packages.core
  },
  {
    name: packages.router
  },
  {
    name: packages.proptypes
  },
  {
    name: packages.utils,
    rollup: {
      external: ['fastdom', 'fastdom/extensions/fastdom-promised']
    }
  }
]

// Our base rollup configuration
const generateConfig = (input, output, options = {}) => {
  return deepExtend(
    {
      input: input,
      output: {
        file: output,
        format: 'cjs',
        // format: 'es',
        // sourcemap: true,
        interop: false
      },
      plugins: [
        resolve({
          jsnext: true,
          browser: true
        }),
        babel({
          exclude: 'node_modules/**'
        }),
        commonjs(),
        cleanup()
      ]
    },
    options
  )
}

export default pkgConfigs.map(pkg => {
  return generateConfig(
    path.join(paths.SRC, pkg.name, 'index.js'),
    path.join(paths.DIST, pkg.name, 'index.js'),
    pkg.rollup
  )
})
