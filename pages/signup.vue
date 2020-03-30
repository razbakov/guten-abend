<template>
  <main class="container w-full mx-auto md:max-w-xl px-4 pb-8 flex">
    <div v-if="loading">
      Loading...
    </div>
    <div v-else class="container text-center p-4 w-full md:max-w-xl mx-auto">
      <div v-if="!uid">
        <div>
          <button
            class="bg-white shadow no-underline font-semibold py-2 px-4 rounded"
            @click="signInWithGoogle"
          >
            <svg
              viewBox="0 0 512 512"
              class="SignUpWithGoogleButton--icon--3Iijc"
            >
              <g fill="none" fill-rule="evenodd">
                <path
                  d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z"
                  fill="#4285f4"
                ></path>
                <path
                  d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z"
                  fill="#34a853"
                ></path>
                <path
                  d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z"
                  fill="#fbbc05"
                ></path>
                <path
                  d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z"
                  fill="#ea4335"
                ></path>
                <path d="M20 20h472v472H20V20z"></path>
              </g>
            </svg>
            Sign In With Google
          </button>
        </div>
        <div class="divider">or</div>
        <div>
          <input v-model="email" />
          <button
            class="bg-primary hover:shadow no-underline text-white font-semibold py-2 px-4 rounded text-white"
            @click="sendSignInLinkToEmail(email)"
          >
            Send magic link to email
          </button>
        </div>
      </div>
      <button
        v-else
        class="bg-primary hover:shadow no-underline text-white font-semibold py-2 px-4 rounded text-white"
        @click="signOut"
      >
        Logout
      </button>
      <pre class="bg-white">{{ uid }}</pre>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth.js'

export default {
  data: () => ({
    email: ''
  }),
  setup() {
    const {
      uid,
      loading,
      signInWithGoogle,
      sendSignInLinkToEmail,
      signOut
    } = useAuth()

    return {
      uid,
      loading,
      signInWithGoogle,
      sendSignInLinkToEmail,
      signOut
    }
  }
}
</script>
