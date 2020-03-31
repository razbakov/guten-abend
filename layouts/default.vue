<template>
  <div class="font-sans leading-normal tracking-normal antialiased">
    <header>
      <nav class="flex items-center text-dark justify-between flex-wrap p-6">
        <div class="flex mb-4">
          <img
            class="w-16 h-16 mr-4"
            src="/img/logo.svg"
            alt="Guten Abend Logo"
          />
          <div>
            <router-link
              to="/"
              class="no-underline leading-none hover:no-underline font-extrabold text-4xl"
            >
              {{ title }}
            </router-link>
            <div class="flex">
              <p>{{ description }}</p>
              <a
                class="ml-2 mt-1 w-4 h-4"
                :href="social.twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  class="fill-current hover:text-blue-500"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Twitter</title>
                  <path
                    d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <ul
          class="md:flex text-lg absolute left-0 right-0 bottom-0 top-0 md:relative bg-light md:bg-transparent"
          :class="{ hidden: !isMenuOpen }"
        >
          <li v-for="item in nav" :key="item.link">
            <router-link
              class="mr-2 md:px-4 md:py-2 p-4 w-full block"
              :to="item.link"
              exact
              >{{ item.text }}</router-link
            >
          </li>
        </ul>
        <div class="absolute right-0 top-0 mr-5 mt-5 md:hidden">
          <button
            class="hamburger hamburger--elastic"
            :class="{ 'is-active': isMenuOpen }"
            type="button"
            aria-label="Menu"
            aria-controls="navigation"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </nav>
    </header>
    <nuxt />
  </div>
</template>

<script>
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
  }
}
</script>
