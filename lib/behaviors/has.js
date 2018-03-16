
export default (...behaviors) => Target => {
  behaviors.forEach(Behavior => {
    Target.prototype = Object.create(Behavior)
    Target.prototype.constructor = Target
  })
  return Target
}
