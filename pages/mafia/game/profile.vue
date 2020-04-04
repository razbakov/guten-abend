<template>
  <main class="card">
    <div class="mb-4 bg-gray-200 -mt-2 -mx-8 p-4">
      <h1 class="text-3xl font-bold">
        {{ exists ? 'My Mafia Profile' : 'Create Mafia Profile' }}
      </h1>
    </div>

    <TLoader v-if="!accountLoaded" />
    <div v-else>
      <TForm
        v-model="profile"
        :fields="fields"
        :submit-label="`${exists ? 'Save' : 'Finish'}`"
        @save="save"
      />
    </div>
  </main>
</template>

<script>
import useAuth from '~/use/auth'
import useDoc from '~/use/doc'
import TForm from '~/components/TForm'
import TLoader from '~/components/TLoader'

export default {
  middleware: ['auth'],
  components: {
    TForm,
    TLoader
  },
  data: () => ({
    fields: [
      {
        label: 'Nickname',
        name: 'nickname',
        placeholder: 'Mr. Bond'
      }
    ]
  }),
  setup() {
    const { uid, accountLoaded } = useAuth()
    const { loadById, doc: profile, update, exists } = useDoc('mafia_profiles')

    loadById(uid.value)

    return {
      accountLoaded,
      profile,
      update,
      exists
    }
  },
  methods: {
    async save(data) {
      await this.update(data)

      let target = window.localStorage.getItem('target')
      window.localStorage.removeItem('target')

      if (!target) {
        target = '/mafia/game/'
      }

      this.$router.push(target)
    }
  }
}
</script>
