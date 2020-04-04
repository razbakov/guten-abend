import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import useCollection from '~/use/collection'

export default () => {
  const { uid, account } = useAuth()

  const { docs } = useCollection('participants')
  const { update } = useDoc('participants')

  const getRsvp = (eventId) =>
    docs.value.find(
      (item) => item.eventId === eventId && item.uid === uid.value
    )

  const getRsvpResponse = (eventId) =>
    (uid.value && getRsvp(eventId)?.rsvp) ?? null

  function getList(eventId, rsvp = 'yes') {
    return docs.value
      .filter((item) => item.eventId === eventId && item.rsvp === rsvp)
      .map((item) => item.participant)
  }

  const getCount = (eventId) => getList(eventId).length

  async function updateRsvp(eventId, collection, rsvp) {
    let rsvpObject = getRsvp(eventId)

    if (!rsvpObject) {
      rsvpObject = {
        uid: uid.value
      }
    }

    rsvpObject = {
      ...rsvpObject,
      participant: account.value,
      rsvp,
      eventId,
      collection
    }

    await update(rsvpObject)
  }

  return {
    getRsvp,
    getRsvpResponse,
    updateRsvp,
    getCount,
    getList
  }
}
