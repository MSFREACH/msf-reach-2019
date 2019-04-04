<template>
  <v-layout row wrap>
    <v-data-iterator
      :items="keyFigures"
      content-tag="v-layout"
      row
      wrap
      hide-actions
    >
      <template slot="item" slot-scope="props">
        <v-hover>
          <v-flex
            v-show="editIndex != props.index"
            :key="props.index"
            slot-scope="{ hover }"
            xs4
          >
            <v-list two-line dense dark class="keyFigures-listWrapper">
              <v-list-tile class="keyFigures-list">
                <v-list-tile-action>
                  {{ props.item.value }}
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title class="category-text"
                    >{{ props.item.category }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="sub-category-text">
                    {{ props.item.subCategory }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action :class="hover ? 'showCrud' : 'hide'">
                  <a @click="editKeyFig(props.item, props.index)"> edit </a>
                  <br />
                  <a @click="deleteKeyFig(props.item)"> delete </a>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-hover>
        <v-flex
          v-show="editIndex == props.index"
          :key="props.index"
          xs4
          class="keyFigures-Input"
        >
          <v-flex xs3>
            <v-text-field
              v-model="editItem.value"
              class="inverse"
              label="value"
            />
          </v-flex>
          <v-flex xs8 class="selection-wrapper">
            <v-select v-model="editItem.category" :items="allKeyFigures" dark />
            <v-text-field
              v-if="editItem.category && !allKeyFigSubSelection"
              v-model="editItem.subCategory"
              label="Specify"
            />
            <v-select
              v-else
              v-model="editItem.subCategory"
              :items="allKeyFigSubSelection"
              dark
            />
          </v-flex>
          <v-flex xs1 class="action-wrapper">
            <a @click="confirmKeyFig(props.index)"> confirm </a>
            <a @click="cancelEditKeyFig(props.index)"> cancel </a>
          </v-flex>
        </v-flex>
      </template>
      <template slot="no-data">
        <a class="form-actions text-xs-left mt-3" @click="addKeyFig()">
          add Key Figures
        </a>
      </template>
    </v-data-iterator>
    <v-flex xs12>
      <a
        v-if="keyFigures.length > 0 && editIndex == -1"
        class="form-actions mt-3"
        @click="addKeyFig()"
      >
        add Key Figures</a
      >
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash';

import { DEFAULT_KEY_FIGURES } from '@/common/form-fields';
import { KEY_FIGURES } from '@/common/keyFigures-fields';
import { UPDATE_KEY_FIGURES } from '@/store/mutations.type';

export default {
  name: 'KeyFigures',
  props: {
    activeKeyFigures: {
      type: Array
    }
  },
  data() {
    return {
      keyFigures: [],
      editIndex: -1,
      _beforeEditItemCache: DEFAULT_KEY_FIGURES,
      defaultItem: DEFAULT_KEY_FIGURES,
      editItem: DEFAULT_KEY_FIGURES,
      allKeyFigures: KEY_FIGURES
    };
  },
  computed: {
    allKeyFigSubSelection() {
      var selectedCategory = this.editItem.category;
      var results = this.allKeyFigures.filter(item => {
        if (item.value == selectedCategory) {
          return item;
        }
      });

      if (results[0]) return results[0].options;
    }
  },
  watch: {
    activeKeyFigures(val) {
      if (val) this.keyFigures = val;
    }
  },
  mounted() {},
  methods: {
    addKeyFig() {
      var newKeyFig = this.defaultItem;
      this.keyFigures.push(newKeyFig);
      this.editItem = Object.assign({}, newKeyFig);
      this.editIndex = this.keyFigures.length - 1; // the latest one
    },
    editKeyFig(item, index) {
      this._beforeEditItemCache = item;
      this.editItem = Object.assign({}, item);
      this.editIndex = index;
    },
    deleteKeyFig(item) {
      const index = this.keyFigures.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.keyFigures.splice(index, 1);
    },
    confirmKeyFig(index) {
      console.log(' confirm key -------- ', index, this.editItem);
      this.keyFigures[index] = _.clone(this.editItem);
      this.clearEdit();
      this.$store.commit(UPDATE_KEY_FIGURES, { keyFigures: this.keyFigures });
    },
    cancelEditKeyFig(index) {
      this.keyFigures[index] = _.clone(this._beforeEditItemCache);
      this.clearEdit();
    },
    clearEdit() {
      this.editItem = this._beforeEditItemCache = _.clone(this.defaultItem);
      this.editIndex = -1;
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/css/util/colors.scss';

.keyFigures-Input {
  .action-wrapper,
  .selection-wrapper {
    display: block;
  }
  .v-select {
    height: 40px;
    padding: 0;
  }
  .inverse {
    .v-input__control {
      background: #fff;
      .v-label {
        color: $text-light-grey;
      }
    }
  }
}
.keyFigures-listWrapper {
  background: transparent;
}
.keyFigures-list {
  .v-list__tile__action {
    align-items: unset;
  }
  .v-list__tile__content {
    padding-right: 21px;
  }
}
.v-data-iterator {
  width: 100%;
}
</style>
