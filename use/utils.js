import format from 'date-fns/format'

export default () => {
  function getDate(val) {
    if (!val) return ''
    return format(new Date(val), 'd MMM')
  }

  function getDay(val) {
    if (!val) return ''
    return format(new Date(val), 'iiii')
  }

  function getTime(val) {
    if (!val) return ''
    return format(new Date(val), 'H:mm')
  }

  return {
    getDay,
    getTime,
    getDate
  }
}
