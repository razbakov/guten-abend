<template>
  <main class="container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
    <div class="typo w-full">
      <div>
        <h1>Schedule for this week</h1>
      </div>
      <div>
        <div
          v-for="event in events"
          :key="event.id"
          class="rounded bg-white mb-4 overflow-hidden shadow-lg w-full"
        >
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">{{ event.title }}</div>
            <p class="text-gray-700 text-base">
              <strong class="font-bold">{{ event.day }}</strong> at
              {{ event.time }}
            </p>
          </div>
          <div class="flex p-4 justify-between">
            <p>Are you coming?</p>
            <div class="inline-flex">
              <button
                class="hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded-l"
                :class="{
                  'bg-green-300': getRsvpResponse(event.id) === 'yes'
                }"
                @click="updateRsvp(event, 'yes')"
              >
                Yes
              </button>
              <button
                class="hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded-r"
                :class="{
                  'bg-red-300': getRsvpResponse(event.id) === 'no'
                }"
                @click="updateRsvp(event, 'no')"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth.js'
import useRSVP from '~/use/rsvp.js'

export default {
  data: () => ({
    events: [
      {
        title: 'Salsa Warm Up',
        time: '13:00 CET',
        day: 'Every Day',
        id: 'salsa'
      },
      {
        title: 'Resistance board game',
        time: '20:00 CET',
        day: 'Tuesday',
        id: 'resistance'
      },
      {
        title: 'Accountability group kick-off',
        time: '09:00 CET',
        day: 'Wednesday',
        id: 'accountability'
      },
      {
        title: 'Mafia Game',
        time: '20:00 CET',
        day: 'Wednesday',
        id: 'mafia'
      },
      {
        title: 'German Conversation Club',
        time: '20:00 CET',
        day: 'Thursday',
        id: 'german'
      },
      {
        title: 'Book Club',
        time: '19:00 CET',
        day: 'Friday',
        id: 'books'
      }
    ]
  }),
  setup() {
    const { uid } = useAuth()
    const { getRsvpResponse, updateRsvp } = useRSVP()

    return {
      uid,
      getRsvpResponse,
      updateRsvp
    }
  }
}
</script>