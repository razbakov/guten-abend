<template>
  <div class="container mx-auto">
    <div class="flex h-screen items-center justify-center">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        :class="{ 'bg-gray-500': loading }"
        @click="create()"
      >
        Create thread
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  computed: {
    uid() {
      return this.$store.state.auth.uid
    }
  },
  methods: {
    async create() {
      this.loading = true

      await this.$fireAuth.signInAnonymously()
      const thread = await this.$fireStore.collection('threads').add({
        createdAt: +new Date(),
        updatedAt: +new Date(),
        createdBy: this.uid
      })

      this.$router.push(`/${thread.id}`)
    }
  }
}
</script>
