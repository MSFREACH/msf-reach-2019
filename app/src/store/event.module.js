/*eslint no-debugger: off*/
import _ from 'lodash';
import Vue from 'vue';
import { EventsService} from '@/common/api.service';
import { FETCH_EVENT, CREATE_EVENT, EDIT_EVENT, DELETE_EVENT, ARCHIVE_EVENT, RESET_EVENT_STATE } from './actions.type';
import { RESET_STATE, SET_EVENT } from './mutations.type';

const initialState = {
    event: {
        metadata: {},
        coordinates: [],
        notifications: [],
        status: '',
        body: {},
        type: ''
    } // TODO: add associated reports & contacts later
};

export const state = Object.assign({}, initialState);

export const actions = {
    [FETCH_EVENT] (context, eventSlug, prevEvent){
        // avoid duplicate network call if event was already set from list
        if(prevEvent != undefined){
            return context.commit(SET_EVENT, prevEvent);
        }
        return EventsService.get(eventSlug)
            .then(({data}) => {
                context.commit(SET_EVENT, data);
                return data;
            });
    },
    [CREATE_EVENT] ({ state }){
        // TODO: geojson for location validation
        return EventsService.create(state.event);
    },
    [DELETE_EVENT] (context, slug){
        return EventsService.destroy(slug);
    },
    [EDIT_EVENT] ({state}){
        // TODO: update per section only
        return EventsService.update(state.event.slug, state.event);
    },
    [RESET_EVENT_STATE] ({ commit }){
        // When cancel edits
        commit(RESET_STATE);
    },
    [ARCHIVE_EVENT] ({state}){
        // TODO: trigger missions table
        return EventsService.archive(state.event.slug, state.event);
    },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
    [SET_EVENT] (state, event){
        state.event = event.result.objects.output.geometries[0];
        state.event.metadata = event.result.objects.output.geometries[0].properties.metadata;
        state.event.coordinates = event.result.objects.output.geometries[0].coordinates;
        state.event.body =event.result.objects.output.geometries[0].properties;
        state.event.notifications = event.result.objects.output.geometries[0].properties.metadata.notification;
        state.event.type = event.result.objects.output.geometries[0].properties.type;
    },
    [RESET_STATE] () {
        for (let f in state){
            Vue.set(state, f, initialState[f]);
        }
    }
};

const getters ={
    event (state){
        return state.event;
    },
    eventMetadata (state){
        return state.event.metadata;
    },
    eventCoordinates (state){
        return state.event.coordinates;
    },
    eventNotifications (state){
        return state.event.notifications;
    },
    eventTypes(state){
        if(state.event.type){
            var types = state.event.type.replace(/other:/g, '').split(',');
            var cTypes = _.compact(types);
            _.remove(cTypes, function(t){
                return t.indexOf('disease_outbreak') > -1 || t.indexOf('natural_disaster') > -1 ;
            });
            
            var subTypes = state.event.metadata.sub_type.replace(/other_disease_outbreak:/g, '').replace(/other_natural_disaster:/g, '').split(',');
            var cSubTypes = _.compact(subTypes);

            return cTypes.concat(cSubTypes);
        }
    },
    eventCreatedAt(state){
        return state.event.created_at ? state.event.created_at : state.event.metadata.event_datetime;
    }
};

export default {
    state, actions, mutations, getters
};