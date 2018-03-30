'use strict'

var path = require('path')
var finder = {}

finder.ROOT = path.join(__dirname, '../')
finder.ROOT_DEV = path.join(finder.ROOT, 'packages/freshdom')
finder.ROOT_DIST = path.join(finder.ROOT, 'dist/freshdom')

const composePath = (filePath, file) => path.join(filePath, file)

finder.root = file => composePath(finder.ROOT, file)
finder.dev = file => composePath(finder.ROOT_DEV, file)
finder.dist = file => composePath(finder.ROOT_DIST, file)

module.exports = finder
