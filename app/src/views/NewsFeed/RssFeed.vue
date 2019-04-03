<template>
    <v-container class="rssFeed" grid-list-md>
        <div class="rssHeader">
            rss Header
        </div>
        <v-layout row wrap v-if="feedItems.length > 0">
            <v-flex  xs12 md6 v-for="(item, i) in feedItems" :key="i">
                <v-card class="rssFeedCard">
                    {{item.properties.title}}
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
import { FETCH_RSS } from '@/store/actions.type';

export default {
    name: 'event-rss',
    data () {
        return {
            feedItems: [],
        };
    },
    mounted(){
        this.fetchRss();
    },
    methods: {
        fetchRss() {
            this.$store.dispatch(FETCH_RSS, {});
        },
    },
    computed: {
        ...mapGetters([
            'rssFeedItems',
        ])
    },
    watch: {
        rssFeedItems(newValue){ // eslint-disable-line no-unused-vars
            this.feedItems = _.map(this.rssFeedItems, _.clone);
        }
    }
};

</script>
