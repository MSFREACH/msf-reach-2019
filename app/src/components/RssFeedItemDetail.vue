<template>
  <v-container class="rssFeed" grid-list-md>
       <map-annotation v-if="selectedRssItem.geometry"
          :coordinates="selectedRssItem.geometry.coordinates"
          map-id="generalAnnotation"
        />
      <div v-else>no rss item is currently selected</div>
  </v-container>
</template>

<script>

import { mapGetters } from 'vuex';
import MapAnnotation from '@/views/Map/MapAnnotation.vue';


export default {
  name: 'RssFeedItemDetail',
  components: {
    MapAnnotation,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['selectedRssItem']),
  },
};
</script>
