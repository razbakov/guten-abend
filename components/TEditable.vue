<template>
  <div class="card-item">
    <div v-if="!isEditing && can('edit', event)" class="float-right mr-2 mt-2">
      <nuxt-link
        v-if="isAdmin"
        class="underline mr-2"
        :to="`/schedule/${event.id}`"
      >
        Guests
      </nuxt-link>

      <button
        class="rounded border p-2 hover:bg-gray-200"
        @click="isEditing = true"
      >
        <svg
          class="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 383.947 383.947"
        >
          <g>
            <polygon
              xmlns="http://www.w3.org/2000/svg"
              points="0,303.947 0,383.947 80,383.947 316.053,147.893 236.053,67.893    "
            />
            <path
              d="M377.707,56.053L327.893,6.24c-8.32-8.32-21.867-8.32-30.187,0l-39.04,39.04l80,80l39.04-39.04     C386.027,77.92,386.027,64.373,377.707,56.053z"
            />
          </g>
        </svg>
      </button>
    </div>

    <div v-if="isEditing" class="px-6 py-4">
      <TForm
        v-model="event"
        :fields="fields"
        show-cancel
        show-remove
        @save="saveItem"
        @cancel="cancel"
        @remove="removeItem"
      />
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useDoc from '~/use/doc'
import useUtils from '~/use/utils'
import TForm from '~/components/TForm'

export default {
  components: { TForm },
  props: {
    event: {
      type: Object,
      default: () => ({})
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    data: {},
    isEditing: false
  }),
  mounted() {
    this.isEditing = this.editing
    this.data = { ...this.event }
  },
  setup() {
    const { uid, isAdmin, can } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()
    const { update, remove } = useDoc('meetups')
    const { getDay, getTime, getDate } = useUtils()

    return {
      uid,
      getRsvpResponse,
      updateRsvp,
      getCount,
      update,
      getDay,
      getTime,
      getDate,
      isAdmin,
      can,
      remove
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
