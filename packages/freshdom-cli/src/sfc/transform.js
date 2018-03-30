const babel = require('babel-core')

let defaultImportName = undefined
const renderStatement = template => `render() {
  return (${template})
}`

module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (defaultImportName) return;
        if (path.node.source.value === 'freshdom') {
          defaultImportName = path.node.specifiers.find(n => n.type === 'ImportDefaultSpecifier').local.name
        }
      },
      CallExpression(path, state) {
        if (state.opts.template && path.node.callee.name === defaultImportName) {
          path.node.arguments[0].body.body.body.push(state.opts.template)
        }
      }
    }
  }
}
