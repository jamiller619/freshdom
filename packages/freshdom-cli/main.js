#!/usr/bin/env node

'use strict';

const fs = require('fs-extra')
const util = require('util')
const chalk = require('chalk')
const FileHound = require('filehound')
const Parser = require('./src/sfc/parser')

FileHound.create().paths('./').ext('sfc').find().each(file => {
  // console.log(chalk.dim(`Reading file "${file}"`))
  const contents = fs.readFileSync(file, 'utf8')
  // console.log(chalk.blue(`File contents: ${contents}`))
  const parser = new Parser(contents, file)
  
  // parsed.transform()

  // console.log(chalk.blue(`Saving files...`))
  // parsed.saveFiles('./dist')
})
