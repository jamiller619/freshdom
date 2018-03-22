import fs from 'fs-extra'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelMinify from 'rollup-plugin-babel-minify'
import cleanup from 'rollup-plugin-cleanup'
import common from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import banner from './banner'

const ROOT = path.join(__dirname, '../')
const ROOT_DIST = path.join(ROOT, 'dist')
const ROOT_DEV = path.join(ROOT, 'src')

const dev = file => path.join(ROOT_DEV, file)
const dist = file => path.join(ROOT_DIST, file)

const filesToCopy = {
  './LICENSE': dist('LICENSE'),
  './README.md': dist('README.md'),
  './build/package.json': dist('package.json')
}

fs.ensureDirSync(ROOT_DIST)
Object.values(filesToCopy).map(file => {
  fs.removeSync(file)
})

export default {
  input: [
    dev('./fresh.js'),
    dev('./router.js')
  ],
  output: {
    format: 'es',
    dir: ROOT_DIST,
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
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    common({
      include: 'node_modules/**'
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    cleanup(),
    copy(filesToCopy)
  ]
}
