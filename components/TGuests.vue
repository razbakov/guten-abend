<template>
  <div>
    <div
      v-for="rsvp in rsvps"
      :key="rsvp.participant.email"
      class="border-b mb-2 p-2"
    >
      <div class="font-bold">{{ rsvp.participant.name }}</div>
      <div class="flex">
        <div v-if="rsvp.calendar" class="mr-2">calendar</div>
        <div v-if="rsvp.zoom" class="mr-2">zoom</div>
        <div v-if="rsvp.attachment" class="mr-2">attachment</div>
        <div v-if="rsvp.feedback" class="mr-2">rated {{ rsvp.feedback }}</div>
      </div>
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
    const { getListRsvps } = useRSVP()

    const rsvps = getListRsvps(params.id)

    return {
      rsvps
    }
  }
}
</script>
