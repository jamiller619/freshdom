import createDOMElement from './dom/createDOMElement'
import attachChildrenToDOM from './dom/attachChildrenToDOM'
import mergePropsToDOM from './dom/mergePropsToDOM'

const TYPE = Symbol('fresh.dom.host')

const createDOM = (name, props = {}, ...children) => {
  if (props === null) {
    props = {}
  }
  
  const newChildren = [...children]
  let domContainer = {}

  domContainer = createDOMElement({name, props: props})
  domContainer = mergePropsToDOM({domContainer, props: props})
  domContainer = attachChildrenToDOM({domContainer, children: newChildren})

  domContainer.node.$$__typeof = TYPE

  return domContainer.node
}

export default createDOM
