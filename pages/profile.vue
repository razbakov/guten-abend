<template>
  <div class="container w-full mx-auto md:max-w-xl px-4 pb-8">
    <div v-if="loading || !uid || !account">
      Loading...
    </div>
    <div
      v-else
      class="typo bg-white w-full shadow-md rounded px-8 pb-8 mb-4 pt-2"
    >
      <h2>Your Profile</h2>
      <form class="w-full max-w-sm">
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label
              class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
              for="email"
            >
              Email
            </label>
          </div>
          <div class="md:w-2/3">
            <input
              id="email"
              v-model="account.email"
              disabled
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
            />
          </div>
        </div>
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label
              class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
              for="name"
            >
              Full Name
            </label>
          </div>
          <div class="md:w-2/3">
            <input
              id="name"
              v-model="account.name"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
            />
          </div>
        </div>
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label
              class="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4"
              for="city"
            >
              City
            </label>
          </div>
          <div class="md:w-2/3">
            <input
              id="city"
              v-model="account.city"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
            />
          </div>
        </div>
        <div class="typo">
          <h2>Guten Abend Club</h2>
        </div>
        <p class="text-sm">
          Guten Abend Club is our chat in Slack. Would you like to receive an
          invite?
        </p>
        <div class="md:flex md:items-center mb-6">
          <div class="inline-block relative w-64">
            <select
              v-model="account.slack"
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
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
        <div class="typo">
          <h2>Newsletter</h2>
        </div>
        <p class="text-sm">
          Would you like to get emails about our next events?
        </p>
        <div class="md:flex md:items-center mb-6">
          <div class="inline-block relative w-64">
            <select
              v-model="account.newsletter"
              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
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
      </form>

      <div class="md:flex md:items-center justify-end">
        <button
          class="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"
          @click="save"
        >
          Save
        </button>
      </div>

      <div class="border-t p-4 bg-red-100 -mx-8 mt-4 -mb-8">
        <button
          class="inline-block bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="signOut"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth.js'

export default {
  middleware: ['auth'],
  setup() {
    const { uid, account, loading, signOut, updateAccount } = useAuth()

    return {
      uid,
      loading,
      account,
      signOut,
      updateAccount
    }
  },
  watch: {
    uid: {
      handler(val) {
        if (!val) {
          this.$router.replace('/')
        }
      }
    }
  },
  methods: {
    async save() {
      await this.updateAccount(this.account)
      this.$router.push('/schedule')
    }
  }
}
</script>
