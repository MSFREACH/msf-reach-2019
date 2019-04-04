<template>
  <v-container class="eventSubContent SITREP-Container">
    <div class="searchHeader">
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
        xs10
      />
      <markdown-panel v-if="showMarkdown && dialog" />
      <v-dialog v-model="dialog" :dark="editIndex != -1" max-width="880px">
        <v-btn slot="activator" class="mb-2" small fab flat
          ><v-icon>add</v-icon></v-btn
        >
        <v-card :class="editIndex != -1 ? 'editing' : 'create-new'">
          <v-flex right>
            <v-icon class="action-link" @click="close">close</v-icon>
          </v-flex>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6 style="display: inline-block;">
                  <label>SITREP</label>
                  <v-textarea
                    v-model="editedSitrep.description"
                    class="editTextArea"
                    auto-grow
                    label="Description"
                    flat
                    color="secondary"
                    background-color="white"
                  />
                </v-flex>
                <v-flex xs6 style="display: inline-block;">
                  <label>PREVIEW</label>
                  <div
                    class="markdown-fields"
                    v-html="mdRender(editedSitrep.description)"
                  />
                </v-flex>
                <v-btn
                  class="mb-2"
                  color="grey lighten"
                  small
                  flat
                  @click="showMarkdown = !showMarkdown"
                  ><v-icon>short_text</v-icon> markdown syntax guide</v-btn
                >

                <hr class="row-divider" />
                <v-card class="file-attachment" light>
                  <form enctype="multipart/form-data">
                    <input
                      id="fileUpload"
                      ref="myUpload"
                      style="display: none"
                      type="file"
                      accept="*/*"
                      multiple
                      @change="onFilePicked"
                    />
                    <v-icon class="file-icon" @click="pickFile">
                      attach_file
                    </v-icon>
                  </form>
                </v-card>
                <v-card
                  v-for="(item, index) in previewFileUrls"
                  :key="index"
                  class="file-attachment"
                >
                  <v-icon class="remove-file-icon" @click="removeFile(index)">
                    close
                  </v-icon>
                  <object :data="item" width="100%" height="100%">
                    <embed :src="item" width="100%" height="100%" />
                  </object>
                </v-card>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div v-if="editedSitrep.created">
              <label> Operator </label> {{ editedSitrep.username }} <br />
              <label> Updated </label> {{ editedSitrep.created | relativeTime }}
            </div>

            <v-spacer />
            <v-progress-circular
              v-if="request.inProgress"
              :size="50"
              color="primary"
              indeterminate
            />
            <v-switch v-if="editIndex != -1" label="save" @click="submit" />
            <v-btn v-else flat dark color="grey lighten-1" @click="submit"
              >add</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-layout
      v-if="displaySITREPs.length > 0"
      class="full-text-fields sitrep-rows"
    >
      <v-date-picker
        v-model="date1"
        :events="arrayEvents"
        :allowed-dates="allowedDates"
        no-title
        event-color="editing"
        width="150px !important"
      />

      <v-expansion-panel expand focusable>
        <v-expansion-panel-content v-for="(item, i) in displaySITREPs" :key="i">
          <v-layout slot="header" row wrap>
            <v-flex xs3 class="calendar-date">{{
              item.created | dayMonth
            }}</v-flex>
            <v-flex xs6
              ><span v-if="!item.description"> -- </span
              >{{ item.description | snippetNoMarkdown }}</v-flex
            >
            <v-flex xs3
              ><span class="file-attachment count">{{
                item.files.length
              }}</span></v-flex
            >
          </v-layout>
          <v-layout class="innerText" row wrap>
            <v-flex class="pa-3" xs12 v-html="mdRender(item.description)" />
            <v-divider />
            <v-flex xs10>
              <v-card
                v-for="(file, index) in item.signedFiles"
                :key="index"
                class="file-attachment"
                @click="previewDialog = true"
              >
                <img
                  v-if="file.contentType.indexOf('image') != -1"
                  :src="file.url"
                  width="100%"
                  height="100%"
                />
                <object
                  v-else
                  :data="file.url"
                  :type="file.contentType"
                  width="100%"
                  height="100%"
                >
                  <embed :src="file.url" width="100%" height="100%" />
                </object>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card-actions class="text-xs-right list-actions">
                <v-switch label="edit" @click="editSitrep(item)" />
                <v-icon small @click="deleteSitrep(item)"> delete </v-icon>
              </v-card-actions>
            </v-flex>

            <v-dialog
              v-model="previewDialog"
              justify-center
              max-width="800px"
              transition="dialog-transition"
            >
              <v-carousel hide-controls>
                <v-carousel-item
                  v-for="(item, i) in item.signedFiles"
                  :key="i"
                  :src="item.url"
                />
              </v-carousel>
            </v-dialog>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-layout>
    <v-layout v-else>
      <div class="no-data-available">
        No SITREP available
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import $ from 'jquery';
import _ from 'lodash';
import marked from 'marked';

import {
  FETCH_SITREPS,
  CREATE_SITREP,
  EDIT_SITREP,
  DELETE_SITREP,
  FETCH_UPLOAD_URL,
  PUT_SIGNED_REQUEST,
  FETCH_DOWNLOAD_URL
} from '@/store/actions.type';
import { UPDATE_SITREP_SIGNEDURLS } from '@/store/mutations.type';
import { DEFAULT_SITREP_FIELDS } from '@/common/form-fields';
import { REQUEST_SITREP_STATUSES } from '@/common/network-handler';
import MarkdownPanel from '@/views/util/MarkdownPanel.vue';

export default {
  name: 'REventSitrep',
  components: {
    MarkdownPanel
  },
  filters: {},
  data() {
    return {
      dialog: false,
      previewDialog: false,
      showMarkdown: false,
      editing: false,
      defaultSitrep: DEFAULT_SITREP_FIELDS,
      editedSitrep: DEFAULT_SITREP_FIELDS,
      editIndex: -1,
      previewFileUrls: [],
      signedFileUrls: [],
      date1: new Date().toISOString().substr(0, 10),
      arrayEvents: null,
      search: '',
      request: REQUEST_SITREP_STATUSES
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        if (!this.editedSitrep.updated) {
          this.editedSitrep.updated = new Date();
        }
      } else {
        this.close();
      }
    },
    sitreps(val) {
      var vm = this;
      val.map((item, index) => {
        var signedUrls = [];
        item.files.forEach(function(file) {
          vm.$store.dispatch(FETCH_DOWNLOAD_URL, file).then(data => {
            signedUrls.push(data);
            item.signedFiles = signedUrls;
          });
        });
        vm.$store.commit(UPDATE_SITREP_SIGNEDURLS, { index, signedUrls });
      });

      this.arrayEvents = this.sitreps.map(item => {
        return item.created.substr(0, 10);
      });

      this.allowedDates();
    }
  },
  mounted() {
    this.fetchSitreps();
  },
  methods: {
    removeFile(index) {
      $('#fileUpload').val('');
      this.previewFileUrls.splice(index, 1);
    },
    fetchSitreps() {
      this.$store.dispatch(FETCH_SITREPS, {
        eventId: parseInt(this.currentEventId)
      });
    },
    mdRender(value) {
      if (value) return marked(value);
    },
    editSitrep(item) {
      this.dialog = true;
      this.editIndex = _.findIndex(this.sitreps, item);
      this.editedSitrep = _.clone(item);
      this.previewFileUrls = item.signedFiles.map(item => {
        return item.url;
      });
    },
    deleteSitrep(item) {
      const itemIndex = _.findIndex(this.sitreps, item);
      this.$store.dispatch(DELETE_SITREP, parseInt(item.id));
      this.sitreps.splice(itemIndex, 1);
    },
    pickFile() {
      this.$refs.myUpload.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      for (var f = 0; f < files.length; f++) {
        const fr = new FileReader();
        fr.readAsDataURL(files[f]);
        fr.addEventListener('load', () => {
          var fileUrl = fr.result;
          this.previewFileUrls.push(fileUrl);
        });
      }
    },
    processFiles(files) {
      var vm = this;
      Object.keys(files).forEach(function(key) {
        var file = files[key];
        var fileName = file.name;
        var params = {
          key: 'event/' + vm.currentEventId + '/sitreps',
          filename: fileName
        };
        vm.$store.dispatch(FETCH_UPLOAD_URL, params).then(payload => {
          if (payload) {
            var fileLink = payload.url;
            vm.signedFileUrls.push(fileLink);
            vm.uploadFile(file, key);
          }
        });
      });
    },
    uploadFile(file, index) {
      this.$store.dispatch(PUT_SIGNED_REQUEST, file).then(data => {
        if (index == this.signedFileUrls.length - 1) this.save();
      });
    },
    submit() {
      var files = this.$refs.myUpload.files;
      this.request.inProgress = true;
      if (files.length > 0) {
        this.processFiles(files);
      } else {
        this.save();
      }
    },
    save() {
      var timeNow = new Date();
      var isEdit = this.editIndex > -1 && this.editedSitrep.id;
      var action = isEdit ? EDIT_SITREP : CREATE_SITREP;
      var params = _.extend(this.editedSitrep, {
        username: this.currentUser.username
      });
      params.files = this.signedFileUrls;

      if (isEdit) {
        params.updated = timeNow;
        delete params.created;
        delete params.eventid;
        delete params.signedFiles;
      } else {
        params.created = timeNow;
        params.eventId = this.currentEventId;
        delete params.updated;
      }

      this.$store.dispatch(action, params).then(payload => {
        if (payload.status == 200) {
          this.close();
        }
      });
    },
    close() {
      this.fetchSitreps();
      this.dialog = false;
      this.showMarkdown = false;
      this.request.inProgress = false;
      setTimeout(() => {
        this.editedSitrep = _.clone(this.defaultSitrep);
        this.previewFileUrls = [];
        this.signedFileUrls = [];
        this.editIndex = -1;
      }, 300);
    },
    allowedDates(val) {
      if (this.arrayEvents && this.arrayEvents.indexOf(val) !== -1) {
        return val;
      }
    }
  },
  computed: {
    ...mapGetters([
      'oldEventReflection',
      'currentUser',
      'currentEventId',
      'sitreps',
      'fetchSitrepError'
    ]),
    formTitle() {
      return this.editIndex == -1 ? 'Create new' : 'Edit SITREP';
    },
    displaySITREPs() {
      return this.sitreps;
    }
  }
};
</script>
<style lang="scss">
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
.SITREP-Container {
  .v-picker--date {
    .v-picker__body {
      width: 150px;
    }
  }
  .md-sheet {
    width: 25%;
  }
}
.v-date-picker-header .v-btn {
  display: none;
}

.v-date-picker-table--date .v-btn {
  height: 20px;
  width: 20px;
}
.sitrep-iterator {
  margin-left: 4em;
}

.innerText {
  background: $bg-space-grey;
}
</style>
