import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import minify from 'rollup-plugin-babel-minify'
import merge from 'merge-options'

const path = {
  src: (file) => `lib/${ file }`,
  dest: (file) => `dist/${ file }`
}

const config = {}

config.default = {
  input: path.src('index.js'),
  output: {
    file: path.dest('jasmin.js'),
    format: 'umd',
    name: 'jasmin'
  },
  plugins: [
    babel(),
    resolve(),
    commonjs()
  ]
}

config.minify = merge(config.default, {
  output: {
    file: path.dest('jasmin.min.js')
  },
  plugins: [
    babel(),
    resolve(),
    commonjs(),
    minify()
  ]
})

export default config[process.env.config]
