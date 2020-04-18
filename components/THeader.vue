<template>
  <header>
    <nav class="flex items-center text-dark justify-between flex-wrap p-6">
      <div class="sm:flex mb-4">
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
          <div class="flex items-center">
            <p class="mr-2">{{ description }}</p>
            <a
              class="ml-1 mt-1 w-4 h-4"
              :href="social.slack"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                class="fill-current hover:text-red-500"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.04235 15.1661C5.04235 16.5538 3.9088 17.6873 2.52117 17.6873C1.13355 17.6873 0 16.5538 0 15.1661C0 13.7785 1.13355 12.645 2.52117 12.645H5.04235V15.1661Z"
                />
                <path
                  d="M6.31271 15.1661C6.31271 13.7785 7.44626 12.645 8.83389 12.645C10.2215 12.645 11.3551 13.7785 11.3551 15.1661V21.4788C11.3551 22.8665 10.2215 24 8.83389 24C7.44626 24 6.31271 22.8665 6.31271 21.4788V15.1661Z"
                />
                <path
                  d="M8.83389 5.04235C7.44626 5.04235 6.31271 3.9088 6.31271 2.52117C6.31271 1.13355 7.44626 0 8.83389 0C10.2215 0 11.3551 1.13355 11.3551 2.52117V5.04235H8.83389Z"
                />
                <path
                  d="M8.83388 6.31271C10.2215 6.31271 11.355 7.44626 11.355 8.83389C11.355 10.2215 10.2215 11.3551 8.83388 11.3551H2.52117C1.13355 11.3551 0 10.2215 0 8.83389C0 7.44626 1.13355 6.31271 2.52117 6.31271H8.83388Z"
                />
                <path
                  d="M18.9577 8.83389C18.9577 7.44626 20.0912 6.31271 21.4788 6.31271C22.8665 6.31271 24 7.44626 24 8.83389C24 10.2215 22.8665 11.3551 21.4788 11.3551H18.9577V8.83389Z"
                />
                <path
                  d="M17.6873 8.83388C17.6873 10.2215 16.5538 11.355 15.1661 11.355C13.7785 11.355 12.645 10.2215 12.645 8.83388V2.52117C12.645 1.13355 13.7785 0 15.1661 0C16.5538 0 17.6873 1.13355 17.6873 2.52117V8.83388Z"
                />
                <path
                  d="M15.1661 18.9577C16.5538 18.9577 17.6873 20.0912 17.6873 21.4788C17.6873 22.8665 16.5538 24 15.1661 24C13.7785 24 12.645 22.8665 12.645 21.4788V18.9577H15.1661Z"
                />
                <path
                  d="M15.1661 17.6873C13.7785 17.6873 12.645 16.5538 12.645 15.1661C12.645 13.7785 13.7785 12.645 15.1661 12.645H21.4788C22.8665 12.645 24 13.7785 24 15.1661C24 16.5538 22.8665 17.6873 21.4788 17.6873H15.1661Z"
                />
              </svg>
            </a>
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
            <a
              class="ml-1 mt-1 w-4 h-4"
              :href="social.instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                class="fill-current hover:text-pink-500 pb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Instagram</title>
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
            <a
              class="ml-2 mt-1 w-4 h-4"
              :href="social.facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="fill-current hover:text-blue-500 pb-1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0)">
                  <path
                    d="M22.6738 0.00119019H1.3246C0.593539 0.00119019 0 0.593544 0 1.32579V22.675C0 23.4073 0.593539 24.0004 1.3246 24.0004H12.8184V14.7065H9.69105V11.084H12.8184V8.41269C12.8184 5.3134 14.7108 3.62486 17.4762 3.62486C18.802 3.62486 19.9389 3.72405 20.2704 3.76712V7.00669L18.3523 7.00748C16.8487 7.00748 16.5586 7.72233 16.5586 8.77071V11.0828H20.1459L19.6769 14.7049H16.5582V23.9992H22.6734C23.4053 23.9992 23.9992 23.4053 23.9992 22.675V1.325C23.9988 0.593544 23.4057 0.00119019 22.6738 0.00119019Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect y="0.000183105" width="24" height="23.9996" />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <ul
        class="md:flex text-lg fixed left-0 right-0 bottom-0 top-0 md:relative bg-light md:bg-transparent"
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
        <li v-if="uid && account">
          <router-link
            class="mr-2 md:px-4 md:py-2 p-4 w-full block"
            to="/account"
            exact
            >{{ account.name || 'My account' }}</router-link
          >
        </li>
        <li v-if="!uid">
          <router-link
            class="mr-2 md:px-4 md:py-2 p-4 w-full block text-primary"
            to="/signup"
            exact
            >Sign in</router-link
          >
        </li>
      </ul>
      <div
        class="right-0 top-0 mr-5 mt-5 md:hidden z-50"
        :class="isMenuOpen ? 'fixed' : 'absolute'"
      >
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
</template>

<script>
import useAuth from '~/use/auth'

export default {
  data: () => ({
    isMenuOpen: false,
    title: 'Guten Abend',
    description: 'Quarantine Club',
    social: {
      twitter: 'https://twitter.com/AbendKantine',
      instagram: 'https://www.instagram.com/AbendKantine',
      facebook: 'https://www.facebook.com/abendkantine',
      slack:
        'https://join.slack.com/t/guten-abend/shared_invite/zt-dkaf1w0m-GJFmiVjeUJ4NW4t~RC7eTQ'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Schedule', link: '/schedule/' },
      { text: 'Ideas', link: '/ideas/' },
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

<style></style>
