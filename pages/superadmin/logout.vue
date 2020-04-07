<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    window.localStorage.removeItem('is_admin')
    this.$router.replace('/')
  }
}
</script>
