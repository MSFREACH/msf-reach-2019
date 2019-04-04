<template>
  <v-layout row wrap class="eventSubContent statusToggle responseContainer">
    <nav class="statusTabWrapper">
      <v-btn
        v-for="(item, index) in statusHistory"
        :key="index"
        :class="item.toLowerCase() + '-wrapper statusTabs'"
        flat
        small
        @click="switchStatus(item)"
      >
        {{ item }}
      </v-btn>
    </nav>
    <v-flex xs8>
      <div
        :class="editing ? 'edit-wrapper full-text-fields' : 'full-text-fields'"
        :dark="editing"
      >
        <v-layout v-if="allowEdit" class="actions">
          <v-switch v-model="editing" :label="editing ? `save` : `edit`" />
          <span v-if="editing" class="cancel" @click="cancelEdit()"><v-icon>close</v-icon></span>
        </v-layout>
        <v-layout v-if="editing" row wrap dark>
          <div class="row-spacing">
            <label>Project Code</label>
            <div class="round-borders pc">
              <v-select
                v-model="editResponse.operational_center"
                :items="allOperationalCenters"
                label="OC"
              />
              <input
                v-model="editResponse.project_code"
                type="text"
                placeholder="######"
              >
            </div>
          </div>
          <response-programmes :current-programmes="editResponse.programmes" />
          <hr class="row-divider">
          <div class="one-half">
            <label>Response</label>
            <v-flex d-flex>
              <v-select
                v-model="editResponse.metadata.type"
                :items="allResponseTypes"
                dark
                label="type"
              />
            </v-flex>
            <v-textarea
              v-model="editResponse.metadata.description"
              solo
              label="description"
              auto-grow
              background-color="white"
              color="secondary"
            />
          </div>

          <div class="one-half">
            <div class="dateRange">
              <div class="one-half">
                <label>Start date</label>
                <v-menu
                  ref="startDateSelected"
                  v-model="selectedDate.start"
                  :close-on-content-click="false"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <v-text-field
                    slot="activator"
                    v-model="selectedDate.startValue"
                    persistent-hint
                    type="date"
                  />
                  <v-date-picker
                    v-model="selectedDate.startValue"
                    no-title
                    @input="selectedDate.start = false"
                  />
                </v-menu>
              </div>
              <div class="one-half">
                <label>End date</label>
                <v-menu
                  ref="endDateSelected"
                  v-model="selectedDate.end"
                  :close-on-content-click="false"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <v-text-field
                    slot="activator"
                    v-model="selectedDate.endValue"
                    persistent-hint
                    type="date"
                  />
                  <v-date-picker
                    v-model="selectedDate.endValue"
                    no-title
                    @input="selectedDate.end = false"
                  />
                </v-menu>
              </div>
            </div>
            <div>
              <label> Location of MSF Response: </label>
              <!-- map as input -->
            </div>
          </div>
          <v-flex xs8>
            <v-text-field
              v-model="editResponse.metadata.sharepoint_link"
              class="linkAttachment round-borders"
              single-line
              prepend-icon="link"
              label="Sharepoint link"
            />
          </v-flex>
          <v-btn
            fab
            flat
            small
            class="delete-btn right"
            @click="deleteResponse"
          >
            <v-icon>remove_circle</v-icon>
          </v-btn>
        </v-layout>
        <v-layout v-else-if="displayResponse">
          <v-layout row wrap>
            <div class="top-level primary-text">
              <label>Project Code</label>
              <v-flex>
                <v-select
                  v-model="selectedResponseId"
                  :items="activeResponses"
                  class="round-borders highlight"
                  item-text="project_code"
                  item-value="id"
                />
              </v-flex>
              <new-response />
            </div>

            <div class="one-third">
              <label>updated</label>
              {{ displayResponse.updated | relativeTime }}
            </div>
            <div class="one-third">
              <label>status</label>
              {{ displayResponse.event_status }}
            </div>
            <div class="full-width">
              <label>Type of programmes: </label>
              <div v-for="item in displayResponse.programmes" v-if="item">
                {{ item.name }}
                <b> {{ item.scale }} </b>
                <span class="notes"> {{ item.deployment_scale }} </span>
              </div>
            </div>

            <hr class="row-divider">
            <div class="one-half">
              <label>Response</label>
              {{ displayResponse.metadata.type }} -
              <span class="notes">
                {{ displayResponse.metadata.description }}
              </span>
            </div>

            <div class="one-half">
              <div class="dateRange">
                <span class="start">
                  <label>Start date</label>
                  {{ displayResponse.metadata.start_date | date }}
                </span>
                <span class="end">
                  <label>End date</label>
                  {{ displayResponse.metadata.end_date | date }}
                </span>
              </div>
              <div>
                <label> Location of MSF Response: </label>
                <!-- {{displayResponse.location}} -->
              </div>
            </div>

            <hr class="row-divider">
            <div class="one-half">
              <label>OPERATIONAL CENTRE</label>
              {{ displayResponse.operational_center }}
            </div>

            <hr class="row-divider">
            <v-btn v-if="displayResponse.metadata" fab flat small>
              <a
                :href="displayResponse.metadata.sharepoint_link"
                target="_blank"
              >
                <v-icon>link</v-icon>
              </a>
            </v-btn>
          </v-layout>
        </v-layout>
        <v-layout v-else row wrap>
          <div>No response recorded yet</div>
          <v-flex v-if="isResponseStatus">
            <new-response />
          </v-flex>
          <div v-else>
            ... Please update event status to allow editing for response
          </div>
        </v-layout>
      </div>
    </v-flex>
    <v-flex
      v-if="
        eventStatus.toLowerCase() == 'ongoing' ||
          eventStatus.toLowerCase() == 'intervention'
      "
      :class="editing ? 'editable-map map-annotation' : 'map-annotation'"
      xs4
      @click="openMap"
    >
      <v-layout row justify-center>
        <v-dialog v-model="mapDialog" max-width="880px">
          <v-card>
            <map-input ref="responseMapEntry" :coordinates="eventCoordinates" />
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" flat @click.native="saveArea()">
                Save Area
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      <map-annotation
        :coordinates="eventCoordinates"
        map-id="responsesAnnotation"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import {
  FETCH_MSF_RESPONSES,
  CREATE_MSF_RESPONSE,
  EDIT_MSF_RESPONSE,
  EDIT_MSF_RESPONSE_AREA,
  DELETE_MSF_RESPONSE,
} from '@/store/actions.type';
import { DEFAULT_MSF_RESPONSE } from '@/common/form-fields';
import { RESPONSE_TYPES, OPERATIONAL_CENTERS } from '@/common/response-fields';
import MapAnnotation from '@/views/Map/MapAnnotation.vue';
import MapInput from '@/views/Map/MapInput.vue';
import NewResponse from '@/views/New/NewResponse.vue';
import ResponseProgrammes from '@/components/RowEntries/ResponseProgrammes.vue';

import moment from 'moment';

export default {
  name: 'REventResponses',
  components: {
    MapAnnotation,
    MapInput,
    NewResponse,
    ResponseProgrammes,
  },
  data() {
    return {
      editing: false,
      mapDialog: false,
      editableIndex: null,
      selectedStatus: null,
      selectedResponseId: {},
      editResponse: null,
      _beforeEditingCache: {},
      allResponseTypes: RESPONSE_TYPES,
      allOperationalCenters: OPERATIONAL_CENTERS,
      defaultResponse: DEFAULT_MSF_RESPONSE,
      selectedDate: {
        start: false,
        startValue: null,
        end: false,
        endValue: null,
      },
    };
  },
  watch: {
    editing(val) {
      if (val) {
        this._beforeEditingCache = Object.assign({}, this.displayResponse);
        this.editResponse = this.displayResponse;
        this.selectedDate.startValue = moment(
          this.editResponse.metadata.start_date,
        ).format('YYYY-MM-DD');
        this.selectedDate.endValue = moment(
          this.editResponse.metadata.end_date,
        ).format('YYYY-MM-DD');
      } else {
        this.save();
      }
    },
    mapDialog(val) {
      if (val) {
        const vm = this;
        setTimeout(() => {
          vm.$refs.responseMapEntry.resizeMap();
        }, 100);
      }
    },
    responses(val) {
      if (val && val.length > 0) this.selectedResponseId = this.responses[0].id;
    },
  },
  mounted() {
    this.fetchReponses();
  },
  methods: {
    fetchReponses() {
      this.$store.dispatch(FETCH_MSF_RESPONSES, {
        eventId: this.$route.params.slug,
      });
    },
    switchStatus(status) {
      this.selectedStatus = status;
    },
    openMap() {
      if (this.editing) this.mapDialog = true;
    },
    cancelEdit() {
      // return fields back to its previous state
      Object.assign(this.displayResponse, this._beforeEditingCache);
      this.editResponse = this._beforeEditingCache = null;
    },
    save() {
      if (this.displayResponse) {
        delete this.editResponse.event_id;
        delete this.editResponse.event_status;
        this.$store.dispatch(EDIT_MSF_RESPONSE, this.editResponse);
      }
    },
    saveArea() {
      console.log('saveArea ------ ', this.response.area);
      const params = {
        event_id: this.$route.params.slug,
        event_status: this.eventStatus,
        area: this.response.area,
      };
      const emptyResponse = Object.values(this.editResponse).some(
        el => el == undefined,
      );

      if (emptyResponse) {
        this.$store.dispatch(CREATE_MSF_RESPONSE, params);
      } else {
        params.id = this.editResponse.id;
        this.$store.dispatch(EDIT_MSF_RESPONSE_AREA, params);
      }
    },
    deleteResponse() {
      this.$store.dispatch(DELETE_MSF_RESPONSE, parseInt(this.editResponse.id));
    },
  },
  computed: {
    ...mapGetters([
      'responses',
      'response',
      'eventStatus',
      'eventMetadata',
      'eventCoordinates',
    ]),
    isResponseStatus() {
      const currentStatus = this.eventStatus.toLowerCase();
      return currentStatus == 'ongoing' || currentStatus == 'intervention';
    },
    allowEdit() {
      if (!this.displayResponse && this.isResponseStatus) return true;
      if (
        this.displayResponse
        && this.displayResponse.event_status == this.eventStatus
      ) return true;
      return false;
    },
    activeResponses() {
      if (!this.responses) return null;
      const currentStatus = this.selectedStatus
        ? this.selectedStatus
        : this.eventStatus;

      return this.responses.filter(item => item.event_status == currentStatus);
    },
    displayResponse() {
      if (!_.isEmpty(this.selectedResponseId)) {
        const filtered = this.responses.filter(item => item.id == this.selectedResponseId);
        return filtered[0];
      } if (!_.isEmpty(this.activeResponses)) {
        return this.activeResponses[0];
      }
      return null;
    },

    statusHistory() {
      if (!this.responses) return [this.eventStatus];

      const statuses = this.responses.map(item => item.event_status);
      return _.sortedUniq(statuses);
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
</style>
