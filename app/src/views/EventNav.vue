<template>
  <v-layout class="detail-section" app xs9>
    <nav class="first-nav">
      <router-link
        v-for="(item, index) in crossTabs"
        :key="index"
        :to="{
          name: item.component,
          params: { slug: $route.params.slug }
        }"
        class="first-nav-links"
      >
        {{ item.name }}
      </router-link>
    </nav>
    <router-view />
  </v-layout>
</template>
<script>
// import REvent from '@/components/Event.vue';
// import NewsFeed from '@/components/NewsFeed.vue';
// import RelatedContacts from '@/components/Contacts/RelatedContacts.vue';
// import CountryDetails from '@/components/CountryDetails.vue';
// import RelatedResponses from '@/components/RelatedResponses.vue';
import { EVENT_TOP_NAVIGATIONS } from '@/common/navigational-fields.js';

export default {
  name: 'EventNav',
  components: {},
  data() {
    return {
      active: null,
      crossTabs: EVENT_TOP_NAVIGATIONS
    };
  },
  methods: {}
};
</script>
<style lang="scss">
@import '@/assets/css/util/typography.scss';
@import '@/assets/css/event.scss';
</style>
