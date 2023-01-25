<template>
  <v-container>
    <v-btn outlined large link to="/feed/create">Create a new Feed Subscription</v-btn>
    <v-divider class="my-2" />
    <FeedItem
      v-for="feed in feeds"
      class="mt-2"
      :key="feed.id.toString('hex')"
      :feed="feed"
      v-on:request-update="load"
      v-on:name-change="event => feed.name = event"
      v-on:url-change="event => feed.feed_url = event"
      v-on:freq-change="event => feed.frequency = event"
    />
  </v-container>
</template>

<script>
import { SORT_FEED_NEWEST } from '@/store/constants'
import FeedItem from '@/components/FeedItem.vue'

export default {
  name: 'FeedList',
  components: {
    FeedItem
  },
  data: () => ({
    feeds: []
  }),
  methods: {
    async load () {
      const data = await this.$store.state.api.socket.getFeeds(SORT_FEED_NEWEST)
      this.feeds = data.feeds
    }
  },
  mounted () {
    this.load().catch(e => console.error(e))
  }
}
</script>
