<template>
    <v-layout row wrap app>
        <v-btn id="filterMenu" @click.stop="drawer = !drawer"><v-icon>menu</v-icon></v-btn>
        <v-card class="d-inline-block elevation-12">
            <v-navigation-drawer v-model="drawer" floating app id="filterBar">
                <v-layout row wrap>
                    <v-flex>
                        <v-card-text>
                            <v-treeview
                                v-model="tree"
                                :items="filterItems"
                                activatable
                                active-class="grey lighten-4 blue--text"
                                selected-color="active"
                                open-on-click
                                selectable
                                expand-icon="expand_more"
                                on-icon="check_box"
                                off-icon="check_box_outline_blank"
                                indeterminate="indeterminate_check_box"
                            >
                            <template v-slot:label="{ item }">
                                <img v-if="item.children" class="menu-icon" :src="'/resources/new_icons/menu_'+item.value+'.svg'">
                                <img v-else class="menu-icon":src="'/resources/new_icons/menu_'+item.id+'.svg'">
                                <span>{{item.name}} </span>
                            </template>
                            </v-treeview>
                        </v-card-text>
                    </v-flex>
                </v-layout>
            </v-navigation-drawer>
        </v-card>
        <v-card class="d-inline-block elevation-12">

        </v-card>
        <div id="map" class="map"></div>
        <v-layout class="mode-docker">
            <v-flex xs12 sm6 class="py-2">
                <v-btn-toggle v-model="toggle_mode" mandatory>
                  <v-btn flat value="thematic">
                    <v-icon>invert_colors</v-icon>
                  </v-btn>
                  <v-btn flat value="terrain">
                    <v-icon>terrain</v-icon>
                  </v-btn>
                  <v-btn flat value="satellite">
                    <v-icon>satellite</v-icon>
                  </v-btn>
                  <v-btn flat value="humanitarian">
                    <v-icon>accessibility_new</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-flex>
          </v-layout>
    </v-layout>
</template>
<script>
/*eslint no-console: off*/
/*eslint no-unused-vars: off*/
/*eslint no-negated-condition: off*/
/*eslint no-debugger: off*/

import { mapGetters } from 'vuex';
import { MAPBOX_STYLES, MAP_FILTERS } from '@/common/map-fields';
import { STATUS_ICONS } from '@/common/map-icons';
import { FETCH_EVENTS, FETCH_REPORTS, FETCH_CONTACTS } from '@/store/actions.type';
import { getFeatures, getEventFeatures } from '@/lib/geojson-util';
import { EVENT_STATUSES, REPORT_TYPES, CONTACT_TYPES, CONTACT_BOOL } from '@/common/common';
import moment from 'moment';

var map;

export default {
    name: 'map-main',
    props: {
        coordinates: {
            type: Array
        },
        eventId: {
            type: String,
            required: false
        }
    },
    data(){
        return{
            drawer: null,
            eventFeatureCollection:[],
            recentCoordinates: [],
            toggle_mode: 1,
            selectedFilters: null,
            filterItems: MAP_FILTERS,
            layerIds: [],
            allEventStatuses: EVENT_STATUSES,
            allReportTypes: REPORT_TYPES,
            allContactTypes: CONTACT_TYPES,
            tree:[]
        };
    },
    mounted(){
        this.fetchData();
    },
    watch: {
        coordinates(newVal){
            this.map.setView([newVal[0], newVal[1]], 7);
            this.map.invalidateSize();
        },
        eventsGeoJson(val){
            if(val){
                this.initMap();
            }
        },
        toggle_mode(val){
            map.setStyle(MAPBOX_STYLES[val]);
            this.clearLayers();
            var vm = this;
            setTimeout(function(){
                vm.loadEventsLayer();
                vm.appendEventsTooltip();
            }, 500);

        },
        selections(val){
            var selectedLayerIds = val.map(item => item.id);
            this.layerIds.forEach(function(layerId){
                map.setLayoutProperty(layerId, 'visibility',
                    selectedLayerIds.indexOf(layerId) > -1 ? 'visible' : 'none');
            });
        }
    },
    computed: {
        ...mapGetters([
            'eventsCount',
            'isLoadingEvent',
            'eventsGeoJson',
            'reportsGeoJson',
            'contactsGeoJson',
            'fetchEventsError'
        ]),
        selections () {
          const selections = []
          var tmpList = [];
          for(const filters of this.filterItems){
              tmpList = tmpList.concat(filters.children);
          };

          for (const leaf of this.tree) {
            var selection = this.filterItems.find(item => item.id == leaf);
            if (!selection) {
                selection = tmpList.find(item => item.id == leaf);
            }
            if (!selection) continue;
            selections.push(selection)
          }

          return selections
        }
    },
    methods: {
        fetchData() {
            this.$store.dispatch(FETCH_EVENTS, {});
            this.$store.dispatch(FETCH_REPORTS, {});
            this.$store.dispatch(FETCH_CONTACTS, {});
        },
        initMap(){
            var geojsonEvents = this.eventsGeoJson.objects.output;
            var eventFeatureCollection = getFeatures(this.eventsGeoJson, 'output');

            if(this.eventId){
                var eventObj = eventFeatureCollection.filter(item =>{
                    return item.properties.id == this.eventId;
                });
                var gotoCoordinates = eventObj[0].geometry.coordinates;
                this.recentCoordinates = gotoCoordinates;
            }else if(!_.isEmpty(this.recentCoordinates)){
                var gotoCoordinates = this.recentCoordinates; // to not lose center when refreshing
            }else{
                var gotoCoordinates = geojsonEvents.geometries[0].coordinates;
            }

            map = new mapboxgl.Map({
                container: 'map',
                style: MAPBOX_STYLES.thematic,
                center: gotoCoordinates,
                zoom: 10,
                minZoom: 4
            });

            var vm = this;
            map.on('load', function () {
                vm.loadEventsLayer();
                vm.appendEventsTooltip();
                vm.loadReportsLayer();

                vm.loadContactsLayer();
                vm.appendContactsTooltip()
            });
            map.on('zoom', function(e){
                // console.log(map.getZoom());
            });
        },
        clearLayers(){
            map.removeLayer("events-heat");
            map.removeLayer("events-epicenter");
            this.allEventStatuses.forEach(function(item){
                map.removeLayer('events_'+item.value);
            });
            map.removeLayer('events_assessment');
            map.removeLayer("events-cluster-count");
            map.removeLayer("events-unclustered-point");
            map.removeSource("reach-events");
        },
        loadEventsLayer(){
            var vm = this;
            var featureCollection = getEventFeatures(this.eventsGeoJson, 'output');
            vm.allEventStatuses.forEach(function(item){
                var imageId = 'event-'+item.value;
                var imageKey = `/resources/new_icons/event_${item.value}.png`;

                map.loadImage(imageKey, function(error, image){
                    if(!map.hasImage(imageId)){
                        if(error) throw error;
                        map.addImage(imageId, image);
                    }
                });
            })

            if(!map.getSource("reach-events")){

                map.addSource("reach-events", {
                    type: "geojson",
                    data: {
                        "type": "FeatureCollection",
                        "features": featureCollection
                    },
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50
                });


            }
            if(!map.getLayer("events-heat")){
                map.addLayer({
                    "id": "events-heat",
                    "type": "heatmap",
                    "source": "reach-events",
                    "maxzoom": 9,
                    "paint": {
                        // Increase the heatmap weight based on frequency and property magnitude
                        "heatmap-weight": [
                            "interpolate",
                            ["linear"],
                            ["get", "point_count"],
                            0, 0,
                            10, 1
                        ],
                        // Increase the heatmap color weight weight by zoom level
                        // heatmap-intensity is a multiplier on top of heatmap-weight
                        "heatmap-intensity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            0, 1,
                            9, 3
                        ],
                        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        // Begin color ramp at 0-stop with a 0-transparancy color
                        // to create a blur-like effect.
                        "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0, "rgba(207,210,218,.2)",
                            0.25, "rgba(154,186,213,.4)",
                            0.5, "rgba(104,163,208,.6)",
                            0.75, "rgba(56,140,204,.8)",
                            1, "rgba(3,116,199, 1)"
                        ],
                        // Adjust the heatmap radius by zoom level
                        "heatmap-radius": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            0, 2,
                            2, 76 // ADJUST FOR: blur radius
                        ],
                        // Transition from heatmap to circle layer by zoom level
                        "heatmap-opacity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7, 1,
                            9, 0
                        ],
                    }
                });
            }
            if(!map.getLayer("events-epicenter")){
                map.addLayer({
                    id: "events-epicenter",
                    type: "circle",
                    source: "reach-events",
                    minzoom: 7,
                    paint: {
                       "circle-color": [
                           "step",
                           ["get", "point_count"],
                           "rgba(3, 116, 199, .5)", // wine red , less than 5
                           5,
                           "rgba(3, 116, 199, .5)", // standard red, between 5 and 10
                           10,
                           "rgba(3, 116, 199, .5)" // bright red, greater than or equal to 10
                       ],
                       "circle-radius": [
                           "step",
                           ["get", "point_count"],
                           20,  // size, less than 5
                           5,
                           30,  // size between 5 and 10
                           20,
                           50  // size greater than or equal to 10
                       ]
                    },
                    filter: ["==", "$type", "Point"],
                });
            }
            featureCollection.forEach(function(feature){
                var status = feature.properties.metadata.event_status.toLowerCase();
                if(status=='assessment'){
                    var iconImage = 'event-ongoing';
                }else{
                    var iconImage = "event-"+status;
                }
                var layerId = 'events_'+status;
                if(!map.getLayer(layerId)){
                    map.addLayer({
                        id: layerId,
                        type: "symbol",
                        source: "reach-events",
                        minzoom: 9,
                        layout: {
                            "icon-image": iconImage,
                            "icon-allow-overlap": true
                        },
                        filter: ["==", "event_status", status]
                    });
                    vm.layerIds.push(layerId);
                }
            });


            if(!map.getLayer("events-cluster-count")){
                map.addLayer({
                    id: "events-cluster-count",
                    type: "symbol",
                    minzoom: 6,
                    source: "reach-events",
                    filter: ["has", "point_count"],
                    layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12
                    }
                });
            }

            if(!map.getLayer("events-unclustered-point")){
                map.addLayer({
                    id: "events-unclustered-point",
                    type: "circle",
                    source: "reach-events",
                    minzoom: 7,
                    maxzoom: 10,
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-color": "rgba(3, 116, 199, .5)",
                        "circle-radius": 10,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "rgba(3, 116, 199, .5)"
                    }
                });
            }
            // vm.layerIds.push("events-heat", "events-epicenter", )
        },
        appendEventsTooltip(){
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: true,
                closeOnClick: false
            });

            map.on('mouseenter', 'events-epicenter', function(e) {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';
                var coordinates = e.features[0].geometry.coordinates.slice();

                var evMeta = JSON.parse(e.features[0].properties.metadata);
                var description = evMeta.description; // <<< missing feature.properties, need to convert GeometryCollection to FeatureCollection
                var evName = evMeta.name;
                // var evType = evMeta.types.join(',');
                var evStatus = evMeta.event_status;

                var cleanAreas = _.compact(evMeta.areas);
                var evPlace;
                if(!evMeta.areas || _.isEmpty(cleanAreas)){
                    evPlace = evMeta.country;
                }else{
                    if(cleanAreas[0].region){
                        evPlace = cleanAreas[0].region + cleanAreas[0].country_code;
                    }else{
                        evPlace = cleanAreas[0].country;
                    }
                }

                var evLastUpdate = moment(e.features[0].properties.updated_at).fromNow();

                var contentStr = `<a href="#/events/${e.features[0].properties.id}">
                    <div class="secondary-text">${evName}</div>
                    <div class="specified-primary">${evPlace} </div>
                    <label>${evLastUpdate} </label>
                    </a> `;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates)
                    .setHTML(contentStr)
                    .addTo(map);
            });

             // map.on('mouseleave', 'events-epicenter', function() {
             //     map.getCanvas().style.cursor = '';
             //     popup.remove();
             // });
        },
        zoomToEventCenter(){
            var eventObj = this.eventFeatureCollection.filter(item =>{
                return item.properties.id == this.eventId;
            });

            map.flyTo({center: [eventObj.geometry.coordinates]});
        },
        loadReportsLayer(){
            var vm = this;
            var featureCollection = getFeatures(this.reportsGeoJson, 'output');
            vm.allReportTypes.forEach(function(item){
                var imageId = 'report-'+item.value;
                var imageKey = `/resources/new_icons/report_${item.toLowerCase()}.png`;
                map.loadImage(imageKey, function(error, image){
                    if(!map.hasImage(imageId)){
                        if(error) throw error;
                        map.addImage(imageId, image);
                    }
                });
            })

            if(!map.getSource("reach-reports")){
                map.addSource("reach-reports", {
                    type: "geojson",
                    data: {
                        "type": "FeatureCollection",
                        "features": featureCollection
                    },
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 25
                })
            }

            if(!map.getLayer("reports-epicenter")){
                map.addLayer({
                    id: "reports-epicenter",
                    type: "circle",
                    source: "reach-reports",
                    paint: {
                        // increase circle size as user zooms from z12 to z22
                        "circle-radius":{
                            base: 1.17,
                            stops: [[12,2], [22, 20]]
                        },
                        "circle-color":[
                            'match',
                            ['get', 'type'],
                            'ACCESS', '#F38181',
                            'CONTACT', '#95E1D3',
                            'NEED', '#FFB677',
                            'SECURITY', '#FCE38A',
                            /* other */ '#fff'
                        ]
                    },
                    filter: ["==", "$type", "Point"]
                });
            }

            featureCollection.forEach(function(feature){
                var type = feature.properties.type;
            })


        },
        loadContactsLayer(){
            var vm = this;
            var featureCollection = getFeatures(this.contactsGeoJson, 'output');

            if(!map.getSource("reach-contacts")){
                map.addSource("reach-contacts", {
                    type: "geojson",
                    data: {
                        "type": "FeatureCollection",
                        "features": featureCollection
                    },
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 25
                })
            }

            if(!map.getLayer("contacts-epicenter")){
                map.addLayer({
                    id: "contacts-epicenter",
                    type: "circle",
                    source: "reach-contacts",
                    paint: {
                        // increase circle size as user zooms from z12 to z22
                        "circle-radius":{
                            base: 1.17,
                            stops: [[12,2], [22, 180]]
                        },
                        "circle-color":[
                            'match',
                            ['get', 'type'],
                            'ACCESS', '#F38181',
                            'CONTACT', '#95E1D3',
                            'NEED', '#FFB677',
                            'SECURITY', '#FCE38A',
                            /* other */ '#fff'
                        ]
                    },
                    filter: ["==", "$type", "Point"]
                });
            }
        },

        appendContactsTooltip(){
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: true,
                closeOnClick: false
            });

            map.on('mouseenter', 'contacts-epicenter', function(e) {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';
                var coordinates = e.features[0].geometry.coordinates.slice();
                console.log('----- parsed error ------- ', e.features[0].properties);  /// TODO:  cluster points cannot render popups;
                var properties = JSON.parse(e.features[0].properties.properties);
                var msfStr = `<div class="bold-text"> ${properties.OC ? properties.OC : ''} </div>
                <div class="note-text"> ${properties.msf_employment ? properties.msf_employment + ',' : ''} ${properties.msf_additional}</div>`;

                var nonMSFstr = `<div class="bold-text"> ${properties.msf_associate ? 'MSF Associate' : ''} </div>
                <div class="bold-text"> ${properties.msf_peer ? 'MSF Peer' : ''} </div>
                <div class="bold-text"> ${properties.employer ? properties.employer : ''} ${properties.division ? properties.division +', ': ''}</div>`;


                var contentStr = `<a href="#/contacts/${e.features[0].properties.id}">
                    <div class="secondary-text">${properties.name}</div>
                    <div class="specified-text"> ${properties.type}</div>
                    ${ properties.type == CONTACT_BOOL.internal ? msfStr : nonMSFstr }
                    <div class="note-text"> ${properties.job_title ? properties.job_title : ''}</div>
                    <div class="note-text"> ${properties.email}</div>
                    <div class="note-text"> ${properties.cell}</div>
                    <div class="note-text"> ${properties.address}</div>
                    <label></label>
                    </a> `;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                popup.setLngLat(coordinates)
                    .setHTML(contentStr)
                    .addTo(map);
            });

            map.on('mouseleave', 'contacts-epicenter', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

        },

    }

};

</script>

<style lang='scss'>
@import '@/assets/css/map.scss';
@import '@/assets/css/util/colors.scss';

#filterTree{
    position: absolute;
    top: 350px;
    z-index: 10;
    background: $bg-light-mode;
    width: 300px;
}

.v-treeview-node__label{
    vertical-align: top;
}

.v-treeview-node__checkbox, .v-treeview-node__toggle{
    color: $color-active !important;
}
.v-treeview-node__content{
    span{
        vertical-align: top;
        margin-left: 8px;
    }
}

.v-icon.v-treeview-node__checkbox{
    position:absolute;
    right: 21px;
}
</style>
