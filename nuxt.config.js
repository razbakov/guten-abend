export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Instant Poll',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/firebase'
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  firebase: {
    config: {
      apiKey: 'AIzaSyBYRafQ1LpToLZspBY9uoe89Ao-4h-3X7Y',
      authDomain: 'tell-me-what-336d8.firebaseapp.com',
      databaseURL: 'https://tell-me-what-336d8.firebaseio.com',
      projectId: 'tell-me-what-336d8',
      storageBucket: 'tell-me-what-336d8.appspot.com',
      messagingSenderId: '99203117430',
      appId: '1:99203117430:web:16704fc542cb7157a84a57',
      measurementId: 'G-9NK95KY740'
    },
    services: {
      auth: {
        initialize: {
          onSuccessAction: 'auth/init'
        }
      },
      firestore: true,
      analytics: true
    }
  }
}
