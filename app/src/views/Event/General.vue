<template>
    <v-layout class="eventSubContent generalContainer" v-if="eventMetadata" row wrap>
        <v-flex xs8>
            <div :class="editing ? 'edit-wrapper full-text-fields':'full-text-fields'">
                <div class="actions">
                    <v-switch v-if="allowEdit" :label="editing ? `save` : `edit`" v-model="editing"></v-switch>
                    <v-btn v-else color="warningRed" flat small round outline>reactivate</v-btn>
                    <span class="cancel" v-if="editing" @click="cancelEdit()"><v-icon>close</v-icon></span>
                </div>
                 <v-layout row wrap v-if="!editing">
                    <div class="top-level primary-text">
                        <div class="one-half">
                            <label>Name</label>
                            {{eventMetadata.name}}
                        </div>

                        <div class="quarter-width">
                            <label>Operator</label>
                            <span v-if="eventMetadata.incharge_contact"> {{eventMetadata.incharge_contact.operator.name}} </span>
                        </div>
                    </div>
                    <div class="quarter-width">
                      <label>Type(s)</label>
                      <div v-for="type in eventTypes" class="secondary-text">{{ type | capitalize | noUnderscore }}</div>
                      <!-- TODO: add pairing icon + clickable taglink -->
                    </div>
                    <div class="quarter-width">
                      <label>Status</label>
                      <span :class="eventMetadata.event_status.toLowerCase() + ' event-status secondary-text'"> {{eventMetadata.event_status || 'monitoring'}}  </span>
                    </div>
                    <div class="one-half">
                        <label>Areas</label>
                        <div v-if="eventMetadata.areas">
                            <v-layout row wrap v-for="(area, index) in eventMetadata.areas" :key="index">
                                <v-flex xs12>
                                    <span v-if="area.region" class="secondary-text"> {{area.region}}, {{area.country_code}} </span>
                                    <span v-else class="secondary-text">{{area.country}}</span>
                                    <span v-if="eventMetadata.severity_measures && eventMetadata.severity_measures[index]" :class="allSeverity[eventMetadata.severity_measures[index].scale-1].text + 'Severity sub-tag'">{{allSeverity[eventMetadata.severity_measures[index].scale-1].text}} severity</span>
                                </v-flex>
                                <div class="notes specified-text" v-if="eventMetadata.severity_measures[index] && eventMetadata.severity_measures[index].description"> {{ eventMetadata.severity_measures[index].description }} </div>
                            </v-layout>
                        </div>
                        <v-flex v-else> {{eventMetadata.country}} </v-flex>

                        <div v-if="!eventMetadata.severity_measures" class="sub-tag">
                            <span v-if="eventMetadata.severity_scale" :class="allSeverity[eventMetadata.severity_scale-1].text +'Severity'">{{allSeverity[eventMetadata.severity_scale-1].text}} severity</span>
                            <span class="notes"><br/> {{ eventMetadata.severity }} </span>
                        </div>
                    </div>
                    <hr class="row-divider"/>

                    <div class="one-third">
                        <label>OPEN DATE</label>
                        {{ eventCreatedAt | relativeTime }}
                    </div>
                    <div class="one-third">
                        <label>DATES/HOURS OF DISASTER</label>
                        {{eventMetadata.event_local_time | dateTime}}
                        <div class="specified-text" v-if="eventMetadata.event_local_time"> {{eventMetadata.event_local_timezone }} ({{eventMetadata.event_local_timezone_abbr}}) <span class="offsetTime">{{timezoneOffSet}} hours</span></div>
                    </div>
                    <div class="one-third">
                        <label>Mission Contact Person</label>
                        <div>{{eventMetadata.incharge_name}}</div>
                        <div class="sub-category-text">{{eventMetadata.incharge_position}}</div>
                    </div>

                    <hr class="row-divider"/>
                    <div class="full-width">
                        <label>Description</label>
                        {{eventMetadata.description }}
                    </div>
                    <hr class="row-divider"/>

                    <sharepoint-link v-if="eventMetadata.sharepoint_link" :link="eventMetadata.sharepoint_link"></sharepoint-link>
                </v-layout>
                <v-layout row wrap v-else>
                    <v-flex xs3>
                        <markdown-panel class="sidePanel" v-if="showMarkdown"></markdown-panel>
                    </v-flex>
                    <div class="top-level primary-text">
                        <div class="one-half">
                            <label>Name</label>
                            <input class="full-width" type="text" v-model="eventMetadata.name" placeholder="Event name" />
                        </div>

                        <div class="quarter-width">
                            <label>REACH Operator</label>
                            <span>{{eventMetadata.incharge_operator}}</span>
                        </div>
                    </div>

                    <!-- meta tags -->
                    <div class="one-third">
                        <label> Type(s) </label>

                        <v-flex v-for="(item, index) in eventTypes" :key="index"  @mouseover="editable.typeIndex = index" @mouseleave="editable.typeIndex = null">
                            <div>
                                {{item}}
                                <span class="row-actions" v-show="editable.typeIndex == index">
                                    <a @click="deleteType(index)">delete</a>
                                </span>
                            </div>
                        </v-flex>
                        <div v-if="newType">
                            <v-flex>
                                <v-select class="one-half" v-model="newType.type" label="type" :items="allEventTypes"></v-select>
                                <v-select class="one-half" label="sub-type" v-if="subTypeSelect"
                                    v-model="newType.subtype"
                                    :items="subTypes[newType.type]">
                                </v-select>
                            </v-flex>
                            <v-text-field class="inverse" solo v-if="newType.type == 'other' || (subTypeSelect && newType.subtype == 'other') " placeholder="specify" v-model="newType.specify"></v-text-field>
                        </div>
                        <a v-if="!newType" class="form-actions" @click="addType()">Add type</a>
                        <div v-else>
                            <v-flex class="row-actions" xs12>
                                <a @click="submitType()">confirm</a>
                                <a @click="clearType()">cancel</a>
                            </v-flex>
                        </div>
                    </div>
                    <div class="one-third">
                        <label> Status </label>
                        <v-select v-model="eventMetadata.event_status" :items="statuses">
                            <template slot="selection" slot-scope="data">
                                <span :class="data.item.value">{{data.item.text}}</span>
                            </template>
                            <template slot="item" slot-scope="data">
                                <span :class="data.item.value">{{data.item.text}}</span>
                            </template>
                        </v-select>
                    </div>

                    <div class="one-third" id="eventAreas">
                        <label> Area(s) </label>
                        <div v-if="inEditArea">
                            <v-text-field v-if="inEditArea.address" v-model="inEditArea.address" disabled></v-text-field>
                            <vue-google-autocomplete v-else ref="address" id="areaMap" types="" classname="form-control" placeholder="Please type your address" v-on:placechanged="getAddressData"></vue-google-autocomplete>
                            <div v-if="inEditArea.severity">
                                <v-flex class="slider-wrapper">
                                    <v-slider class="severity-slider" v-model="inEditArea.severity.scale" :min="1" :max="3" step="1" tick-size="1" ></v-slider>
                                    <span :class="severityLabels[inEditArea.severity.scale -1]+'Severity severity-labels'"> {{severityLabels[inEditArea.severity.scale -1]}} severity</span>
                                </v-flex>
                                <v-text-field solo placeholder="severity analysis" class="inverse" v-model="inEditArea.severity.description"></v-text-field>
                            </div>
                            <span class="row-actions">
                                <a @click="submitArea()">confirm</a>
                                <a @click="clearArea()">cancel</a>
                            </span>
                        </div>
                        <div v-else-if="!inEditArea && eventMetadata.areas" v-for="(area, index) in eventMetadata.areas" class="tags" v-model="eventMetadata.areas" @mouseover="editable.areaIndex = index" @mouseleave="editable.areaIndex = null">
                            <span v-if="area.region"> {{area.region}}, {{area.country_code}} </span>
                            <span v-else-if="area.country"> {{area.country}} </span>
                            <span v-else>{{eventMetadata.country}}</span>
                            <span class="severity-wrapper">
                                <span class="sub-tag" v-if="eventMetadata.severity_measures && eventMetadata.severity_measures[index]">
                                    <span :class="allSeverity[eventMetadata.severity_measures[index].scale-1].text + 'Severity'">{{ allSeverity[eventMetadata.severity_measures[index].scale-1].text}} severity</span>
                                    <span class="notes"><br/> {{ eventMetadata.severity_measures[index].description }} </span>
                                </span>
                            </span>

                            <span class="row-actions" v-show="editable.areaIndex == index">
                                <a @click="editArea(area, eventMetadata.severity_measures[index], index)">edit</a>
                                <a @click="deleteArea(index)">delete</a>
                            </span>
                        </div>

                        <a v-if="!inEditArea" class="form-actions" @click="addArea()">Add area</a>
                        <!-- <new-map-entry></new-map-entry> -->
                    </div>
                    <hr class="row-divider"/>
                    <div class="not-editable one-third">
                        <label> OPEN DATE  </label>
                        {{ eventCreatedAt | fullDate }}
                    </div>

                    <div class="one-third">
                        <label>DATES/HOURS OF DISASTER </label>

                        <div class="datepicker-container">
                            <v-menu ref="dateSelected" :close-on-content-click="false" v-model="dateSelected" :nudge-right="40" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                                <v-text-field slot="activator" v-model="eventDate" persistent-hint type="date"></v-text-field>
                                <v-date-picker v-model="eventDate" no-title @input="dateSelected = false"></v-date-picker>
                            </v-menu>
                        </div>
                        <div class="timepicker-container">
                            <v-menu ref="menu" :close-on-content-click="false" v-model="timeSelected" :nudge-right="40" :return-value.sync="eventTime" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                                <v-text-field slot="activator" time v-model="eventTime" type="time"></v-text-field>
                                <v-time-picker v-if="timeSelected" v-model="eventTime" event-color="black" color="grey lighten-1" format="24hr" @change="$refs.menu.save(eventTime)" ></v-time-picker>
                            </v-menu>
                        </div>
                        <div class="timezonepicker-container" id="timezonePicker">
                            <v-select  :items="timezones" v-model="selectedTimezone" label="Timezone"></v-select>
                        </div>
                        {{timeZoneAbbr}}
                    </div>

                    <div class="one-third">
                        <label> Mission Contact Person  </label>
                        <v-text-field v-model="eventMetadata.incharge_name" placeholder="Name" />
                        <v-text-field v-model="eventMetadata.incharge_position" placeholder="Position" />
                    </div>
                    <hr class="row-divider"/>
                    <v-layout row wrap>
                        <v-flex xs6 style="display: inline-block;">
                        <label> Description </label>
                            <v-textarea solo auto-grow id="eventDescription" v-model="eventMetadata.description" placeholder="Event description">
                            </v-textarea>
                            <v-btn color="white lighten" small flat @click="showMarkdown = !showMarkdown"><v-icon>short_text</v-icon> markdown syntax guide</v-btn>
                        </v-flex>
                        <v-flex xs6 style="display: inline-block;">
                            <label>PREVIEW</label>
                            <div class="markdown-fields" v-html="mdRender(eventMetadata.description)"></div>
                        </v-flex>
                    </v-layout>
                    <hr class="row-divider"/>
                    <v-text-field clearable prepend-icon="link" label="SharePoint Link" v-model="eventMetadata.sharepoint_link" round ></v-text-field>
                </v-layout>
            </div>
        </v-flex>
        <v-flex xs4>
            <v-flex xs12 :class="editing ? 'editable-map map-annotation' : 'map-annotation'" @click="openMap">
                <v-layout row justify-center>
                  <v-dialog v-model="mapDialog" max-width="880px">
                    <v-card>
                        <map-input ref="eventMapEntry" :coordinates="eventCoordinates"></map-input>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click.native="saveArea()">Save Area</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-layout>
                <map-annotation mapId="generalAnnotation" :coordinates="eventCoordinates" :address="mapAddress"></map-annotation>
            </v-flex>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { DATETIME_DISPLAY_FORMAT, EVENT_TYPES, DEFAULT_EVENT_TYPE, DISEASE_OUTBREAK_TYPES, NATURAL_DISASTER_TYPES, DEFAULT_EVENT_AREA, EVENT_STATUSES, SEVERITY, SEVERITY_LABELS } from '@/common/common';
import MapAnnotation from '@/views/Map/MapAnnotation.vue';
import MapInput from '@/views/Map/MapInput.vue';
import marked from 'marked';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import SharepointLink from '@/views/util/Sharepoint.vue';
import { EDIT_EVENT } from '@/store/actions.type';
import moment from 'moment-timezone';
import MarkdownPanel from '@/views/util/MarkdownPanel.vue'

/*eslint no-console: off*/
/*eslint no-debugger: off*/
/*eslint no-unused-vars: off*/
/*eslint no-negated-condition: off*/
export default {
    name: 'r-event-general',
    data(){
        return {
            editing: false,
            mapDialog: false,
            showMarkdown: false,
            allSeverity: SEVERITY,
            allEventTypes: EVENT_TYPES,
            subTypes: {
                disease_outbreak: DISEASE_OUTBREAK_TYPES ,
                natural_disaster: NATURAL_DISASTER_TYPES
            },
            editable: {
                typeIndex: null,
                areaIndex: null
            },
            newType: null,
            defaultType: DEFAULT_EVENT_TYPE,
            inEditArea: null,
            inEditAreaIndex: null,
            defaultArea: DEFAULT_EVENT_AREA,
            severityLabels: SEVERITY_LABELS,
            areaAutocomplete: {
                isLoading: false,
                items: [],
                model: null,
                search: null
            },
            addressAutocomplete: {},
            statuses: EVENT_STATUSES,
            _beforeEditStatus: null,
            showStepper: false,
            dateTimeConfig: {
                format: DATETIME_DISPLAY_FORMAT
            },
            eventDate: null,
            eventTime: null,
            dateSelected: false,
            timeSelected: false,
            selectedTimezone: null,
            timeZoneAbbr: null
        };
    },
    components:{
        //TODO: MAP goes here
        MapAnnotation, VueGoogleAutocomplete, SharepointLink, MarkdownPanel, MapInput
    },
    computed: {
        ...mapGetters([
            'eventMetadata',
            'eventTypes',
            'eventCreatedAt',
            'eventProperties',
            'eventCoordinates',
            'currentUser'
        ]),
        subTypeSelect(){
            return this.newType.type == 'disease_outbreak' || this.newType.type == 'natural_disaster';
        },
        timezones(){
            return moment.tz.names();
        },
        timezoneOffSet(){
            var m = moment.tz(this.eventMetadata.event_local_time, this.eventMetadata.event_local_timezone);
            var mm = m.format();
            var testString = mm.substring(19, 22);
            return testString;
        },
        mapAddress(){
            var areas = this.eventMetadata.areas;
            if(areas && areas.length > 0) {
                return areas[0];
            }else{
                return {country: this.eventMetadata.country};
            }
        },
        allowEdit(){
            return this.eventMetadata.event_status != 'complete';
        }
    },

    mounted (){
        if(this.eventMetadata && this.eventMetadata.event_local_time){
            var localDT = this.eventMetadata.event_local_time;
            this.eventDate = moment(localDT).format("YYYY-MM-DD");
            this.eventTime = moment(localDT).format("HH:mm");
        }
    },
    methods: {
        openMap(){
            if(this.editing) this.mapDialog = true;
        },
        mdRender(value){
            if(value) return marked(value);
        },
        edit(){
            this._beforeEditingCache = Object.assign({}, this.eventMetadata);
            this.editing = true;
        },
        cancelEdit(){
            Object.assign(this.eventMetadata, this._beforeEditingCache);
            this.editing = false;
            this._beforeEditingCache = null;
        },
        lintDateTime(){
            var tmpDateTime = new Date(this.eventDate +' '+this.eventTime);

            this.eventMetadata.event_local_time = tmpDateTime;
            this.eventMetadata.event_local_timezone = this.selectedTimezone;
            this.eventMetadata.event_local_timezone_abbr = this.timeZoneAbbr;

        },
        lintStatus(){
            // check if status changed
            if(this.eventMetadata.event_status == this._beforeEditStatus) return;
            this.showStepper = true;
            var timestamp = new Date();
            var ISOTime = timestamp.toISOString();
            this.eventMetadata.status_updates.push({type: this.eventMetadata.event_status, timestamp: ISOTime});
        },
        save(){
            this.lintStatus();
            this.lintDateTime();

            this.eventMetadata.types = _.compact(this.eventMetadata.types);
            this.eventMetadata.incharge_operator = this.currentUser.username;
            this.inProgress = true;
            var payload = {
                type: this.eventMetadata.types.join(','),
                status: 'active',
                metadata: this.eventMetadata
            };
            var vm = this;
            console.log(payload);
            this.$store.dispatch(EDIT_EVENT, payload)
                .then((payload) =>{
                    var eventID = payload.data.result.objects.output.geometries[0].properties.id;
                    this.inProgress = false;
                    this.$parent.statusChanged = this.showStepper;
                    // TODO: CHECK if router actually pushed, store state didn't set to new event
                    this.$router.push({
                        name: 'event-general',
                        params: { slug: eventID}
                    });
                });
        },
        saveArea(){
            console.log("saveArea ------ ", this.response.area);


        },
        addType(){
            this.newType = this.defaultType;
        },
        submitType(){
            // strip value & append to this.eventTypes
            var tmp = this.newType;
            if(this.subTypeSelect){
                tmp.subtype == 'other' ? this.eventTypes.push(tmp.specify) : this.eventTypes.push(tmp.subtype);
            }else{
                this.eventTypes.push(tmp.type);
            }
            this.clearType();
        },
        clearType(){
            for (var fields in this.newType) delete this.newType[fields];
            this.newType = null;
        },
        deleteType(index){
            this.eventTypes.splice(index, 1);
        },
        addArea(){
            this.inEditArea = this.defaultArea;
        },
        editArea(area, severity, index){
            var tmpAddress = area.region ? `${area.region}, ${area.country_code}` : area.country;
            var tmpArea = { address: tmpAddress, severity };

            this.inEditArea = tmpArea;
            this.inEditAreaIndex = index;
        },
        submitArea(){
            var tmp = this.inEditArea;
            if(tmp.address){ // check if existing area obj
                this.eventMetadata.severity_measures[this.inEditAreaIndex] = tmp.severity;
                this.inEditAreaIndex = null;
            }else{
                this.eventMetadata.severity_measures.push(tmp.severity);
                this.eventMetadata.areas.push(this.addressAutocomplete); // double check this obj is useful for mapping [getAddressData]
            }
            this.clearArea();
        },
        clearArea(){
            for (var fields in this.inEditArea) delete this.inEditArea[fields];
            this.inEditArea = null;
            this.addressAutocomplete = null;
        },

        /**
        * When the location found
        * @param {Object} addressData Data of the found location
        * @param {Object} placeResultData PlaceResult object
        * @param {String} id Input container ID
        */
        getAddressData: function (addressData, placeResultData, id) {
            this.addressAutocomplete = addressData;
        }
    },
    watch: {
        editing(val){
            if(val){
                this._beforeEditStatus = this.eventMetadata.event_status;
                this.selectedTimezone = moment.tz.guess();
            }else{
                this.showMarkdown = false;
                this.save();
            }
        },
        '$route' (to, from){
            if(from.params.slug != to.params.slug){
                if(this.editing) this.editing = false;
            }
        },
        eventMetadata(newVal){
            if(!newVal.areas){
                var mockArea = {country: newVal.metadata.country, region: ''};
                this.eventMetadata.areas = [mockArea];
            }
            if(!newVal.severity_measures){
                var mockSeverity = {scale: newVal.severity_scale, description: newVal.severity};
                this.eventMetadata.severity_measures = [mockSeverity];
            }
            this.showStepper = false;
            if(newVal.event_local_time){
                var localDT = this.eventMetadata.event_local_time;
                this.eventDate = moment(localDT).format("YYYY-MM-DD");
                this.eventTime = moment(localDT).format("HH:mm");
            }

        },
        selectedTimezone(val){
            var zoneObj = moment.tz.zone(val);
            this.timeZoneAbbr = zoneObj.abbr(new Date());
        }
    }
};

</script>

<style lang="scss">
    @import '@/assets/css/display.scss';
    @import '@/assets/css/edit.scss';
    .sidePanel{
        top: 64px !important;
        height: 100% !important;
        background: #fff;
        width: 25% !important;
    }
    #timezonePicker{
        width: 80%;
        display: inline-block;
    }
    .severity-slider{
        width: 50%;
        .v-slider__thumb-container{
            left: 0;
        }
        .v-slider__ticks:first-of-type{
            color: $low-severity;
        }

        .v-slider__ticks:nth-of-type(2){
            color: $medium-severity;
        }

        .v-slider__ticks:nth-of-type(3){
            color: $high-severity;
        }


    }
    .slider-wrapper{
        align-items: baseline;
        .severity-labels{
            white-space: pre;
        }
    }
    #eventAreas{
        padding-right: 0;
    }

</style>
