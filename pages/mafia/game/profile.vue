<template>
  <div class="container w-full mx-auto md:max-w-xl px-4 pb-8">
    <div class="typo bg-white w-full shadow-md rounded px-8 pb-8 mb-4 pt-2">
      <TLoader v-if="!ready" />
      <div v-else>
        <h2 v-if="exists">Your Mafia Profile</h2>
        <h2 v-else>Create Mafia Profile</h2>
        <TForm
          v-model="profile"
          :fields="fields"
          :submit-label="`${exists ? 'Save' : 'Finish'}`"
          @save="save"
        />
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '~/use/auth.js'
import useDoc from '~/use/collection.js'
import TForm from '~/components/TForm.vue'
import TLoader from '~/components/TLoader.vue'

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
    const { uid, ready } = useAuth()
    const { loadById, doc: profile, update, exists } = useDoc('mafia_profiles')

    loadById(uid.value)

    return {
      ready,
      profile,
      update,
      exists
    }
  },
  methods: {
    async save(data) {
      await this.update(data)
      this.$router.push('/mafia/game/')
    }
  }
}
</script>
