
/**
 * Simple example of Functional Element
 * that supplies the necessary route property
 */
const link = props => {
  const a = document.createElement('a')
  a.dataset.route = 'local'
  return a
}

export default link
