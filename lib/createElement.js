import parser from './parser'

const createElement = (source, props = {}, ...children) => {
  if (props === null) props = {}
  let el = parser.parseSource(source, props)
  el = parser.parseProps(el, props)
  el = parser.parseChildren(el, ...children)

  return el
}

export default createElement
