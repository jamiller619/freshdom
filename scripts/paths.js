'use strict'

const path = require('path')

const paths = {}
paths.ROOT = path.join(__dirname, '../')
paths.SRC = path.join(paths.ROOT, 'packages')
paths.DIST = path.join(paths.ROOT, 'dist')

module.exports = paths
