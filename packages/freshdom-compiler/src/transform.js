const babel = require('babel-core')

const {types: t} = babel
let defaultImportName = false

const addTemplateArgument = (component, template) => {
  component.arguments.push(t.stringLiteral(template))
}

module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (defaultImportName) return;
        if (path.node.source.value === 'freshdom') {
          defaultImportName = path.node.specifiers.find(n => n.type === 'ImportDefaultSpecifier').local.name
        }
      },
      Identifier(path) {
        if (path.node.name === defaultImportName) {
        if (!path.parentPath.isImportDefaultSpecifier()) {
            const component = path.findParent(p => p.isCallExpression())
            if (component && component.node) {
              addTemplateArgument(component.node)
            }
          }
        }
      }
    }
  }
}
