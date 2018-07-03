export const isElement = node =>
  node && (Number.isInteger(node.nodeType) || node instanceof window.Element || node.includes && node.includes('-'))

export const isFragment = node => isElement(node) && node.nodeType === 11

export const isTemplate = node =>
  isElement(node) && node instanceof window.HTMLTemplateElement
