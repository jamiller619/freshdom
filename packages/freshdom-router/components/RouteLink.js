export default props => {
  const a = document.createElement('a')
  a.dataset.route = 'local'
  a.tabindex = '-1'
  return a
}
