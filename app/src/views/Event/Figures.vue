<template>
  <v-container class="eventSubContent statusToggle">
    <nav
      v-if="eventFigures.keyFigures && eventFigures.keyFigures.length > 0"
      class="statusTabWrapper"
    >
      <v-btn
        v-for="(item, index) in eventFigures.keyFigures"
        :key="index"
        :class="item.status.toLowerCase() + '-wrapper statusTabs'"
        flat
        small
        @click="switchStatus(item)"
        >{{ item.status }}</v-btn
      >
    </nav>
    <nav v-else class="statusTabWrapper">
      <v-btn
        :class="eventStatus.toLowerCase() + '-wrapper statusTabs'"
        flat
        small
        >{{ eventStatus }}</v-btn
      >
    </nav>

    <div
      :class="editing ? 'edit-wrapper  full-text-fields' : ' full-text-fields'"
      dark
    >
      <div v-if="eventFigures">
        <v-layout v-if="allowEdit" class="actions">
          <v-switch v-model="editing" :label="editing ? `save` : `edit`" />
          <span v-if="editing" class="cancel" @click="cancelEdit()"
            ><v-icon>close</v-icon></span
          >
        </v-layout>
        <v-layout v-if="editing" row wrap dark>
          <label>KEY FIGURES</label>
          <div ref="key-figures" class="full-width">
            <key-figures :active-key-figures="activeKeyFigures" />
          </div>
          <hr class="row-divider" />
          <div ref="total-beneficiaries" class="one-half">
            <label>NUMBER OF BENEFICIARIES </label>
            {{ totalBeneficiaries }}
          </div>
          <v-spacer />
          <div class="one-half">
            <label>NUMBER OF SERVICES PROVIDED </label>
            {{ totalServices }}
          </div>
          <hr class="row-divider" />
          <v-flex xs6>
            <v-text-field
              v-model="editFigures.population.total"
              label="Country Population"
              type="number"
            />
            <v-text-field
              v-model="editFigures.population.impacted"
              label="Affected Population"
              type="number"
            />
          </v-flex>
          <v-flex xs6 />

          <v-flex xs6>
            <div class="one-third">
              <label> MORTALITY Rate </label>
              <v-text-field
                v-model="editFigures.population.mortality.rate"
                type="number"
              />
            </div>
            <div class="one-third">
              <label> Population at risk </label>
              <v-select
                v-model="editFigures.population.mortality.population"
                :items="allSelections.population"
              />
              <v-text-field
                v-if="editFigures.population.mortality.population == 'other'"
                v-model="editFigures.population.mortality.population"
              />
            </div>
            <div class="one-third">
              <label> Speficied Time period </label>
              <v-select
                v-model="editFigures.population.mortality.period"
                :items="allSelections.period"
              />
              <v-text-field
                v-if="editFigures.population.mortality.period == 'other'"
                v-model="editFigures.population.mortality.period"
              />
            </div>
          </v-flex>
          <v-flex xs6>
            <div class="one-third">
              <label> MORBIDITY Rate </label>
              <v-text-field
                v-model="editFigures.population.morbidity.rate"
                type="number"
              />
            </div>
            <div class="one-third">
              <label> Population at risk </label>
              <v-select
                v-model="editFigures.population.morbidity.population"
                :items="allSelections.population"
              />
              <v-text-field
                v-if="editFigures.population.morbidity.population == 'other'"
                v-model="editFigures.population.morbidity.population"
              />
            </div>
            <div class="one-third">
              <label> Speficied Time period </label>
              <v-select
                v-model="editFigures.population.morbidity.period"
                :items="allSelections.period"
              />
              <v-text-field
                v-if="editFigures.population.morbidity.period == 'other'"
                v-model="editFigures.population.morbidity.period"
              />
            </div>
          </v-flex>
          <hr class="row-divider" />
          <v-flex xs8>
            <v-select
              v-model="editFigures.statistics.collection"
              :items="allSelections.collectionMeans"
              label="Collection"
            />
            <v-select
              v-model="editFigures.statistics.source"
              :items="allSelections.sources"
              label="Source"
            />
            <v-text-field
              v-if="editFigures.statistics.source == 'other'"
              v-model="editFigures.statistics.source"
            />
          </v-flex>
        </v-layout>
        <v-layout v-else row wrap>
          <v-flex v-if="displayKeyFigures" ref="key-figures" xs12>
            <v-flex
              v-for="(item, index) in displayKeyFigures.figures"
              ref="key-figures"
              :key="index"
              xs4
            >
              <div class="specified-primary">
                {{ item.value }}
              </div>
              <div class="sub-category-text ml-2">
                <div class="category-text">
                  {{ item.category }}
                </div>
                {{ item.subCategory }}
              </div>
            </v-flex>
          </v-flex>
          <div v-else class="full-width">
            <div ref="key-figures" class="one-half">
              <label>Key Figures</label>
              --
            </div>
          </div>
          <hr class="row-divider" />
          <v-flex xs12>
            <div ref="total-beneficiaries" class="one-half">
              <label>NUMBER OF BENEFICIARIES </label>
              {{ totalBeneficiaries }}
            </div>
            <div class="one-half">
              <label>NUMBER OF SERVICES PROVIDED </label>
              {{ totalServices }}
            </div>
          </v-flex>
          <hr class="row-divider" />
          <v-flex v-if="eventFigures" xs12>
            <div class="quarter-width">
              <label>COUNTRY POPULATION</label>
              <span v-if="!eventFigures.population.total">--</span
              >{{ eventFigures.population.total }}
            </div>
            <div class="quarter-width">
              <label>IMPACTED POPULATION</label>
              <span v-if="!eventFigures.population.impacted">--</span
              >{{ eventFigures.population.impacted }}
            </div>
            <div class="quarter-width">
              <label>MORTALITY</label>
              <span v-if="!eventFigures.population.mortality.rate">--</span
              >{{ eventFigures.population.mortality.rate }}
            </div>
            <div class="quarter-width">
              <label>MORBIDITY</label>
              <span v-if="!eventFigures.population.morbidity.rate">--</span
              >{{ eventFigures.population.morbidity.rate }}
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

import { EDIT_EVENT_FIGURES } from '@/store/actions.type';
import { UPDATE_EVENT_FIGURES } from '@/store/mutations.type';

import {
  DEFAULT_EVENT_FIGURES,
  DEFAULT_KEY_FIGURES
} from '@/common/form-fields';
import {
  KEY_FIGURES,
  FIGURES_COLLECTION,
  FIGURES_SOURCES,
  POPULATION_RANGES,
  RISK_PERIOD
} from '@/common/keyFigures-fields';
import KeyFigures from '@/components/RowEntries/KeyFigures.vue';

export default {
  name: 'REventFigures',
  components: {
    KeyFigures
  },
  filters: {},
  props: {
    reviewFields: {
      type: Array
    }
  },
  data() {
    return {
      editing: false,
      editMode: {
        offset: -1
      },
      _beforeEditingCache: {},
      editFigures: DEFAULT_EVENT_FIGURES,
      defaultFigures: DEFAULT_EVENT_FIGURES,
      allSelections: {
        keyFigs: KEY_FIGURES,
        collectionMeans: FIGURES_COLLECTION,
        sources: FIGURES_SOURCES,
        population: POPULATION_RANGES,
        period: RISK_PERIOD
      }
    };
  },
  watch: {
    editing(val) {
      if (val) {
        const tmpObj = this.displayFigures
          ? this.displayFigures
          : this.defaultFigures;
        this.editFigures = this._beforeEditingCache = _.clone(tmpObj);
      } else {
        this.save();
      }

      if (this.reviewFields) {
        if (val) {
          const vm = this;
          setTimeout(function() {
            vm.highlightReview(true);
          }, 500);
        } else {
          this.removeHighlight();
        }
      }
    }
  },
  mounted() {
    if (this.reviewFields) this.highlightReview();
  },
  methods: {
    highlightReview(isEdit) {
      const vm = this;
      this.reviewFields.forEach(function(field) {
        vm.$refs[field].style.background = isEdit
          ? 'rgba(255,255,255, .25)'
          : '#E5F0F9';
      });
    },
    removeHighlight() {
      const vm = this;
      this.reviewFields.forEach(function(field) {
        vm.$refs[field].style.background = 'none';
      });
    },
    switchStatus(keyFigures) {
      this.displayKeyFigures = Object.assign({}, keyFigures);
    },

    save() {
      this.$store.commit(UPDATE_EVENT_FIGURES, this.editFigures);
      this.$store.dispatch(EDIT_EVENT_FIGURES).then(data => {});
      this.editFigures = this._beforeEditingCache = _.clone(
        this.defaultFigures
      );
    },
    cancelEdit() {
      this.displayFigures = _.clone(this._beforeEditItemCache);
      this.editFigures = this._beforeEditingCache = _.clone(
        this.defaultFigures
      );
      this.editing = false;
    }
  },
  computed: {
    ...mapGetters(['eventFigures', 'eventStatus']),

    activeKeyFigures() {
      if (!this.eventFigures) return null;
      const result = this.eventFigures.keyFigures.filter(item => {
        return item.status == this.eventStatus;
      });
      return result[0];
    },
    displayKeyFigures() {
      if (!_.isEmpty(this.activeKeyFigures)) {
        return this.activeKeyFigures;
      }
      return null;
    },
    allowEdit() {
      if (!_.isEmpty(this.displayKeyFigures)) {
        return this.displayKeyFigures.status == this.activeKeyFigures.status;
      }
      return this.eventStatus != 'monitoring' && this.eventStatus != 'complete';
    },
    totalBeneficiaries() {
      if (!this.displayKeyFigures) return;
      return _.sumBy(this.displayKeyFigures.figures, 'value'); // / TODO: parseInt first on the values;
    },
    totalServices() {
      if (!this.displayKeyFigures) return;
      return this.displayKeyFigures.figures.length;
    }
  }
};
</script>
<style lang="scss">
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
</style>
