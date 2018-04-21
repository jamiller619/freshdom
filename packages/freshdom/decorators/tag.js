export default tagName => {
  return target => {
    Object.defineProperty(target, 'tag', {
      value: tagName
    })
  }
}
