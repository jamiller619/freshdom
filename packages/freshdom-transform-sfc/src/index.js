const fs = require('fs-extra')
const util = require('util')
const chalk = require('chalk')
const FreshParser = require('./fresh-parser')

const files = ['./home.es']

files.map(file => {
  // console.log(chalk.dim(`Reading file "${file}"`))
  const contents = fs.readFileSync(file, 'utf8')
  // console.log(chalk.blue(`File contents: ${contents}`))
  const parsed = new FreshParser(contents, file)
  
  parsed.transform()

  // console.log(chalk.blue(`Saving files...`))
  parsed.saveFiles('./dist')
})
