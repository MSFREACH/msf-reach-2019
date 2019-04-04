module.exports = {
  "overrides": [
    {
      "rules": {
        "no-console": "off"
      },
      "files": [
        "build/build.js",
        "build/check-versions.js",
        "build/dev-server.js",
        "src/components/ContactList.vue",
        "src/components/MapLeaflet.vue",
        "src/components/MapMain.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Responses.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "no-dupe-keys": "off"
      },
      "files": [
        "src/views/New/NewContact.vue"
      ]
    },
    {
      "rules": {
        "no-empty": "off"
      },
      "files": [
        "src/components/CountryDetails.vue"
      ]
    },
    {
      "rules": {
        "no-redeclare": "off"
      },
      "files": [
        "build/check-versions.js",
        "src/components/MapMain.vue",
        "src/views/Map/MapAnnotation.vue"
      ]
    },
    {
      "rules": {
        "no-undef": "off"
      },
      "files": [
        "src/common/api.service.js",
        "src/components/EventList.vue",
        "src/components/MapLeaflet.vue",
        "src/components/MapMain.vue",
        "src/lib/geojson-util.js",
        "src/store/auth.module.js",
        "src/store/response.module.js",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewContact.vue"
      ]
    },
    {
      "rules": {
        "no-unreachable": "off"
      },
      "files": [
        "src/views/Event/Resources.vue"
      ]
    },
    {
      "rules": {
        "no-unused-vars": "off"
      },
      "files": [
        "build/vue-loader.config.js",
        "build/webpack.prod.conf.js",
        "src/components/CountryDetails.test.js",
        "src/components/CountryDetails.vue",
        "src/components/EventList.vue",
        "src/components/MapLeaflet.vue",
        "src/components/MapMain.vue",
        "src/components/RHeader.vue",
        "src/components/StatusStepper.vue",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/SITREP.vue",
        "src/views/Login.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewEvent.vue",
        "src/views/New/NewResponse.vue"
      ]
    },
    {
      "rules": {
        "null": "off"
      },
      "files": [
        "public/contact/contact.js",
        "public/landing/landing.js",
        "public/lib/pdfjs/web/debugger.js",
        "public/login/login.js",
        "public/resources/js/address-autocomplete.js",
        "public/resources/js/common.js",
        "public/resources/js/country-codes.js",
        "public/resources/js/events.js",
        "public/resources/js/landing.js",
        "public/resources/js/new-event.js"
      ]
    },
    {
      "rules": {
        "prettier/prettier": "off"
      },
      "files": [
        "src/components/RHeader.vue"
      ]
    },
    {
      "rules": {
        "vue/no-dupe-keys": "off"
      },
      "files": [
        "src/views/New/NewContact.vue"
      ]
    },
    {
      "rules": {
        "vue/no-parsing-error": "off"
      },
      "files": [
        "src/components/RHeader.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "vue/no-reserved-keys": "off"
      },
      "files": [
        "src/components/RowEntries/KeyFigures.vue",
        "src/components/RowEntries/ResponseProgrammes.vue",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/Responses.vue"
      ]
    },
    {
      "rules": {
        "vue/no-side-effects-in-computed-properties": "off"
      },
      "files": [
        "src/components/CountryDetails.vue",
        "src/views/Event/Resources.vue"
      ]
    },
    {
      "rules": {
        "vue/no-template-shadow": "off"
      },
      "files": [
        "src/components/EventList.vue",
        "src/views/Event/SITREP.vue"
      ]
    },
    {
      "rules": {
        "vue/no-unused-components": "off"
      },
      "files": [
        "src/components/Event.vue",
        "src/components/EventList.vue"
      ]
    },
    {
      "rules": {
        "vue/no-use-v-if-with-v-for": "off"
      },
      "files": [
        "src/views/Event/Responses.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "vue/no-v-html": "off"
      },
      "files": [
        "src/components/RHeader.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue",
        "src/views/New/NewEvent.vue",
        "src/views/NewsFeed/Twitter.vue"
      ]
    },
    {
      "rules": {
        "vue/order-in-components": "off"
      },
      "files": [
        "src/components/Event.vue",
        "src/components/MapLeaflet.vue",
        "src/components/MapMain.vue",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/Responses.vue",
        "src/views/Event/SITREP.vue",
        "src/views/Login.vue",
        "src/views/New/NewResponse.vue",
        "src/views/NewsFeed/RssFeed.vue",
        "src/views/NewsFeed/Twitter.vue"
      ]
    },
    {
      "rules": {
        "vue/require-default-prop": "off"
      },
      "files": [
        "src/components/Event.vue",
        "src/components/EventList.vue",
        "src/components/MapLeaflet.vue",
        "src/components/MapMain.vue",
        "src/components/NewsFeed.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/components/RowEntries/ResponseProgrammes.vue",
        "src/components/StatusStepper.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Resources.vue",
        "src/views/Map/MapAnnotation.vue"
      ]
    },
    {
      "rules": {
        "vue/require-prop-types": "off"
      },
      "files": [
        "src/components/EventList.vue"
      ]
    },
    {
      "rules": {
        "vue/require-v-for-key": "off"
      },
      "files": [
        "src/views/Event/General.vue",
        "src/views/Event/Responses.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "vue/return-in-computed-property": "off"
      },
      "files": [
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/Notifications.vue"
      ]
    },
    {
      "rules": {
        "vue/this-in-template": "off"
      },
      "files": [
        "src/components/CountryDetails.vue"
      ]
    },
    {
      "rules": {
        "vue/valid-v-model": "off"
      },
      "files": [
        "src/views/Event/General.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "vue/valid-v-on": "off"
      },
      "files": [
        "src/components/RHeader.vue"
      ]
    }
  ]
}
