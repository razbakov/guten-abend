<template>
  <div>
    <div class="md:flex px-6 pb-4 justify-end items-center text-center">
      <div class="mr-4">
        <slot name="header" :count="getCount(item.id)" />
      </div>
      <div class="flex mt-4 md:mt-0 content-center justify-center">
        <button
          class="hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded-l"
          :class="{
            'bg-green-300': getRsvpResponse(item.id) === 'yes'
          }"
          @click="rsvp(item, 'yes')"
        >
          Yes
        </button>
        <button
          class="hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded-r"
          :class="{
            'bg-red-300': getRsvpResponse(item.id) === 'no'
          }"
          @click="rsvp(item, 'no')"
        >
          No
        </button>
      </div>
    </div>
    <div v-if="getRsvpResponse(item.id) === 'yes'">
      <slot />
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'

export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { uid } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()

    return {
      uid,
      getRsvpResponse,
      updateRsvp,
      getCount
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
