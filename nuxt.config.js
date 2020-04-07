export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Guten Abend',
    bodyAttrs: {
      class: 'bg-light'
    },
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
  css: [
    '@/assets/css/typography.css',
    '@/assets/css/aspect-ratio.css',
    '@/assets/css/signup.css',
    '@/assets/css/nav.css',
    '@/assets/css/vendors.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/composition-api',
    '~/plugins/firebase',
    '~/plugins/router'
  ],
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
    '@nuxtjs/dotenv'
  ],
  pwa: {
    meta: {
      name: 'Guten Abend',
      description: 'Online Kantine'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
    }
  },
  generate: {
    routes: ['/', '/signup/', '/mafia/', '/salsa/', '/schedule/']
  },
  env: {
    firebase: {
      config: {
        apiKey: 'AIzaSyBEo2JLHYrGCAL0zIM5enhr50D7gxZHxgQ',
        authDomain: 'gutenabend-ea9a0.firebaseapp.com',
        databaseURL: 'https://gutenabend-ea9a0.firebaseio.com',
        projectId: 'gutenabend-ea9a0',
        storageBucket: 'gutenabend-ea9a0.appspot.com',
        messagingSenderId: '529618991089',
        appId: '1:529618991089:web:a3cad08d7e4d7f0c4a3650',
        measurementId: 'G-EQ7DKFZPJC'
      },
      services: {
        auth: true,
        firestore: true,
        analytics: true
      }
    }
  }
}
