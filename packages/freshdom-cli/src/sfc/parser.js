const fs = require('fs-extra')
const util = require('util')
const babel = require('babel-core')
const parse5 = require('parse5')
const transform = require('./transform')

module.exports = class Parser {
  constructor(input, fileName) {
    this.fileName = fileName
    this.rootNode = parse5.parseFragment(input, {
      locationInfo: true
    })
  }

  saveFiles(dest) {
    const file = `${dest}/${this.fileName.replace('.es', '')}`
    // fs.outputFileSync(`${file}.html`, this.getTemplates)
    fs.outputFileSync(`${file}.css`, this.getStyleNodes())
    fs.outputFileSync(`${file}.js`, this.getScripts())
  }

  getTemplates() {
    return this.stringAdapter('template', nodes => {
      return nodes.map(node => parse5.serialize(node.content))
    })
  }

  getStyleNodes() {
    return this.stringAdapter('style', nodes => {
      return nodes.map(node => parse5.serialize(node))
    })
  }

  getScripts() {
    return this.stringAdapter('#text', nodes => {
      return nodes.map(node => node.value).reduce((acc, cur) => acc + cur)
    })
  }

  getNodes(tag) {
    return this.rootNode.childNodes.filter(node => {
      return tag === node.nodeName
    })
  }

  transform() {
    const templates = this.getTemplates()
    const scripts = this.getScripts()

    if (templates) {
      const {code, map, ast} = babel.transform(scripts, {
        babelrc: false
      })

      babel.transform(scripts, {
        plugins: [
          [transform, {
            "template": templates
          }]
        ]
      })
    }
  }

  stringAdapter(strNode, nodeReducer) {
    const nodes = this.getNodes(strNode)
    if (nodes.length) {
      const str = nodeReducer(nodes)
      if (str) {
        return String.raw`${str}`
      }
    }
    return ''
  }
}
