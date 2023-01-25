<template>
  <div class="c-div">
    <v-card width="768">
      <v-card-title>No account found, enter your email to create one</v-card-title>
      <v-card-text>
        <form @submit.prevent="onSend">
          <v-text-field type="email" v-model="email" label="E-mail address" aria-required="true" />
          <v-btn type="submit" color="primary">Submit</v-btn>
        </form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'SignUpForm',
  data: () => ({
    email: ''
  }),
  methods: {
    onSend () {
      this.$store.dispatch('api/signUp', this.email)
    }
  }
}
</script>

<style scoped>
.c-div {
  display: flex;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
}
</style>
