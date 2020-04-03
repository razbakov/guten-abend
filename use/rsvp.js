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

  const getRsvpResponse = (eventId) => getRsvp(eventId)?.rsvp ?? null

  const getList = (eventId) =>
    docs.value
      .filter((item) => item.eventId === eventId && item.rsvp === 'yes')
      .map((item) => item.participant)

  const getCount = (eventId) => getList(eventId).length

  async function updateRsvp(event, rsvp) {
    let rsvpObject = getRsvp(event.id)

    if (!rsvpObject) {
      rsvpObject = {
        uid: uid.value
      }
    }

    rsvpObject = {
      ...rsvpObject,
      participant: account.value,
      rsvp,
      eventId: event.id,
      event
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
