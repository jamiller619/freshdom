#!/bin/bash
'use strict'

const path = require('path')
const fs = require('fs-extra')

const packages = require('./build/packages')
const {SRC, DIST} = require('./paths')

// The files we need to copy to the dist folder
const staticModuleFiles = [
  'LICENSE',
  'README.md',
  'package.json',
  'package-lock.json'
]

const copyStaticFiles = pkgName => {
  staticModuleFiles.forEach(file => {
    const input = path.join(SRC, pkgName, file)
    const output = path.join(DIST, pkgName, file)

    // These files best exist!
    // ...they really should though, they are required
    fs.copy(input, output)
  })
}

Object.values(packages).forEach(pkg => {
  const distPath = path.join(DIST, pkg)
  fs.ensureDir(distPath)
  copyStaticFiles(pkg)
})
