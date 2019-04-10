<template>
  <v-container class="rssFeed" grid-list-md>
    <v-layout row wrap>
      <v-flex class="rssLeftPane" xs6>
        <rss-feed-list />
      </v-flex>
      <v-flex class="rssRightPane" xs6>
        <rss-feed-item-detail />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import RssFeedList from '@/components/RssFeedList.vue';
import RssFeedItemDetail from '@/components/RssFeedItemDetail.vue';

export default {
  name: 'EventRss',
  data() {
    return {};
  },
  components: {
    RssFeedList,
    RssFeedItemDetail,
  },
};
</script>
