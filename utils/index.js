import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export const formatTime = (time) => {
  const now = dayjs()
  const targetTime = dayjs(time)
  const diffInDays = now.diff(targetTime, 'day')

  if (diffInDays < 3) {
    return targetTime.fromNow()
  }

  return targetTime.format('YYYY-MM-DD HH:mm')
}

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

export const splitFileName = (fileName) => {
  const matches = fileName.match(/([^\/]+)\.(\w+)$/)

  if (matches) {
    return [matches[1], matches[2].toLowerCase()]
  } else {
    return null
  }
}
