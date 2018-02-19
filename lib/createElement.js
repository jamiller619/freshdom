import parser from './parser'

const createElement = (sourceString, props = {}, ...children) => {
  if (props === null) props = {}

  let el = parser.sourceStringParser(sourceString, props, ...children)
  el = parser.propsParser(el, props)
  el = parser.childElementsParser(el, ...children)

  return el
}

export default createElement
