<template>
  <div class="md:flex justify-start items-center text-center">
    <div class="mr-4">
      <slot :count="getCount(id)" />
    </div>
    <div
      v-if="canAnswer"
      class="flex mt-4 md:mt-0 content-center justify-center"
    >
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
    },
    extra: {
      type: Object,
      default: () => ({})
    },
    canAnswer: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { confirmedAccount } = useAuth()
    const { getRsvpResponse, getCount, updateRsvp } = useRSVP()

    return {
      getRsvpResponse,
      getCount,
      updateRsvp,
      confirmedAccount
    }
  },
  methods: {
    rsvp(id, answer) {
      if (this.confirmedAccount) {
        this.updateRsvp(id, this.collection, answer, this.extra)
      } else {
        this.$router.push(
          `/rsvp/${this.id}/?rsvp=${answer}&back=${this.$route.fullPath}&collection=${this.collection}`
        )
      }
    }
  }
}
</script>
