const fs = require('fs-extra')
const finder = require('./finder')

const filesToCopy = {
  [finder.root('LICENSE')]: finder.dist('LICENSE'),
  [finder.dev('README.md')]: finder.dist('README.md'),
  [finder.dev('package.json')]: finder.dist('package.json')
}

fs.ensureDirSync(finder.ROOT_DIST)

Object.keys(filesToCopy).map(file => {
  fs.copySync(file, filesToCopy[file])
})
