export const throttle = (func, wait) => {
  let prev = 0
  return (...args) => {
    let now = Date.now()
    if (now - prev >= wait) {
      func.apply(this, args)
      prev = now
    }
  }
}
