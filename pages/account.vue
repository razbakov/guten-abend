<template>
  <TLoader v-if="loading" />
  <main v-else class="card">
    <div class="mb-4 bg-gray-200 -mt-2 -mx-8 p-4">
      <h1 class="text-3xl font-bold">
        Your Account
      </h1>
    </div>

    <TForm
      v-model="account"
      :fields="fields"
      :submit-label="`${confirmedAccount ? 'Save' : 'Confirm'}`"
      @save="save"
    />

    <div class="border-t p-4 bg-red-100 -mx-8 mt-4 -mb-8">
      <button class="btn-secondary" @click="signOut">
        Logout
      </button>
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import TForm from '~/components/TForm'
import TLoader from '~/components/TLoader'

export default {
  middleware: ['auth'],
  components: {
    TForm,
    TLoader
  },
  setup() {
    const {
      uid,
      account,
      signOut,
      updateAccount,
      confirmedAccount,
      loading
    } = useAuth()

    return {
      loading,
      uid,
      account,
      signOut,
      updateAccount,
      confirmedAccount
    }
  },
  data: () => ({
    fields: [
      {
        name: 'email',
        disabled: true
      },
      {
        name: 'name',
        label: 'Full Name',
        required: true,
        placeholder: '(Required)'
      },
      {
        name: 'city',
        placeholder: '(Optional)'
      },
      {
        description: 'Would you like to get emails about our next events?',
        options: ['yes', 'no'],
        default: 'yes',
        type: 'select',
        name: 'newsletter'
      }
    ]
  }),
  mounted() {
    if (!this.confirmedAccount) {
      this.$nuxt.setLayout('empty')
    }
  },
  methods: {
    async save(data) {
      const changes = {
        ...data,
        confirmed: true
      }

      await this.updateAccount(changes)

      let target = window.localStorage.getItem('target')
      window.localStorage.removeItem('target')

      if (!target) {
        target = '/schedule'
      }

      this.$router.push(target)
    }
  }
}
</script>
