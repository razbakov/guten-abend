<template>
  <div class="font-sans leading-normal tracking-normal antialiased py-5">
    <nuxt />
  </div>
</template>

<script>
import useAuth from '~/use/auth'

export default {
  data: () => ({
    isMenuOpen: false,
    title: 'Guten Abend',
    description: 'Online Kantine',
    social: {
      twitter: 'https://twitter.com/AbendKantine'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Schedule', link: '/schedule/' },
      { text: 'Salsa Warm Up', link: '/salsa/' },
      { text: 'Mafia Game', link: '/mafia/' }
    ]
  }),
  watch: {
    $route() {
      this.isMenuOpen = false
    }
  },
  setup() {
    const { uid, account } = useAuth()

    return {
      uid,
      account
    }
  }
}
</script>
