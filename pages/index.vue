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
import useThreads from '~/use/threads.js'

export default {
  setup() {
    const { create, loading } = useThreads()

    return {
      create,
      loading
    }
  }
}
</script>
