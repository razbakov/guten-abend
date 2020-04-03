<template>
  <div class="card-item">
    <div v-if="!isEditing && can('edit', event)" class="float-right mr-2 mt-2">
      <nuxt-link
        v-if="isAdmin"
        class="underline mr-2"
        :to="`/schedule/${event.id}`"
      >
        Followers
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
        show-cancel
        show-remove
        :fields="fields"
        @save="saveItem"
        @cancel="cancel"
        @remove="removeItem"
      />
    </div>
    <div v-else>
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{{ event.title }}</div>
        <div class="mb-2">{{ event.description }}</div>
        <div class="text-center font-bold py-2">
          {{ getCount(event.id) }} interested
        </div>
      </div>
      <div class="flex px-6 pb-4 justify-end">
        <p class="mr-4">Are you interested?</p>
        <div class="inline-flex">
          <button
            class="hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded-l"
            :class="{
              'bg-green-300': getRsvpResponse(event.id) === 'yes'
            }"
            @click="rsvp(event, 'yes')"
          >
            Yes
          </button>
          <button
            class="hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded-r"
            :class="{
              'bg-red-300': getRsvpResponse(event.id) === 'no'
            }"
            @click="rsvp(event, 'no')"
          >
            No
          </button>
        </div>
      </div>
      <div
        v-if="getRsvpResponse(event.id) === 'yes'"
        class="flex px-6 py-4 bg-gray-200 text-gray-700"
      >
        Let's get more people interested and schedule it for the next week.
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useDoc from '~/use/doc'
import TForm from '~/components/TForm'

export default {
  components: {
    TForm
  },
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
    isEditing: false,
    fields: [
      {
        name: 'title',
        label: 'Title',
        placeholder: 'Summarize your idea in 2-3 words'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'Describe your idea'
      }
    ]
  }),
  mounted() {
    this.isEditing = this.editing
    this.data = { ...this.event }
  },
  setup() {
    const { uid, can, isAdmin } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()
    const { update, remove } = useDoc('ideas')

    return {
      uid,
      getRsvpResponse,
      updateRsvp,
      getCount,
      update,
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
    },
    cancel() {
      this.isEditing = false
      this.$emit('cancel')
    },
    async saveItem(data) {
      this.cancel()
      await this.update(data)
    },
    async removeItem(id) {
      this.cancel()
      await this.remove(id)
    }
  }
}
</script>
