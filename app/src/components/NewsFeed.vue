<template>
  <v-container class="event-page">
    <span v-if="!slug">
      Please select event for review.
    </span>
    <nav v-else class="second-nav">
      <router-link
        v-for="item in newsFeedTabs"
        :key="item.component"
        :to="{ name: item.component }"
        class="second-nav-links"
      >
        <span @click="false">
          <span slot="badge" />
          {{ item.name }}
        </span>
      </router-link>
    </nav>
    <router-view />
  </v-container>
</template>

<script>
/* eslint no-debugger: off */
/* eslint no-console: off */
/* eslint no-unused-vars: off */

import { FETCH_RELATED_EVENTS } from '@/store/actions.type';
import { EVENT_NEWSFEED_NAVIGATIONS } from '@/common/navigational-fields.js';

export default {
  name: 'NewsFeed',
  components: {},
  props: {
    slug: {
      type: String,
    },
  },
  data() {
    return {
      newsFeedTabs: EVENT_NEWSFEED_NAVIGATIONS,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    const params = {
      types: this.eventTypes,
    };
    this.$store.dispatch(FETCH_RELATED_EVENTS, params);
  },
  methods: {},
};
</script>

<style lang="scss">
@import '@/assets/css/event.scss';
@import '@/assets/css/display.scss';
</style>
