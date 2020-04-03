<template>
  <div class="card">
    <div class="typo">
      <h2 v-if="account">My Account</h2>
      <h2 v-else>Create Account</h2>
    </div>
    <TForm
      v-model="account"
      :fields="fields"
      :submit-label="`${account ? 'Save' : 'Finish'}`"
      @save="save"
    />

    <div class="border-t p-4 bg-red-100 -mx-8 mt-4 -mb-8">
      <button class="btn-secondary" @click="signOut">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth'
import TForm from '~/components/TForm'

export default {
  middleware: ['auth'],
  components: {
    TForm
  },
  setup() {
    const { uid, account, signOut, updateAccount } = useAuth()

    return {
      uid,
      account,
      signOut,
      updateAccount
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
        label: 'Full Name'
      },
      {
        name: 'city'
      },
      {
        label: 'Join Slack',
        description:
          'We have Slack for our Guten Abend Club. Would you like to receive an invite?',
        options: ['yes', 'no'],
        type: 'select',
        name: 'slack'
      },
      {
        description: 'Would you like to get emails about our next events?',
        options: ['yes', 'no'],
        type: 'select',
        name: 'newsletter'
      }
    ]
  }),
  methods: {
    async save(data) {
      await this.updateAccount(data)
      this.$router.push('/schedule')
    }
  }
}
</script>
