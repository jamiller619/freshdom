const fs = require('fs-extra')
const path = require('./path')

const filesToCopy = {
  './LICENSE': path.dist('LICENSE'),
  './README.md': path.dist('README.md'),
  './build/package.json': path.dist('package.json')
}

fs.ensureDirSync(path.ROOT_DIST)

Object.keys(filesToCopy).map(file => {
  fs.copySync(file, filesToCopy[file])
})
