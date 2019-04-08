/* eslint no-debugger: off */
/* eslint no-console: off */

import _ from 'lodash';
import Vue from 'vue';
import {
  EventsService,
  RssService,
  TwitterService,
} from '@/common/api.service';
import {
  FETCH_RSS,
  SELECT_RSS_ITEM,
  SEARCH_TWEETS,
  APPEND_TWEETS,
  FETCH_EVENT,
  CREATE_EVENT,
  EDIT_EVENT,
  DELETE_EVENT,
  ARCHIVE_EVENT,
  RESET_EVENT_STATE,
  EDIT_EVENT_RESPONSES,
  EDIT_EVENT_EXT_CAPACITY,
  EDIT_EVENT_FIGURES,
  EDIT_EVENT_RESOURCES,
} from './actions.type';
import {
  RESET_STATE,
  SET_EVENT,
  ADD_EVENT_EXT_CAPACITY,
  UPDATE_EVENT_EXT_CAPACITY,
  UPDATE_EVENT_FIGURES,
  UPDATE_EVENT_RESOURCES,
  UPDATE_KEY_FIGURES,
} from './mutations.type';

const initialState = {
  eventId: null,
  eventProperties: null,
  event: {
    status: '',
    type: '',
    coordinates: {},
    metadata: {
      areas: [],
    },
    properties: {},
    responses: {},
    extCapacity: [],
    figures: {},
    resources: {},
  },
  keyFigures: [],
  tweets: [],
  rssFeedItems: [],
  selectedRssItem: {},
};

const state = Object.assign({}, initialState);

const actions = {
  [SEARCH_TWEETS](context, params) {
    return TwitterService.searchTweets(params).then(({ data }) => {
      context.commit(APPEND_TWEETS, data);
      return data;
    });
  },
  [FETCH_RSS](context, params) {
    return RssService.fetchFeed(params).then(({ data }) => {
      state.rssFeedItems = data.result;
    });
  },
  [SELECT_RSS_ITEM](context, rssItem) {
    state.selectedRssItem = rssItem;
  },
  [FETCH_EVENT](context, eventSlug, prevEvent) {
    // avoid duplicate network call if event was already set from list
    if (prevEvent != undefined) {
      return context.commit(SET_EVENT, prevEvent);
    }
    return EventsService.get(eventSlug).then(({ data }) => {
      context.commit(SET_EVENT, data);
      return data;
    });
  },
  [CREATE_EVENT](context, metadata) {
    return EventsService.create(metadata);
  },
  [DELETE_EVENT](context, slug) {
    return EventsService.destroy(slug);
  },
  [EDIT_EVENT]({ state }, payload) {
    return EventsService.update(state.eventId, payload);
  },
  [EDIT_EVENT_RESPONSES]({ state }) {
    const payload = {
      responses: state.event.responses,
    };
    return EventsService.updateResponses(state.eventId, payload);
  },
  [EDIT_EVENT_EXT_CAPACITY]({ state }) {
    const payload = {
      extCapacity: state.event.extCapacity,
    };
    return EventsService.updateExtCapacity(state.eventId, payload);
  },
  [EDIT_EVENT_FIGURES]({ state }) {
    const currentKeyFigures = state.event.figures.keyFigures.filter(item => item.status == state.event.status);
    let kfIndex = state.event.figures.keyFigures.indexOf(currentKeyFigures);
    if (!_.isEmpty(state.keyFigures)) {
      if (kfIndex < 0) kfIndex = 0;
      state.event.figures.keyFigures[kfIndex] = {
        status: state.event.status,
        figures: state.keyFigures,
      };
    }
    const payload = {
      figures: state.event.figures,
    };

    return EventsService.updateFigures(state.eventId, payload);
  },
  [EDIT_EVENT_RESOURCES]({ state }) {
    const payload = {
      resources: state.event.resources,
    };
    return EventsService.updateResources(state.eventId, payload);
  },
  [RESET_EVENT_STATE]({ commit }) {
    // When cancel edits
    commit(RESET_STATE);
  },
  [ARCHIVE_EVENT]({ state }) {
    // TODO: trigger missions table
    return EventsService.archive(state.event.slug, state.event);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [APPEND_TWEETS](state, payload) {
    state.tweets = payload.result;
  },
  [SET_EVENT](state, payload) {
    // state.event = payload.result.objects.output.geometries[0];
    state.eventId = payload.result.objects.output.geometries[0].properties.id;
    state.eventProperties = payload.result.objects.output.geometries[0].properties;
    state.event.metadata = payload.result.objects.output.geometries[0].properties.metadata;
    state.event.coordinates = payload.result.objects.output.geometries[0].coordinates;
    state.event.status = payload.result.objects.output.geometries[0].properties.metadata.event_status;
    // ------ future proof, when sub-content objs becomes available
    state.event.responses = payload.result.objects.output.geometries[0].properties.responses;
    state.event.extCapacity = payload.result.objects.output.geometries[0].properties.extcapacity;
    state.event.resources = payload.result.objects.output.geometries[0].properties.resources;
    state.event.figures = payload.result.objects.output.geometries[0].properties.figures;
    // /------/------/------/------/------/------
  },
  [RESET_STATE]() {
    for (const f in state) {
      Vue.set(state, f, initialState[f]);
    }
  },
  [ADD_EVENT_EXT_CAPACITY](state, data) {
    if (!state.event.extCapacity) {
      state.event.extCapacity = [data];
    } else {
      state.event.extCapacity.push(data);
    }
  },
  [UPDATE_EVENT_EXT_CAPACITY](state, data) {
    state.event.extCapacity[data.index] = data.item;
  },
  [UPDATE_EVENT_FIGURES](state, data) {
    state.event.figures = data;
  },
  [UPDATE_EVENT_RESOURCES](state, data) {
    state.event.resources = data;
  },
  [UPDATE_KEY_FIGURES](state, data) {
    state.keyFigures = data.keyFigures;
  },
};

const getters = {
  event(state) {
    return state.event;
  },
  currentEventId(state) {
    return state.eventId;
  },
  eventProperties(state) {
    return state.eventProperties;
  },
  eventStatus(state) {
    return state.event.status;
  },
  eventAreas(state) {
    return state.event.metadata.areas;
  },
  eventMetadata(state) {
    return state.event.metadata;
  },
  eventCoordinates(state) {
    return state.event.coordinates;
  },
  oldEventNotifications(state) {
    const currentNotifications = state.event.metadata.notification;
    if (currentNotifications) {
      return currentNotifications.map((item) => {
        const currentFiles = item.notificationFileUrl
          ? [item.notificationFileUrl]
          : [];
        const newSchema = {
          eventId: state.eventId,
          category: null,
          description: item.notification,
          created: new Date(item.notification_time * 1000).toISOString(), // units in exisitng db is different
          username: item.username,
          files: currentFiles,
        };
        return newSchema;
      });
    }
    return [];
  },
  eventTypes(state) {
    if (state.event.metadata.types) {
      const compactTypes = _.compact(state.event.metadata.types);
      const compactSubTypes = _.compact(state.event.metadata.sub_types);
      return compactTypes.concat(compactSubTypes);
    }

    if (state.eventProperties && state.eventProperties.type) {
      const types = state.eventProperties.type.replace(/other:/g, '').split(',');
      const cTypes = _.compact(types);
      _.remove(cTypes, t => (
        t.indexOf('disease_outbreak') > -1
          || t.indexOf('natural_disaster') > -1
      ));

      const subTypes = state.event.metadata.sub_type
        ? state.event.metadata.sub_type
          .replace(/other_disease_outbreak:/g, '')
          .replace(/other_natural_disaster:/g, '')
          .split(',')
        : '';
      const cSubTypes = _.compact(subTypes);

      return cTypes.concat(cSubTypes);
    }
  },
  eventResponses(state) {
    if (!state.event.responses && state.event.metadata) {
      // then we fallback & map out the keys

      const payload = state.event.metadata;
      if (!payload.msf_response) {
        return null;
      }

      const programmes = [];
      const currentPrograms = payload.msf_response_types_of_programmes;
      if (currentPrograms && currentPrograms.length > 0) {
        for (let i = 0; i < currentPrograms.length; i++) {
          programmes.push({
            name: currentPrograms[i],
            value: currentPrograms[i].toLowerCase().replace(/ /g, '_'),
            deployment: null,
            notes: '',
          });
        }
      }

      return [
        {
          updated: state.eventProperties.updated_at,
          status: payload.event_status,
          project_code: state.eventProperties.project_code,
          start_date: payload.start_date_msf_response,
          end_date: payload.end_date_msf_response,
          response: {
            type: null,
            description: payload.msf_response,
          },
          total_days: payload.total_days_msf_response,
          location: payload.msf_response_location, // check if object keys are copied
          operational_center: payload.operational_center,
          type_of_programmes: programmes,
          sharepoint_link: '',
        },
      ];
    }
    return state.event.responses;
  },
  eventExtCapacity(state) {
    if (!state.event.extCapacity && state.event.metadata) {
      const payload = state.event.metadata;
      const cap = payload.capacity ? payload.capacity : null;
      const action = payload.ext_capacity_action_plan
        ? `Action plan: \n ${payload.ext_capacity_action_plan}`
        : null;
      const human = payload.ext_capacity_by_humanitarian
        ? `Humanitarian: \n  ${payload.ext_capacity_by_humanitarian}`
        : null;
      const ground = payload.ext_capacity_type_in_ground
        ? `On Ground: \n ${payload.ext_capacity_type_in_ground}:`
        : null;
      const combined = [cap, action, human, ground].filter(el => el != null);
      let capacities = [];

      if (
        payload.ext_other_organizations
        && payload.ext_other_organizations.length > 0
      ) {
        capacities = payload.ext_other_organizations.map((item) => {
          if (!!item.name && !!item.deployment) {
            item.type = 'other';
            return item;
          }
        });
      }

      if (combined.length > 0) {
        const govCapacity = {
          type: 'governmental',
          name: null,
          arrival_date: null,
          deployment: combined.join('\n'),
        };

        capacities.push(govCapacity);
      }
      const cleanCapacities = capacities.filter(Boolean);

      return cleanCapacities;
    }
    return state.event.extCapacity;
  },
  eventFigures(state) {
    if (!state.event.figures && state.event.metadata) {
      const payload = state.event.metadata;
      let currentKeyFigures = [];
      if (!_.isEmpty(payload.keyMSFFigures)) {
        currentKeyFigures = [
          {
            status: payload.event_status,
            figures: payload.keyMSFFigures,
          },
        ];
      }

      return {
        keyFigures: currentKeyFigures,
        population: {
          total: payload.population_total,
          impacted: payload.population_affected,
          mortality: {
            rate: null,
            population: null,
            period: null,
          },
          morbidity: {
            rate: null,
            population: null,
            period: null,
          },
        },
        statistics: {
          collection: null,
          source: null,
        },
      };
    }
    return state.event.figures;
  },
  eventResources(state) {
    return state.event.resources;
  },
  oldEventReflection(state) {
    const payload = state.event.metadata;
    return {
      recommendations: payload.msf_ref_com_practical_details_recomm,
      comments: payload.msf_ref_com_reflection_comments,
    };
  },
  eventCreatedAt(state) {
    return state.event.metadata.event_datetime
      ? state.event.metadata.event_datetime
      : state.event.created_at;
  },
  entryRowKeyFigures(state) {
    return state.keyFigures;
  },
  tweets(state) {
    return state.tweets;
  },
  rssFeedItems(state) {
    return state.rssFeedItems;
  },
  selectedRssItem(state) {
    return state.selectedRssItem;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
