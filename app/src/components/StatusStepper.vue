<template>
  <v-container class="statusStepperWrapper">
    <i>
      You changed this event’s status to
      <b :class="currentStatus"> {{ statusLabel }} </b>. Please revise the
      highlighted information.
    </i>
    <v-stepper v-model="eb">
      <v-stepper-header>
        <v-flex v-for="(item, i) in statusRoute" :key="i">
          <v-stepper-step :step="i" :complete="eb > i">
            <router-link
              :to="{
                name: item.component,
                params: { reviewFields: item.fields }
              }"
              @click.native="eb = i"
            >
              {{ item.section }} {{ item.fields.length }}
            </router-link>
          </v-stepper-step>
          <v-divider v-if="i < statusRoute.length - 1" />
        </v-flex>
        <v-spacer />
      </v-stepper-header>
    </v-stepper>
  </v-container>
</template>

<script>
import { EVENT_STATUSES } from '@/common/common';
import { STATUS_CHANGE_STEPPERS } from '@/common/navigational-fields.js';
/* eslint no-debugger: off */
/* eslint no-console: off */

export default {
  name: 'StatusStepper',
  props: {
    currentStatus: {
      type: String,
    },
  },
  data() {
    return {
      eb: 0,
      allRoutes: STATUS_CHANGE_STEPPERS,
      allEventStatuses: EVENT_STATUSES,
      reviewedSection: {},
    };
  },
  computed: {
    statusRoute() {
      return this.allRoutes[this.currentStatus];
    },
    statusLabel() {
      return this.allEventStatuses.filter(
        item => item.value == this.currentStatus,
      )[0].text;
    },
  },
  watch: {
    currentStatus(val) {
      this.mapSectionsToReview();
    },
  },
  mounted() {
    this.mapSectionsToReview();
  },
  methods: {
    mapSectionsToReview() {
      const sectionKeys = this.allRoutes[this.currentStatus].map(
        item => item.section,
      );
      const vm = this;
      sectionKeys.forEach((item) => {
        vm.reviewedSection[item] = [];
      });
    },
  },
};
</script>

<style lang="scss">
.statusStepperWrapper {
  position: fixed;
  bottom: 0;
  padding: 0;
  max-width: 100%;
  i {
    padding: 0 21px;
  }
  .v-stepper {
    background: #e8e8e8 !important;
    .v-stepper__step__step {
      background: #e5f0f9 !important;
      .v-icon {
        color: #0374c7 !important;
      }
    }
    .router-link-active {
      color: #231f20;
    }
  }
}

.v-stepper__header {
  height: 56px;
  margin-left: 3%;
}
.v-stepper,
.v-stepper__header {
  box-shadow: none;
}
</style>
