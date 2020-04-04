<template>
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
</template>

<script>
import useRSVP from '~/use/rsvp'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  setup(params) {
    const { getList } = useRSVP()

    const participants = getList(params.id)

    return {
      participants
    }
  }
}
</script>
