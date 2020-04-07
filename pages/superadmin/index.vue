<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    window.localStorage.setItem('is_admin', '1')
    this.$router.replace('/')
  }
}
</script>
