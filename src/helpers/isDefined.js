
const isDefined = prop => {
  return prop !== null && 
    prop !== undefined && 
    prop !== '' && 
    prop !== ' '
}

export default isDefined
