<template>
  <div>
    <div class="md:flex px-6 pb-4 justify-end items-center text-center">
      <div class="mr-4">
        <slot name="header" :count="getCount(id)" />
      </div>
      <div class="flex mt-4 md:mt-0 content-center justify-center">
        <button
          class="hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded-l"
          :class="{
            'bg-green-300': getRsvpResponse(id) === 'yes'
          }"
          @click="rsvp(id, 'yes')"
        >
          Yes
        </button>
        <button
          class="hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded-r"
          :class="{
            'bg-red-300': getRsvpResponse(id) === 'no'
          }"
          @click="rsvp(id, 'no')"
        >
          No
        </button>
      </div>
    </div>
    <div v-if="getRsvpResponse(id) === 'yes'">
      <slot />
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    }
  },
  setup() {
    const { uid } = useAuth()
    const { getRsvpResponse, getCount, updateRsvp } = useRSVP()

    return {
      getRsvpResponse,
      getCount,
      updateRsvp,
      uid
    }
  },
  methods: {
    rsvp(id, answer) {
      if (this.uid) {
        this.updateRsvp(id, this.collection, answer)
      } else {
        this.$router.push(
          `/rsvp/${this.id}/?rsvp=no&back=${this.$route.fullPath}&collection=${this.collection}`
        )
      }
    }
  }
}
</script>
