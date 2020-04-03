<template>
  <main class="container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
    <div class="typo w-full">
      <div class="flex items-baseline justify-between">
        <h1 id="ideas">Ideas</h1>
        <button class="btn" @click="addIdea">
          Add your idea
        </button>
      </div>

      <EventIdea v-if="addingIdea" :editing="true" @save="addingIdea = false" />

      <p>Mark those that you like and we will plan it for the next week.</p>

      <div>
        <EventIdea v-for="event in ideas" :key="event.id" :event="event" />
      </div>

      <div class="typo">
        <p>
          We are also looking for creators and animators, who would like to
          contribute to our club and share some fun with us!
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useCollection from '~/use/collection'
import EventIdea from '~/components/EventIdea'

export default {
  components: {
    EventIdea
  },
  data: () => ({
    addingIdea: false
  }),
  setup() {
    const { uid } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()
    const { docs: ideas } = useCollection('ideas')
    const { docs: events } = useCollection('meetups', 'date')

    return {
      uid,
      getRsvpResponse,
      updateRsvp,
      getCount,
      ideas,
      events
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
    },
    addIdea() {
      if (this.uid) {
        this.addingIdea = true
      } else {
        alert('This action requires login')
        this.$router.push('/signup')
      }
    }
  }
}
</script>
