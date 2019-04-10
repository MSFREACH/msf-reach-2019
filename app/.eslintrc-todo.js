module.exports = {
  "overrides": [
    {
      "rules": {
        "array-callback-return": "off"
      },
      "files": [
        "src/components/EventList.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/store/event.module.js",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue"
      ]
    },
    {
      "rules": {
        "block-scoped-var": "off"
      },
      "files": [
        "build/check-versions.js",
        "src/components/MapMain.vue",
        "src/views/Map/MapAnnotation.vue"
      ]
    },
    {
      "rules": {
        "camelcase": "off"
      },
      "files": [
        "src/views/Map/MapInput.vue"
      ]
    },
    {
      "rules": {
        "consistent-return": "off"
      },
      "files": [
        "src/common/date.filter.js",
        "src/components/CountryDetails.vue",
        "src/components/EventList.vue",

        "src/components/RowEntries/KeyFigures.vue",
        "src/store/event.module.js",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "eqeqeq": "off"
      },
      "files": [
        "src/components/ContactList.vue",
        "src/components/CountryDetails.vue",
        "src/components/Event.vue",
        "src/components/EventList.vue",
        "src/components/EventMeta.vue",
        "src/components/MapMain.vue",
        "src/components/ReportList.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/components/RowEntries/ResponseProgrammes.vue",
        "src/components/StatusStepper.vue",
        "src/store/event.module.js",
        "src/store/eventNotification.module.js",
        "src/store/util.module.js",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/Responses.vue",
        "src/views/Event/SITREP.vue",
        "src/views/Login.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewContact.vue",
        "src/views/New/NewEvent.vue",
        "src/views/New/NewResponse.vue"
      ]
    },
    {
      "rules": {
        "func-names": "off"
      },
      "files": [
        "build/check-versions.js",
        "build/utils.js",
        "src/views/Map/MapInput.vue"
      ]
    },
    {
      "rules": {
        "global-require": "off"
      },
      "files": [
        "build/check-versions.js",
        "build/webpack.base.conf.js",
        "build/webpack.prod.conf.js",
        "build/webpack.test.conf.js"
      ]
    },
    {
      "rules": {
        "guard-for-in": "off"
      },
      "files": [
        "build/utils.js",
        "src/store/SITREP.module.js",
        "src/store/countryDetails.module.js",
        "src/store/event.module.js",
        "src/store/eventNotification.module.js",
        "src/store/response.module.js",
        "src/views/Event/General.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "import/extensions": "off"
      },
      "files": [
        "src/App.vue",
        "src/common/api.service.js",
        "src/components/ContactList.vue",
        "src/components/CountryDetails.vue",
        "src/components/Event.vue",
        "src/components/EventList.vue",
        "src/components/EventMeta.vue",

        "src/components/MapMain.vue",
        "src/components/NewsFeed.vue",
        "src/components/RHeader.vue",
        "src/components/ReportList.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/components/RowEntries/ResponseProgrammes.vue",
        "src/components/StatusStepper.vue",
        "src/main.js",
        "src/store/auth.module.js",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/Responses.vue",
        "src/views/Event/SITREP.vue",
        "src/views/EventNav.vue",
        "src/views/LandingEvents.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewContact.vue",
        "src/views/New/NewEvent.vue",
        "src/views/New/NewReport.vue",
        "src/views/New/NewResponse.vue",
        "src/views/NewsFeed/Twitter.vue"
      ]
    },
    {
      "rules": {
        "import/named": "off"
      },
      "files": [
        "src/store/profile.module.js"
      ]
    },
    {
      "rules": {
        "import/no-duplicates": "off"
      },
      "files": [
        "src/components/Event.vue"
      ]
    },
    {
      "rules": {
        "import/no-extraneous-dependencies": "off"
      },
      "files": [
        "build/build.js",
        "build/check-versions.js",
        "build/dev-server.js",
        "build/utils.js",
        "build/webpack.base.conf.js",
        "build/webpack.dev.conf.js",
        "build/webpack.prod.conf.js",
        "build/webpack.test.conf.js",
        "src/components/ContactList.vue",
        "src/components/CountryDetails.vue",
        "src/components/EventList.vue",

        "src/components/MapMain.vue",
        "src/components/RHeader.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/components/RowEntries/ResponseProgrammes.vue",
        "src/main.js",
        "src/store/contact.module.js",
        "src/store/event.module.js",
        "src/store/events.module.js",
        "src/store/report.module.js",
        "src/store/response.module.js",
        "src/store/util.module.js",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/Responses.vue",
        "src/views/Event/SITREP.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewContact.vue",
        "src/views/New/NewEvent.vue",
        "src/views/New/NewResponse.vue",
        "src/views/NewsFeed/RssFeed.vue",
        "src/views/NewsFeed/Twitter.vue"
      ]
    },
    {
      "rules": {
        "import/no-unresolved": "off"
      },
      "files": [
        "build/webpack.prod.conf.js",
        "build/webpack.test.conf.js",
      ]
    },
    {
      "rules": {
        "import/order": "off"
      },
      "files": [
        "build/dev-server.js",
        "build/vue-loader.config.js"
      ]
    },
    {
      "rules": {
        "import/prefer-default-export": "off"
      },
      "files": [
        "src/common/file-preview.js",
        "src/common/map-icons.js"
      ]
    },
    {
      "rules": {
        "max-len": "off"
      },
      "files": [
        "src/common/api.service.js",
        "src/components/EventMeta.vue",

        "src/components/MapMain.vue",
        "src/store/event.module.js",
        "src/views/Event/Figures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Resources.vue",
        "src/views/Map/MapAnnotation.vue"
      ]
    },
    {
      "rules": {
        "no-alert": "off"
      },
      "files": [
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/ExtCapacity.vue"
      ]
    },
    {
      "rules": {
        "no-console": "off"
      },
      "files": [
        "build/build.js",
        "build/check-versions.js",
        "build/dev-server.js",
        "src/components/ContactList.vue",

        "src/components/MapMain.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/General.vue",
        "src/views/Event/Responses.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "no-continue": "off"
      },
      "files": [
        "src/components/ContactList.vue",
        "src/components/MapMain.vue"
      ]
    },
    {
      "rules": {
        "no-dupe-keys": "off"
      },
      "files": [
        "src/components/ContactList.vue",
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
        "no-multi-assign": "off"
      },
      "files": [
        "src/components/CountryDetails.vue",
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/Figures.vue",
        "src/views/Event/Resources.vue",
        "src/views/Event/Responses.vue"
      ]
    },
    {
      "rules": {
        "no-param-reassign": "off"
      },
      "files": [
        "build/utils.js",
        "build/vue-loader.config.js",
        "src/common/api.service.js",
        "src/common/text.filter.js",
        "src/components/Event.vue",
        "src/components/EventList.vue",

        "src/lib/geojson-util.js",
        "src/store/auth.module.js",
        "src/store/profile.module.js",
        "src/store/util.module.js",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue"
      ]
    },
    {
      "rules": {
        "no-plusplus": "off"
      },
      "files": [
        "build/check-versions.js",
        "src/components/ContactList.vue",
        "src/store/event.module.js",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue"
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
        "no-restricted-globals": "off"
      },
      "files": [
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/ExtCapacity.vue"
      ]
    },
    {
      "rules": {
        "no-restricted-syntax": "off"
      },
      "files": [
        "build/utils.js",
        "src/components/ContactList.vue",
        "src/components/MapMain.vue",
        "src/store/SITREP.module.js",
        "src/store/countryDetails.module.js",
        "src/store/event.module.js",
        "src/store/eventNotification.module.js",
        "src/store/response.module.js",
        "src/views/Event/General.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "no-return-assign": "off"
      },
      "files": [
        "src/components/Event.vue",
        "src/views/Event/Resources.vue",
        "src/views/Map/MapInput.vue"
      ]
    },
    {
      "rules": {
        "no-sequences": "off"
      },
      "files": [
        "build/vue-loader.config.js"
      ]
    },
    {
      "rules": {
        "no-shadow": "off"
      },
      "files": [
        "build/build.js",
        "build/vue-loader.config.js",
        "src/store/SITREP.module.js",
        "src/store/auth.module.js",
        "src/store/contact.module.js",
        "src/store/countryDetails.module.js",
        "src/store/event.module.js",
        "src/store/eventNotification.module.js",
        "src/store/events.module.js",
        "src/store/profile.module.js",
        "src/store/report.module.js",
        "src/store/response.module.js",
        "src/store/util.module.js",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "no-undef": "off"
      },
      "files": [
        "src/common/api.service.js",
        "src/components/EventList.vue",
        "src/components/MapMain.vue",
        "src/store/auth.module.js",
        "src/store/response.module.js",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewContact.vue"
      ]
    },
    {
      "rules": {
        "no-underscore-dangle": "off"
      },
      "files": [
        "build/dev-server.js",
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
        "no-unreachable": "off"
      },
      "files": [
        "src/views/Event/Resources.vue"
      ]
    },
    {
      "rules": {
        "no-unused-expressions": "off"
      },
      "files": [
        "build/vue-loader.config.js",
        "src/components/RowEntries/KeyFigures.vue",
        "src/views/Event/ExtCapacity.vue",
        "src/views/Event/General.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "no-unused-vars": "off"
      },
      "files": [
        "build/vue-loader.config.js",
        "build/webpack.prod.conf.js",
        "src/components/ContactList.vue",
        "src/components/CountryDetails.test.js",
        "src/components/CountryDetails.vue",
        "src/components/EventList.vue",
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
        "no-use-before-define": "off"
      },
      "files": [
        "build/dev-server.js",
        "src/views/Event/Notifications.vue",
        "src/views/New/NewEvent.vue"
      ]
    },
    {
      "rules": {
        "no-var": "off"
      },
      "files": [
        "build/check-versions.js",
        "src/components/MapMain.vue",
        "src/views/Map/MapAnnotation.vue"
      ]
    },
    {
      "rules": {
        "prefer-destructuring": "off"
      },
      "files": [
        "build/dev-server.js",
        "build/webpack.prod.conf.js",
        "src/components/MapMain.vue",
        "src/store/auth.module.js",
        "src/store/countryDetails.module.js",
        "src/views/Event/General.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/SITREP.vue",
        "src/views/Map/MapAnnotation.vue",
        "src/views/Map/MapInput.vue",
        "src/views/New/NewReport.vue"
      ]
    },
    {
      "rules": {
        "radix": "off"
      },
      "files": [
        "src/components/ReportList.vue",
        "src/views/Event/Notifications.vue",
        "src/views/Event/Responses.vue",
        "src/views/Event/SITREP.vue",
        "src/views/New/NewResponse.vue"
      ]
    },
    {
      "rules": {
        "vars-on-top": "off"
      },
      "files": [
        "build/check-versions.js",
        "src/components/MapMain.vue",
        "src/views/Map/MapAnnotation.vue"
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
