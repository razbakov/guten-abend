import format from 'date-fns/format'

export default () => {
  function formatDate(val) {
    return format(new Date(val), 'H:mm')
  }

  return {
    formatDate
  }
}
