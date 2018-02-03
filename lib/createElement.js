import parser from './parser'

// const namePropCheck = (element, props) => {
//   if (element && element.name) {
//     let name = element.name
//     const newElement = customElements.get(name)
//     if (newElement !== undefined && newElement.hasAttribute) {
//       element = customElementsLib.create({ 
//         target: newElement, params: props
//       })
//       delete attr.name && delete props.name
//     }
//   }
//   return element
// }

const createElement = (sourceString, props = {}, ...children) => {
  if (props === null) props = {}
  
  // namePropCheck(sourceString, props)

  let el = parser.sourceStringParser(sourceString, props)
  el = parser.propsParser(el, props)
  el = parser.childElementsParser(el, ...children)

  return el
}

export default createElement
