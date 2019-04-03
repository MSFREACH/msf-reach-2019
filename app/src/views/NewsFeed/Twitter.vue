<template>
  <v-container class="twitter" grid-list-md>
    <div class="searchHeader">
      <v-text-field
        v-model="twitterSearchString"
        label="Search"
        single-line
        hide-details
        xs10
        @input="searchTweets"
      ></v-text-field>
      <v-select
        v-model="selectedLanguage"
        :items="twitterLanguageOptions"
        label="Language"
        round
        clearable
      ></v-select>
    </div>
    <v-layout v-if="displayTweets.length > 0" row wrap>
      <v-flex v-for="(item, i) in displayTweets" :key="i" xs12 md6>
        <v-card class="relatedEventCards" v-html="item.tweetEmbed.html">
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/*eslint no-debugger: off*/
/*eslint no-console: off*/
/*eslint no-unused-vars: off*/

import { mapGetters } from 'vuex';
import { SEARCH_TWEETS } from '@/store/actions.type';
import { TWITTER_LANGUAGE_OPTIONS } from '@/common/common';

export default {
  name: 'EventTwitter',
  data() {
    return {
      twitterLanguageOptions: TWITTER_LANGUAGE_OPTIONS.map(item => {
        return item.name;
      }),
      twitterSearchString: '',
      selectedLanguage: '',
      displayTweets: []
    };
  },
  methods: {
    searchTweets() {
      this.$store.dispatch(SEARCH_TWEETS, {
        searchString: this.twitterSearchString
      });
    }
  },
  computed: {
    ...mapGetters(['tweets'])
  },
  watch: {
    tweets(newValue) {
      // eslint-disable-line no-unused-vars
      this.displayTweets = _.map(this.tweets, _.clone);
    }
  }
};
</script>
