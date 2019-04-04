<template>
  <v-layout row wrap>
    <v-flex xs4>
      <label> Search area for the emergency </label>
      <div id="geocoder" ref="addressField" class="geocoder" />
    </v-flex>
    <v-spacer />
    <v-flex xs6>
      <div class="one-half">
        <v-text-field
          id="editEventAddressLat"
          v-model="coordinates[1]"
          type="number"
          step=".001"
          min="-90"
          max="90"
          label="Latitude"
        />
      </div>
      <div class="one-half">
        <v-text-field
          id="editEventAddressLng"
          v-model="coordinates[0]"
          type="number"
          step=".001"
          min="-180"
          max="180"
          label="Longitude"
        />
      </div>
      <div class="reverseSuggestions">
        <v-list v-if="showSuggestion">
          <v-list-tile
            v-for="item in reverseGeojson.features"
            :key="item.id"
            @click="selectReverseGeocode(item)"
          >
            <v-list-tile-title>{{ item.place_name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </div>
    </v-flex>
    <v-flex xs12>
      <v-layout>
        <div id="newMap" class="map" />
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { MAPBOX_STYLES } from '@/common/map-fields';
import {
  FETCH_GEOJSON_POLYGON,
  FETCH_REVERSE_GEOCODER,
} from '@/store/actions.type';
import { UPDATE_RESPONSE_AREA_GEOMETRY } from '@/store/mutations.type';

import { mapGetters } from 'vuex';
import $ from 'jquery';
import _ from 'lodash';

/* eslint no-console: off */
let map;
let geocoder;
let draw;

export default {
  name: 'MapInput',
  data() {
    return {
      address: '',
      coordinates: [115.6628, 2.218],
      geocodeCenter: [],
      geocodeResult: {},
      reverseGeoJson: {},
      showSuggestion: false,
      polygon: {},
    };
  },
  computed: {
    ...mapGetters(['eventBoundary', 'reverseGeojson', 'eventCoordinates']),
  },
  watch: {
    address(newVal) {
      if (newVal) this.getBoundaries(newVal);
    },
    eventCoordinates(newVal) {
      console.log(newVal);
    },
    coordinates(newVal) {
      if (newVal) {
        map.jumpTo({ center: newVal });
        if (!_.isEqual(this.reverseGeoJson.center, newVal)) {
          this.reverseGeocode();
        }
      }
    },
    eventBoundary(newVal) {
      if (newVal) this.addBoundaryLayer();
    },
    reverseGeojson(newVal) {
      if (newVal && !this.eventCoordinates) {
        this.showSuggestion = true;
      }
    },
  },
  mounted() {
    this.initMap();
    if (!_.isEmpty(this.eventCoordinates)) {
      this.coordinates = this.eventCoordinates;
      this.addDrawTool();
    }
  },
  methods: {
    initMap() {
      const vm = this;

      map = new mapboxgl.Map({
        container: 'newMap',
        style: MAPBOX_STYLES.thematic,
        center: this.coordinates,
        zoom: 10,
        minZoom: 4,
      });

      geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: 'Search address/location',
      });

      if (!$('.mapboxgl-ctrl-geocoder').length) {
        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
      }

      geocoder.on('result', (payload) => {
        vm.coordinates = payload.result.center;
        vm.geocodeResult = payload.result;
        vm.geocodeCenter = payload.result.center;
        vm.address = payload.result.place_name;
        const tmp = payload.result;
        const tmpObj = {};
        const context = payload.result.context;

        if (!context) {
          const id = payload.result.place_type[0];
          tmpObj[id] = payload.result.place_name;
        } else {
          context.map((item) => {
            const id = item.id.split('.')[0];
            if (id == 'country') tmpObj.country_code = item.short_code;
            return (tmpObj[id] = item.text);
          });
        }

        vm.addressData = Object.assign(
          {
            latitude: tmp.geometry.coordinates[1],
            longitude: tmp.geometry.coordinates[0],
          },
          tmpObj,
        );
      });
    },
    resizeMap() {
      // console.log('----- resize map ----- ', map.loaded(), map.isStyleLoaded());
      map.resize();
    },
    addBoundaryLayer() {
      this.clearLayer();

      map.addLayer({
        id: 'newMapBoundary',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: this.eventBoundary.geojson,
          },
        },
        layout: {},
        paint: {
          'fill-color': '#0374C7',
          'fill-opacity': 0.35,
        },
      });
    },
    getBoundaries(query) {
      this.$store.dispatch(FETCH_GEOJSON_POLYGON, query);
    },
    clearLayer() {
      const mapLayer = map.getLayer('newMapBoundary');
      if (typeof mapLayer !== 'undefined') {
        map.removeLayer('newMapBoundary').removeSource('newMapBoundary');
      }
    },
    reverseGeocode: _.debounce(function () {
      if (!_.isEmpty(this.geocodeResult)) {
        const forwardCoords = this.geocodeResult.geometry.coordinates;
        console.log(this.coordinates, forwardCoords);
        if (!_.isEqual(this.coordinates, forwardCoords)) {
          this.$store.dispatch(FETCH_REVERSE_GEOCODER, this.coordinates);
        }
      } else {
        this.$store.dispatch(FETCH_REVERSE_GEOCODER, this.coordinates);
      }
    }, 500),
    addDrawTool() {
      draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });
      map.addControl(draw);
      map.on('draw.create', this.updateArea);
      map.on('draw.delete', this.updateArea);
      map.on('draw.update', this.updateArea);
      map.on('draw.modechange', this.drawModeChange);
    },
    updateArea(e) {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        const rounded_area = Math.round(area * 100) / 100;
      }
    },
    drawModeChange(e) {
      if (e.mode == 'simple_select') {
        const data = draw.getAll();
        if (data.features.length > 0) {
          this.polygon = data.features[0].geometry;
          this.$store.commit(UPDATE_RESPONSE_AREA_GEOMETRY, {
            area: data.features[0].geometry,
          });
        }
      }
    },
    /** deprecated ----
        * When the location found
        * @param {Object} addressData Data of the found location
        * @param {Object} placeResultData PlaceResult object
        * @param {String} id Input container ID

        getAddressData: function (addressData, placeResultData, id) {
            // addressData = {
            //     administrative_area_level_1: "Berlin"
            //     country: "Germany"
            //     latitude: 52.5379507
            //     locality: "Berlin"
            //     longitude: 13.395074499999964
            //     route: "Bernauer Straße" }
            this.addressData = addressData;
            this.coordinates = [addressData.longitude, addressData.latitude];
            this.addressAutocomplete = addressData;
        },
        */
    selectReverseGeocode(item) {
      this.reverseGeoJson = item;
      this.address = item.place_name;
      this.$refs.addressField.children[0].children[1].value = this.address;
      this.coordinates = item.center;
      this.showSuggestion = false;
    },
  },
};
</script>

<style lang="scss">
#newMap,
#generalAnnotation {
  display: block;
  width: 100%;
  height: 500px; // **height require by leaflet
}

.anchor-nav {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 30 !important;
}

.geocoder {
}
.mapboxgl-ctrl-geocoder {
  min-width: 100%;
  .geocoder-icon-search {
    display: none;
  }

  input[type='text'] {
    padding: 0;
    font-size: inherit;
  }
}

.mapboxgl-ctrl {
  box-shadow: none;
}
.reverseSuggestions {
  position: absolute;
  right: 0;
  z-index: 10;
  overflow-x: hidden;
  width: 50%;
  box-shadow: 1px 5px 10px #707070;
}
</style>
