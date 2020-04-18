<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen"
  >
    <div v-if="isAdmin" class="bg-black text-white p-2">
      <router-link class="p-2" to="/admin/pages">Pages</router-link>
      <router-link class="p-2" to="/admin/campaigns">Campaigns</router-link>
      <router-link class="p-2" to="/accounts">Accounts</router-link>
      <router-link class="p-2" to="/rsvp">RSVP</router-link>
      <router-link class="p-2" to="/mafia/game">Mafia Game</router-link>
      <router-link class="p-2" to="/superadmin/logout">Logout</router-link>
    </div>
    <THeader />
    <div class="container w-full mx-auto md:max-w-xl min-h-screen">
      <nuxt />
    </div>
    <footer
      class="md:flex text-center p-4 text-white bg-dark justify-end items-center"
    >
      <div class="m-3 text-md font-bold">
        Join Chat
      </div>
      <div class="m-3">
        <a
          class="underline hover:no-underline hover:text-red-500"
          :href="social.slack"
          target="_blank"
          rel="noopener noreferrer"
        >
          Slack
        </a>
      </div>
      <div class="m-3 text-md font-bold">
        Follow us
      </div>
      <div class="m-3">
        <a
          class="underline hover:no-underline hover:text-blue-500"
          :href="social.twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </div>
      <div class="m-3">
        <a
          class="underline hover:no-underline hover:text-pink-500"
          :href="social.instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
      </div>
      <div class="m-3">
        <a
          class="underline hover:no-underline hover:text-blue-500"
          :href="social.facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import THeader from '~/components/THeader'
import useAuth from '~/use/auth'

export default {
  components: {
    THeader
  },
  data: () => ({
    social: {
      twitter: 'https://twitter.com/AbendKantine',
      instagram: 'https://www.instagram.com/AbendKantine',
      facebook: 'https://www.facebook.com/abendkantine',
      slack:
        'https://join.slack.com/t/guten-abend/shared_invite/zt-dkaf1w0m-GJFmiVjeUJ4NW4t~RC7eTQ'
    }
  }),
  setup() {
    const { isAdmin } = useAuth()

    return {
      isAdmin
    }
  }
}
</script>
