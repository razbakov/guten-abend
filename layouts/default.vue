<template>
  <div
    class="font-sans leading-normal tracking-normal antialiased min-h-screen"
  >
    <THeader />
    <nuxt />
  </div>
</template>

<script>
import THeader from '~/components/THeader'

export default {
  components: {
    THeader
  }
}
</script>
