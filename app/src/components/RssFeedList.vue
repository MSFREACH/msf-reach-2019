<template>
  <v-container class="rssFeedList" grid-list-md>
    <div class="searchHeader">
      <v-text-field
        v-model="rssSearchString"
        label="Search"
        single-line
        hide-details
        xs10
      />
      <v-select
        v-model="selectedRssCategory"
        :items="rssCategories"
        label="Category"
        round
        clearable
      />
    </div>
    <v-layout class="rssFeedListItems" v-if="feedItems.length > 0" row wrap>
      <v-flex v-for="(item, i) in feedItems" :key="i" class="rssLeftPane" xs6 md6>
        <v-card class="rssFeedCard" v-on:click="clickRssItem(item)">
          {{ item.properties.title }}
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import { SELECT_RSS_ITEM, FETCH_RSS } from '@/store/actions.type';

export default {
  name: 'RssFeedList',
  data() {
    return {
      feedItems: [],
      rssSearchString: '',
      selectedRssCategory: '',
      rssCategories: ['News', 'Alerts'],
    };
  },
  computed: {
    ...mapGetters(['rssFeedItems']),
  },
  watch: {
    rssFeedItems() {
      this.feedItems = _.map(this.rssFeedItems, _.clone);
    },
  },
  mounted() {
    this.fetchRss();
  },
  methods: {
    fetchRss() {
      this.$store.dispatch(FETCH_RSS, {});
    },
    clickRssItem(rssItem) {
      this.$store.dispatch(SELECT_RSS_ITEM, rssItem);
    },
  },
};
</script>
