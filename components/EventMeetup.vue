<template>
  <div class="rounded bg-white mb-4 overflow-hidden shadow-lg w-full">
    <div v-if="!isEditing && canEdit" class="float-right mr-2 mt-2">
      <nuxt-link
        v-if="$route.query.admin"
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
      <form @submit.prevent="save">
        <div
          v-for="field in fields"
          :key="field.name"
          class="md:flex md:items-top mb-6"
        >
          <div class="md:w-1/3">
            <label
              :for="field.name"
              class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
            >
              {{ field.label }}
            </label>
          </div>
          <div class="md:w-2/3">
            <textarea
              v-if="field.type === 'textarea'"
              :id="field.name"
              v-model="data[field.name]"
              :placeholder="field.placeholder"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
            />
            <input
              v-else
              :id="field.name"
              v-model="data[field.name]"
              :placeholder="field.placeholder"
              :type="field.type || 'text'"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>
        </div>
        <button class="btn" type="submit">Save</button>
      </form>
    </div>
    <div v-else>
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{{ event.title }}</div>
        <Preview class="mb-2" :content="event.description" />
        <p class="text-gray-700 text-base">
          <strong class="font-bold">{{ getDay(event.date) }}</strong>
          {{ getDate(event.date) }} at {{ getTime(event.date) }} UTC
        </p>
        <div class="text-center font-bold">
          {{ getCount(event.id) }} participants
        </div>
      </div>
      <div class="flex px-6 pb-4 justify-end">
        <p class="mr-4">Do you want to join?</p>
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
        class="flex px-6 bg-gray-200"
      >
        <p v-if="event.link" class="text-gray-700">
          Zoom link:
          <a target="_blank" rel="noopener" :href="event.link">{{
            event.link
          }}</a>
        </p>
        <p v-else>
          Zoom link will appear here before the event. Check later.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import useRSVP from '~/use/rsvp'
import useDoc from '~/use/doc'
import useUtils from '~/use/utils'
import Preview from '~/components/Preview'

export default {
  components: {
    Preview
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
        placeholder: 'Summarize event in 2-3 words'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Describe event'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'datetime-local'
      },
      {
        name: 'link',
        label: 'Zoom Link'
      }
    ]
  }),
  computed: {
    canEdit() {
      return (
        !this.event ||
        this.event.createdBy === this.uid ||
        this.$route.query.admin
      )
    }
  },
  mounted() {
    this.isEditing = this.editing
    this.data = { ...this.event }
  },
  setup() {
    const { uid } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()
    const { update } = useDoc('meetups')
    const { getDay, getTime, getDate } = useUtils()

    return {
      uid,
      getRsvpResponse,
      updateRsvp,
      getCount,
      update,
      getDay,
      getTime,
      getDate
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
    async save() {
      await this.update(this.data)
      this.isEditing = false
      this.$emit('save')
    }
  }
}
</script>
