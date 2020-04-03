<template>
  <main class="p-4">
    <div class="md:flex items-baseline justify-between mb-4">
      <h1 class="text-3xl font-bold">Schedule</h1>
      <button v-if="isAdmin" class="btn" @click="addingEvent = true">
        Add Event
      </button>
    </div>

    <EventMeetup
      v-if="addingEvent"
      :editing="true"
      @save="addingEvent = false"
    />

    <EventMeetup v-for="event in events" :key="event.id" :event="event" />

    <div class="hero">
      <h2 class="text-2xl font-bold mb-4">Want more?</h2>
      <nuxt-link to="/ideas" class="btn-secondary">See ideas</nuxt-link>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useCollection from '~/use/collection'
import EventMeetup from '~/components/EventMeetup'

export default {
  components: {
    EventMeetup
  },
  data: () => ({
    addingEvent: false
  }),
  setup() {
    const { uid, isAdmin } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()
    const { docs: ideas } = useCollection('ideas')
    const { docs: events } = useCollection('meetups', 'date')

    return {
      uid,
      getRsvpResponse,
      updateRsvp,
      getCount,
      ideas,
      events,
      isAdmin
    }
  },
  methods: {
    rsvp(event, answer) {
      if (this.uid) {
        this.updateRsvp(event, answer)
      } else {
        alert('This action requires login')
        this.$router.push('/signup')
      }
    }
  }
}
</script>
