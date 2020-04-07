<template>
  <div>
    <div
      v-for="participant in participants"
      :key="participant.email"
      class="border-b mb-2 p-2"
    >
      <div class="font-bold">{{ participant.name }}</div>
      <div>{{ participant.email }}</div>
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
