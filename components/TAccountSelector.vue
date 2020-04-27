<template>
  <div>
    <div class="flex">
      <TButton type="secondary" class="mr-2" @click="showPopup = true"
        >Select accounts ({{ count }})</TButton
      >
      <TButton type="secondary" @click="showImport = true">Import</TButton>
    </div>
    <template v-if="showImport">
      <TField v-model="csv" type="textarea" class="mb-2" />
      <TButton @click="startImport">Import</TButton>
    </template>
    <template v-if="showPopup">
      <div
        class="fixed z-10 w-full top-0 left-0 bottom-0 h-screen bg-black opacity-50 border-l p-4"
      ></div>
      <div
        class="fixed z-20 md:w-1/3 w-full top-0 right-0 bottom-0 h-screen bg-light border-l px-4 overflow-scroll z-50"
      >
        <div
          class="sticky top-0 py-4 bg-light flex justify-between items-center"
        >
          <div>
            <div class="font-bold">Select accounts ({{ count }})</div>
            <div class="flex">
              <button
                class="p-1 underline hover:no-underline"
                @click="selectAll(true)"
              >
                All
              </button>
              <button
                class="p-1 underline hover:no-underline"
                @click="selectAll(false)"
              >
                None
              </button>
            </div>
            <div class="inline-block relative">
              <select
                v-model="selectedEvent"
                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All events</option>
                <option
                  v-for="event in events"
                  :key="event.id"
                  :value="event.id"
                  >{{ event.title }} - {{ getDate(event.date) }} at
                  {{ getTime(event.date) }}</option
                >
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <TButton @click="save">Finish</TButton>
        </div>

        <div>
          <div
            v-for="item in items"
            :key="item.id"
            :class="{ 'border-green-500': item.selected }"
            class="p-4 mb-4 card-item border-2 border-white"
            @click="select(item)"
          >
            <div
              class="float-right border w-4 h-4 rounded-full border-gray-500"
              :class="selected[item.id] ? 'bg-green-500 border-green-500' : ''"
            ></div>
            <div class="font-bold">
              {{ item.name }}
            </div>
            <div>
              {{ item.email }}
            </div>
            <div v-if="item.newsletter === 'no'" class="text-red-500">
              No newsletter
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import { computed, ref } from '@vue/composition-api'
import useAuth from '~/use/auth'
import useCollection from '~/use/collection'
import TButton from '~/components/TButton'
import TField from '~/components/TField'
import { sortBy, getTime, getDate } from '~/utils'

export default {
  components: {
    TButton,
    TField
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showPopup: false,
    showImport: false,
    selected: {},
    csv: ''
  }),
  setup() {
    const { isAdmin } = useAuth()
    const { docs } = useCollection('accounts')
    const { docs: docEvents } = useCollection('meetups')
    const { docs: participants } = useCollection('participants')
    const selectedEvent = ref('')

    const items = computed(() =>
      docs.value
        .map((item) => ({
          ...item,
          events: participants.value
            .filter(
              (participant) =>
                participant.uid === item.id && participant.rsvp === 'yes'
            )
            .map((participant) => participant.eventId)
        }))
        .filter(
          (item) =>
            !item.hidden &&
            (!selectedEvent.value || item.events.includes(selectedEvent.value))
        )
        .sort(sortBy('-createdAt'))
    )

    const events = computed(() => docEvents.value.sort(sortBy('-date')))

    return {
      isAdmin,
      items,
      events,
      getTime,
      getDate,
      selectedEvent
    }
  },
  computed: {
    count() {
      return Object.keys(this.selected).length
    }
  },
  watch: {
    value: 'load'
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
    this.load()
  },
  methods: {
    load() {
      this.selected = this.value
    },
    select(item, mark) {
      if (typeof mark === 'undefined') {
        mark = !this.selected[item.id]
      }

      if (mark) {
        Vue.set(this.selected, item.id, {
          email: item.email,
          name: item.name
        })
      } else {
        Vue.delete(this.selected, item.id)
      }
    },
    selectAll(mark) {
      this.items.forEach((item) => {
        this.select(item, mark)
      })
    },
    save() {
      this.showPopup = false
      this.$emit('input', this.selected)
    },
    sanitize(value) {
      return value.replace(/[^a-z0-9]/gim, '')
    },
    startImport() {
      this.showImport = false

      const lines = this.csv.split('\n').map((l) => {
        const [name, email] = l.split('\t')
        return {
          name,
          email
        }
      })

      const result = {}

      lines.forEach((line) => {
        result[this.sanitize(line.email)] = line
      })

      this.$emit('input', result)
    }
  }
}
</script>
