import { ref } from '@vue/composition-api'

export default () => {
  const loading = ref(false)

  async function create() {
    loading.value = true

    await this.$fireAuth.signInAnonymously()
    const thread = await this.$fireStore.collection('threads').add({
      createdAt: +new Date(),
      updatedAt: +new Date(),
      createdBy: this.uid
    })

    loading.value = false

    this.$router.push(`/${thread.id}`)
  }

  return {
    create,
    loading
  }
}
