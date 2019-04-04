<template>
  <v-container class="eventSubContent capacity-rows">
    <div class="searchHeader">
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        xs10
      />
      <v-select
        v-model="selectedType"
        :items="allCapacityTypes"
        label="Capacity"
        round
        clearable
      />
      <v-dialog v-model="dialog" max-width="880px">
        <v-btn slot="activator" class="mb-2" small fab flat
          ><v-icon>add</v-icon></v-btn
        >
        <v-card class="create-wrapper">
          <v-flex right>
            <v-icon class="action-link" @click="close">close</v-icon>
          </v-flex>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field v-model="newItem.name" label="Organization" />
                </v-flex>
                <v-flex xs6>
                  <v-select
                    v-model="newItem.type"
                    :items="allCapacityTypes"
                    label="Capacity"
                  />
                </v-flex>
                <v-flex xs6 style="display: inline-block;">
                  <label> Arrival date </label>
                  <v-menu
                    ref="createDateSelected"
                    v-model="createDateSelected"
                    :close-on-content-click="false"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="newItem.arrival_date"
                      persistent-hint
                      type="date"
                    />
                    <v-date-picker
                      v-model="newItem.arrival_date"
                      no-title
                      @input="createDateSelected = false"
                    />
                  </v-menu>
                </v-flex>
                <v-flex xs6 style="display: inline-block;">
                  <label>Deployment</label>
                  <v-textarea
                    v-model="newItem.deployment"
                    flat
                    class="editTextArea"
                    label="description"
                    value=""
                    auto-grow
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="add"> add </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div
      v-if="displayCapacities.length > 0"
      :class="editing ? 'edit-wrapper full-text-fields' : 'full-text-fields'"
    >
      <div class="actions">
        <v-switch v-model="editing" :label="editing ? `save` : `edit`" />
        <span v-if="editing" class="cancel" @click="cancelEdit()"
          ><v-icon>close</v-icon></span
        >
      </div>
      <div class="primary-text">External capacity Analysis</div>
      <v-data-table
        :headers="headers"
        :items="displayCapacities"
        :class="editing ? 'edit-wrapper' : ''"
        :search="search"
        class="extCapacitiesTable"
        item-key="arrivalDate"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <v-hover>
            <tr
              v-show="editMode.offset != props.index"
              :key="props.index"
              slot-scope="{ hover }"
              class="editableRow"
            >
              <td width="25%">
                <span v-if="!props.item.name"> -- </span> {{ props.item.name }}
              </td>
              <td>
                <span v-if="!props.item.type"> -- </span>{{ props.item.type }}
              </td>
              <td>
                <span v-if="!props.item.arrival_date"> -- </span
                >{{ props.item.arrival_date }}
              </td>
              <td width="40%">
                <span v-if="!props.item.deployment"> -- </span
                >{{ props.item.deployment }}
              </td>
              <td>
                <span
                  v-if="editing"
                  :class="hover ? 'showCrud' : 'hide'"
                  class="justify-center layout px-0"
                >
                  <a @click="edit(props.item, props.index)"> edit </a>
                  <a @click="delete props.item"> delete </a>
                </span>
              </td>
            </tr>
          </v-hover>

          <tr
            v-show="editMode.offset == props.index"
            :key="props.index"
            class="editableRow"
          >
            <td><v-text-field v-model="editedItem.name" /></td>
            <td>
              <v-select v-model="editedItem.type" :items="allCapacityTypes" />
            </td>
            <td>
              <v-menu
                ref="editDateSelected"
                v-model="editDateSelected"
                :close-on-content-click="false"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="editedItem.arrival_date"
                  persistent-hint
                  type="date"
                />
                <v-date-picker
                  v-model="editedItem.arrival_date"
                  no-title
                  @input="editDateSelected = false"
                />
              </v-menu>
            </td>
            <td>
              <v-textarea
                v-model="editedItem.deployment"
                solo
                label="description"
                background-color="white"
                color="secondary"
              />
            </td>
            <td>
              <span class="inline-action" @click="localSave">confirm</span>
              <span class="inline-action" @click="clearEdit">cancel</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <v-layout v-else row wrap>
      <div class="no-data-available">
        No external capacities yet
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

// import { EDIT_EVENT } from '@/store/actions.type';
import { DEFAULT_EXT_CAPACITY_HEADERS } from '@/common/common';
import {
  EXTERNAL_CAPACITY_FIELDS,
  EXTERNAL_CAPACITY_TYPES
} from '@/common/form-fields';
import { EDIT_EVENT_EXT_CAPACITY } from '@/store/actions.type';
import {
  ADD_EVENT_EXT_CAPACITY,
  UPDATE_EVENT_EXT_CAPACITY
} from '@/store/mutations.type';
export default {
  name: 'REventExtCapacity',
  components: {
    //TODO: add + edit
  },
  filters: {},
  data() {
    return {
      editing: false,
      _beforeEditingCache: {},
      search: '',
      selectedType: null,
      displayCapacities: [],
      dialog: false,
      allCapacityTypes: EXTERNAL_CAPACITY_TYPES,
      editMode: {
        offset: -1
      },
      createDateSelected: false,
      editDateSelected: false,
      newItem: EXTERNAL_CAPACITY_FIELDS,
      editedItem: EXTERNAL_CAPACITY_FIELDS,
      defaultItem: EXTERNAL_CAPACITY_FIELDS,
      headers: DEFAULT_EXT_CAPACITY_HEADERS
    };
  },
  watch: {
    editing(val) {
      if (val) {
        this._beforeEditingCache = _.clone(this.displayCapacities);
      } else if (!val && this.editMode.offset != -1) {
        confirm('Are you sure you want to continue and discard the changes?') &&
          this.clearEdit();
      } else {
        this.updateCapacity();
      }
    },
    selectedType(val) {
      this.displayCapacities = this.eventExtCapacity.filter(item => {
        if (val) return item.type == val;
        return item;
      });
    }
  },
  mounted() {
    // Not the best place to call this inside mounted
    this.displayCapacities = this.eventExtCapacity.sort(function(a, b) {
      return b.arrival_date - a.arrival_date;
    });
  },
  computed: {
    ...mapGetters(['eventExtCapacity'])
  },
  methods: {
    add(type) {
      this.$store.commit(ADD_EVENT_EXT_CAPACITY, this.newItem);
      this.newItem = _.clone(this.defaultItem);
      this.dialog = false;
      this.updateCapacity();
    },
    edit(item, index) {
      this.editedItem = Object.assign({}, item);
      this.editMode.offset = index;
    },
    cancelEdit() {
      this.displayCapacities = _.clone(this._beforeEditingCache);
      this.editing = false;
      this._beforeEditingCache = null;
    },
    clearEdit() {
      this.editMode.offset = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
    },

    delete(item) {
      const index = this.eventExtCapacity.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.eventExtCapacity.splice(index, 1);
    },
    localSave() {
      var payload = {
        index: this.editMode.offset,
        item: this.editedItem
      };
      this.$store.commit(UPDATE_EVENT_EXT_CAPACITY, payload);
      this.clearEdit();
      this.updateCapacity();
    },
    updateCapacity() {
      this.$store.dispatch(EDIT_EVENT_EXT_CAPACITY).then(data => {
        // TODO:// refresh or reload state
      });
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.newItem = Object.assign({}, this.defaultItem);
      }, 300);
    }
  }
};
</script>
<style lang="scss">
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
tr.editableRow:hover {
  background: rgba(255, 255, 255, 0.25) !important;
}
.extCapacitiesTable {
  table.v-table tbody td {
    padding: 12px;
  }
}
</style>
