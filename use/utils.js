import format from 'date-fns/format'

export default () => {
  function getDate(val) {
    return format(new Date(val), 'dd MMM')
  }

  function getDay(val) {
    return format(new Date(val), 'iiii')
  }

  function getTime(val) {
    return format(new Date(val), 'H:mm')
  }

  return {
    getDay,
    getTime,
    getDate
  }
}
