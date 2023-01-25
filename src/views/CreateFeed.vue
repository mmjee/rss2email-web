<template>
  <v-container style="width: 768px;">
    <v-card>
      <v-card-text>
        <form @submit.prevent="onSubmit">
          <v-text-field hide-details label="Name" v-model="name" />
          <v-text-field hide-details label="URL" v-model="url" />
          <v-text-field hide-details label="Frequency" type="number" v-model="frequency" />
          <v-btn color="primary" type="submit" class="mt-2" outlined>Submit</v-btn>
        </form>
        <v-alert v-if="hasError">
          {{ errorText }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'CreateFeed',
  data: () => ({
    name: '',
    url: '',
    frequency: 0,

    hasError: false,
    errorText: null
  }),
  methods: {
    async onSubmit () {
      this.hasError = false
      try {
        await this.$store.state.api.socket.createFeed({
          name: this.name,
          feed_url: this.url,
          frequency: BigInt(this.frequency)
        })
      } catch (e) {
        this.hasError = true
        this.errorText = e.message
      }
      this.$router.push('/')
    }
  }
}
</script>
