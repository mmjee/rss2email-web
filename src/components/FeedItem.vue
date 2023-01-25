<template>
  <v-card class="mt-2" width="768" elevation="3">
    <v-card-title>
      {{ feed.name }}
    </v-card-title>
    <v-card-text class="text-body-1" v-if="!editMode">
      URL: {{ feed.feed_url }}
      <br />
      Last Fetched: {{ lastFetchedHuman }}
      <br />
      Fetches every {{ freqSecHuman }}
    </v-card-text>
    <v-card-text v-else>
      <form @submit.prevent="onSubmit">
        <v-text-field hide-details label="Name" :value="feed.name" v-on:input="onNameChange" />
        <v-text-field hide-details label="URL" :value="feed.feed_url" v-on:input="onURLChange" />
        <v-text-field hide-details label="Frequency" type="number" :value="freqSec" v-on:input="onFreqChg">
          <template v-slot:append>
            (seconds)
          </template>
        </v-text-field>
        <v-btn color="primary" type="submit" class="mt-2" outlined>Submit</v-btn>
        <v-alert v-if="error != null" color="error" outlined class="mt-2">{{ error }}</v-alert>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" outlined @click="deleteFeed(feed)">DELETE</v-btn>
      <v-btn color="warning" outlined @click="editMode = !editMode">EDIT</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const MUL = 10n ** 9n
const MUL_N = 10 ** 9

export default {
  name: 'FeedItem',
  props: ['feed'],
  data: () => ({
    editMode: false,
    error: null
  }),
  computed: {
    lastFetchedHuman () {
      return this.$store.getters['i18n/fmtRelative'](this.feed.last_fetched)
    },
    freqSec () {
      return typeof this.feed.frequency === 'bigint' ? Number(this.feed.frequency / MUL) : (this.feed.frequency / MUL_N)
    },
    freqSecHuman () {
      return this.$store.getters['i18n/fmtDuration'](this.freqSec)
    }
  },
  methods: {
    async deleteFeed () {
      await this.$store.state.api.socket.deleteFeed(this.feed)
      this.$emit('request-update')
    },
    onFreqChg (ev) {
      this.$emit('freq-change', BigInt(ev) * MUL)
    },
    onNameChange (ev) {
      this.$emit('name-change', ev)
    },
    onURLChange (ev) {
      this.$emit('url-change', ev)
    },
    async onSubmit () {
      this.error = null
      try {
        await this.$store.state.api.socket.editFeed(this.feed)
        this.editMode = false
        this.$emit('request-update')
      } catch (e) {
        this.error = e.message
      }
    }
  }
}
</script>
