module.exports = {
  "overrides": [
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
        "src/components/MapMain.vue",
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
        "src/components/ContactList.vue",
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
        "src/views/New/NewResponse.vue"
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
