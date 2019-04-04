<template>
  <v-layout class="eventList" app>
    <v-flex v-if="isLoadingEvent" xs3 class="event-preview">
      Loading events...
      <v-progress-circular :size="50" color="active" indeterminate />
    </v-flex>
    <v-flex v-else xs3 class="eventListPanel">
      <v-data-iterator
        :items="displayEvents"
        :search="search"
        content-tag="v-layout"
        no-data-text="No events found"
        hide-actions
        wrap
        row
      >
        <v-toolbar slot="header" class="listHeader" flat>
          <div class="full-width">
            <v-text-field
              v-model="search"
              label="Search"
              single-line
              hide-details
              xs11
            />
            <new-event />
          </div>
          <hr class="row-divider" />
          <div class="full-width">
            <v-select
              v-model="filteredTypes"
              :items="allEventTypes"
              attach
              label="Type"
              round
            />
            <div :class="selectedStatus + '-wrapper statusWrapper'">
              <label>
                <span v-if="selectedStatus">{{ selectedStatus }}</span>
                <span v-else>status</span>
              </label>
              <v-btn-toggle :value="selectedStatus">
                <span
                  v-for="(status, index) in allEventStatuses"
                  :key="index"
                  :value="status.value"
                  :class="status.value + '-fill select-status-filter'"
                  @click="filterByStatus(status.value)"
                />
              </v-btn-toggle>
            </div>
          </div>
        </v-toolbar>
        <v-list slot="item" slot-scope="props" class="result-list" three-line>
          <v-list-tile
            :key="props.item.id"
            :to="{ name: 'event-general', params: { slug: props.item.id } }"
            avatar
            ripple
          >
            <v-list-tile-content>
              <v-list-tile-title
                v-if="props.item.metadata.event_status"
                :class="props.item.metadata.event_status.toLowerCase()"
              >
                <span class="title-text"> {{ props.item.metadata.name }} </span>
                <span class="list-actions">
                  <!-- FOR LATER -->
                  <!-- <v-icon color="grey lighten-1">exit_to_app</v-icon>
                                    <v-icon color="grey lighten-1">bookmark</v-icon> -->
                  <router-link
                    :to="{
                      name: 'map-main',
                      params: { eventId: props.item.id }
                    }"
                  >
                    <v-icon color="grey lighten-1">map</v-icon>
                  </router-link>
                </span>
              </v-list-tile-title>
              <v-list-tile-title v-else>
                <span class="title-text"> {{ props.item.metadata.name }} </span>
                <span class="list-actions">
                  <v-icon color="grey lighten-1">exit_to_app</v-icon>
                  <v-icon color="grey lighten-1">bookmark</v-icon>
                  <router-link
                    :to="{
                      name: 'map-main',
                      params: { eventId: props.item.id }
                    }"
                  >
                    <v-icon color="grey lighten-1">map</v-icon>
                  </router-link>
                </span>
              </v-list-tile-title>
              <span
                v-for="(eventType, index) in props.item.metadata.types"
                :key="index"
                class="not-render list-types"
              >
                {{ eventType }}
              </span>
              <span class="not-render"
                >{{ props.item.metadata.event_status }}
              </span>

              <v-list-tile-sub-title>
                <label> AREA </label> {{ props.item.place }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title>
                <label> UPDATED </label>
                {{ props.item.updated_at | relativeTime }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-iterator>
    </v-flex>
    <event-nav />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import { FETCH_EVENTS } from '@/store/actions.type';
import { EVENT_TYPES, EVENT_STATUSES } from '@/common/common';
import NewEvent from '@/views/New/NewEvent.vue';
import REvent from '@/components/Event.vue';
import EventNav from '@/views/EventNav.vue';

export default {
  name: 'EventList',
  components: {
    NewEvent,
    REvent,
    EventNav
  },
  props: {
    status: {
      status: String,
      required: false,
      default: 'all'
    },
    author: {
      type: String,
      required: false
    },
    favorited: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 8
      },
      search: '',
      allEventTypes: EVENT_TYPES,
      filteredTypes: [],
      displayEvents: [],
      allEventStatuses: EVENT_STATUSES,
      selectedStatus: ''
    };
  },
  computed: {
    listConfig() {
      const { status } = this;
      const filters = {};
      if (this.author) {
        filters.author = this.author;
      }
      if (this.favorited) {
        filters.favorited = this.favorited;
      }
      return { status, filters };
    },
    ...mapGetters([
      'eventsCount',
      'isLoadingEvent',
      'events',
      'fetchEventsError'
    ])
  },
  watch: {
    events(newValue) {
      // eslint-disable-line no-unused-vars
      this.events.map(item => {
        item.short_description = _.truncate(item.metadata.description, {
          length: 250,
          separator: ' '
        });
        var cleanAreas = _.compact(item.metadata.areas);

        if (!item.metadata.areas || _.isEmpty(cleanAreas)) {
          item.place = item.metadata.country;
        } else {
          if (cleanAreas[0].region) {
            item.place =
              cleanAreas[0].region + ' ' + cleanAreas[0].country_code;
          } else {
            item.place = cleanAreas[0].country;
          }
        }

        if (!item.metadata.types) {
          item.metadata.types = item.type.split(',');
        }
      });
      this.displayEvents = _.map(this.events, _.clone);
    },
    filteredTypes(newValue) {
      this.displayEvents = this.events.filter(item => {
        var types = item.metadata.types
          ? item.metadata.types
          : item.type.split(',');
        return _.isEmpty(newValue) || _.indexOf(types, newValue) != -1;
      });
    }
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    fetchEvents() {
      this.$store.dispatch(FETCH_EVENTS, this.listConfig);
    },
    filterByStatus(status) {
      this.selectedStatus = status;
      this.displayEvents = this.events.filter(item => {
        if (
          item.metadata.event_status &&
          item.metadata.event_status.toLowerCase() == status
        )
          return item;
      });
    },
    customFilter(items, search, filter) {
      // zero filtering
      if (!search && _.isEmpty(this.filteredTypes)) {
        return items;
      }
      if (!search) {
        // pure type filter
        return items.filter(item => {
          return (
            !this.filteredTypes ||
            _.intersection(this.filteredTypes, item.types)
          );
        });
      }
      search = search.toString().toLowerCase();

      if (_.isEmpty(this.filteredTypes)) {
        // pure search string
        return itemsitems.filter(item =>
          filter(item.metadata.description, search)
        );
      }

      // Otherwise return search by both
      return items
        .filter(item => filter(item.metadata.description, search))
        .filter(item => {
          return (
            !this.filteredTypes ||
            _.intersection(this.filteredTypes, item.types)
          );
        });
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/css/lists.scss';
@import '@/assets/css/event.scss';
@import '@/assets/css/display.scss';

.result-list.v-list {
  width: 100%;
  border-radius: 5px;
  margin: 5px;
  box-sizing: border-box;
  border: 2px transparent solid;
  padding: 0;
}
.result-list.v-list:hover {
  border: 2px #0374c7 solid;
  background: #fff;
}
.eventListPanel {
  background: $bg-milk-grey;
  .v-input__slot {
    height: inherit;
  }
  .v-list__tile__sub-title {
    label {
      line-height: 22px;
      margin-right: 12px;
    }
  }
  .v-data-iterator {
    width: 100%;
    overflow: auto;
    height: 100vh;
  }
}

.v-menu {
  .v-list {
    display: block !important;
  }
}

.v-list__tile {
  padding: 8px 12px;
  border-radius: 5px;
}
.v-list__tile--active {
  background: #d0d3da;
}
.v-list__tile__title {
  white-space: inherit;
  span {
    display: inline-block;
  }
}

.v-list__tile__sub-title {
  font-weight: normal;
  color: #000;
}
.select-status-filter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}

.list-types {
  font-size: 8px;
}
.not-render {
  display: none;
}

.list-actions {
  float: right;
  .v-icon {
    font-size: 20px;
  }
}
.title-text {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
