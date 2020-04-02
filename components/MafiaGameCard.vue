<template>
  <div class="rounded bg-white mb-4 overflow-hidden shadow-lg w-full">
    <div v-if="!isEditing && can('edit', game)" class="float-right mr-2 mt-2">
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
      <TForm v-model="game" :fields="fields" @save="save" />
    </div>
    <div v-else>
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">{{ game.title }}</div>
        <p class="text-gray-700 text-base">
          Created {{ getDate(game.createdAt) }} at
          {{ getTime(game.createdAt) }} UTC
        </p>
        <div class="text-center font-bold">
          {{ getCount(game.id) }} participants
        </div>
      </div>
      <div class="flex px-6 pb-4 justify-end">
        <p class="mr-4">Do you want to join?</p>
        <div class="inline-flex">
          <button
            class="hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded-l"
            :class="{
              'bg-green-300': getRsvpResponse(game.id) === 'yes'
            }"
            @click="rsvp(game, 'yes')"
          >
            Yes
          </button>
          <button
            class="hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded-r"
            :class="{
              'bg-red-300': getRsvpResponse(game.id) === 'no'
            }"
            @click="rsvp(game, 'no')"
          >
            No
          </button>
        </div>
      </div>
      <div v-if="getRsvpResponse(game.id) === 'yes'" class="flex p-4">
        <router-link :to="`/mafia/game/${game.id}`" class="btn"
          >Join Game</router-link
        >
      </div>
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
  components: {
    TForm
  },
  props: {
    game: {
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
        placeholder: 'Give it a funny name'
      }
    ]
  }),
  mounted() {
    this.load()
  },
  setup() {
    const { uid, isAdmin, can } = useAuth()
    const { getRsvpResponse, updateRsvp, getCount } = useRSVP()
    const { update } = useDoc('mafia_games')
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
      can
    }
  },
  methods: {
    load() {
      this.isEditing = this.editing
      this.data = { ...this.game }
    },
    rsvp(event, answer) {
      this.updateRsvp(event, answer)
    },
    async save(data) {
      await this.update(data)
      this.isEditing = false
      this.$emit('save')
    }
  }
}
</script>
