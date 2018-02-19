import Element from '../element'
import customElementsLib from '../customElementsLib'

export default props => {
  const a = document.createElement('a')
  a.dataset.route = 'local'
  return a
}
