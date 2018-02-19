import createDOMElement from './dom/createDOMElement'
import attachChildrenToDOM from './dom/attachChildrenToDOM'
import mergePropsToDOM from './dom/mergePropsToDOM'

const TYPE = Symbol('fresh.dom.host')

const createDOM = (type, props = {}, ...children) => {
  if (props === null) {
    props = {}
  }

  const newProps = Object.assign({}, props)
  const newChildren = [...children]

  let dom = createDOMElement({ type, props: newProps })
  dom = mergePropsToDOM({ dom, props: newProps })
  dom = attachChildrenToDOM({ dom, children: newChildren })

  dom.$$__typeof = TYPE

  return dom
}

export default createDOM
