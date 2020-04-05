<template>
  <button :class="classes" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    classes() {
      const map = {
        primary: 'btn',
        secondary: 'btn-secondary',
        link: 'underline font-semibold py-2 px-4 hover:no-underline'
      }

      return map[this.type]
    }
  }
}
</script>
