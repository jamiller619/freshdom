#!/usr/bin/env node

const rollup = require('rollup')
const path = require('path')
const dir = require('node-dir')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')

const modules = path.join(process.cwd(), 'lib/')

async function build(moduleDir) {
  const inputOptions = {
    input: path.join(modules, moduleDir, 'index.js'),
    plugins: [
      babel(),
      resolve(),
      commonjs()
    ]
  }
  const outputOptions = {
    file: `dist/${ moduleDir }.js`,
    format: 'umd',
    name: moduleDir
  }
  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
}

dir.files(modules, 'dir', (err, moduleDirs) => {
  if (err) throw err
  moduleDirs.forEach(moduleDir => {
    build(moduleDir)
  })
}, {
  recursive: false,
  shortName: true
})
