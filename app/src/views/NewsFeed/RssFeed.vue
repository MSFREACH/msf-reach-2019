<template>
  <v-container class="rssFeed" grid-list-md>
    <div class="rssHeader">
      rss Header
    </div>
    <v-layout v-if="feedItems.length > 0" row wrap>
      <v-flex v-for="(item, i) in feedItems" :key="i" xs12 md6>
        <v-card class="rssFeedCard">
          {{ item.properties.title }}
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import { FETCH_RSS } from '@/store/actions.type';

export default {
  name: 'EventRss',
  data() {
    return {
      feedItems: [],
    };
  },
  mounted() {
    this.fetchRss();
  },
  methods: {
    fetchRss() {
      this.$store.dispatch(FETCH_RSS, {});
    },
  },
  computed: {
    ...mapGetters(['rssFeedItems']),
  },
  watch: {
    rssFeedItems() {
      this.feedItems = _.map(this.rssFeedItems, _.clone);
    },
  },
};
</script>
