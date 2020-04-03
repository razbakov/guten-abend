<template>
  <main class="p-4">
    <div class="typo w-full">
      <div class="md:flex items-baseline justify-between mb-4">
        <h1 id="ideas">Schedule</h1>
        <button v-if="isAdmin" class="btn" @click="addingEvent = true">
          Add Event
        </button>
      </div>

      <EventMeetup
        v-if="addingEvent"
        :editing="true"
        @save="addingEvent = false"
      />

      <div>
        <EventMeetup v-for="event in events" :key="event.id" :event="event" />
      </div>

      <div class="hero typo">
        <h2>Want more?</h2>
        <nuxt-link to="/ideas" class="btn-secondary">See ideas</nuxt-link>
      </div>
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
