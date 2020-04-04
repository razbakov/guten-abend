<template>
  <main class="card">
    <div class="font-bold text-lg mb-4">Event</div>
    <div class="font-mono">
      <div
        v-for="participant in participants"
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
import useRouter from '~/use/router'

export default {
  setup() {
    const { params } = useRouter()
    const { getList } = useRSVP()

    const participants = getList(params.id)

    return {
      participants
    }
  }
}
</script>
