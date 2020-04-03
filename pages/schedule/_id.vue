<template>
  <main class="card">
    <div class="font-bold text-lg mb-4">Event {{ slug }}</div>
    <div class="font-mono">
      <div
        v-for="participant in getList(slug)"
        :key="participant.email"
        class="border-b mb-2 p-2"
      >
        <p><span class="font-bold">Name:</span> {{ participant.name }}</p>
        <p><span class="font-bold">Email:</span> {{ participant.email }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import useRSVP from '~/use/rsvp'

export default {
  setup() {
    const { getRsvpResponse, updateRsvp, getCount, getList } = useRSVP()

    return {
      getRsvpResponse,
      updateRsvp,
      getCount,
      getList
    }
  },
  computed: {
    slug() {
      return this.$route.params.id
    }
  }
}
</script>
