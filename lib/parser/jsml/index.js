const parse5 = require('parse5')

const NTYPE_STYLE = ['style']
const NTYPE_TEMPLATE = ['template']
const NTYPE_SCRIPT = ['script', '#text']

const parseTree = tree => {
  const nodes = {
    styles: [],
    scripts: [],
    templates: []
  }

  tree.childNodes.forEach(node => {
    if (!node) return
    if (NTYPE_STYLE.includes(node.nodeName)) {
      nodes.styles.push(node)
    } else if (NTYPE_SCRIPT.includes(node.nodeName)) {
      nodes.scripts.push(node)
    } else if (node.nodeName.includes('-') || NTYPE_TEMPLATE.includes(node.nodeName)) {
      nodes.templates.push(node)
    }
  })

  return nodes
}

module.exports.parse = input => {
  const tree = parse5.parseFragment(input, { locationInfo: true })
  return parseTree(tree)
}
