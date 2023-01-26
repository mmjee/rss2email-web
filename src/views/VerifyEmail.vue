<template>
  <v-progress-linear indeterminate />
</template>

<script>
export default {
  name: 'VerifyEmail',
  async mounted () {
    if (this.$route.query.code == null) {
      window.alert('No token found :/')
      return
    }
    try {
      await this.$store.state.api.socket.requestEmailVerification(this.$route.query.code)
    } catch (e) {
      window.alert(e)
    } finally {
      this.$router.replace('/')
    }
  }
}
</script>
