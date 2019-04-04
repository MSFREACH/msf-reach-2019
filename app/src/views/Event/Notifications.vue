<template>
  <v-container class="eventSubContent notification-rows">
    <div class="searchHeader">
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        xs10
      />
      <v-select
        v-model="selectedCategory"
        :items="allNotificationCategories"
        label="Category"
        round
        clearable
      />
      <markdown-panel v-if="showMarkdown && dialog" />
      <v-dialog v-model="dialog" :dark="editIndex != -1" max-width="880px">
        <v-btn slot="activator" class="mb-2" small fab flat>
          <v-icon>add</v-icon>
        </v-btn>
        <v-card :class="editIndex != -1 ? 'editing' : 'create-new'">
          <v-flex right>
            <v-icon @click="close">
              close
            </v-icon>
          </v-flex>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs4>
                  <v-select
                    v-model="editedItem.category"
                    :items="allNotificationCategories"
                    label="category"
                  />
                </v-flex>
                <v-flex xs12 />
                <v-flex xs8>
                  <span
                    v-if="editedItem.category == 'EXPLO_FINDINGS'"
                    class="reminder-notes"
                  >
                    Type of needs, capacities on the ground <br>
                    How many people affected, Call for int'l aid by authorities?
                    <br>
                    MSF proposed intervention <br>
                    type of activities location of activities
                  </span>
                </v-flex>
                <v-flex xs6 style="display: inline-block;">
                  <label>Notification</label>
                  <v-textarea
                    id="descriptionField"
                    ref="descriptionField"
                    v-model="editedItem.description"
                    :solo="editIndex != -1"
                    class="editTextArea"
                    label="description"
                    auto-grow
                    background-color="white"
                    color="secondary"
                  />
                  <!-- :value.prop="editedItem.description" -->
                  <v-flex xs12 sm6 class="py-2">
                    <v-btn-toggle v-model="toggle_format">
                      <v-btn flat>
                        <v-icon value="bold" @click="formatText('bold')">
                          format_bold
                        </v-icon>
                      </v-btn>
                      <v-btn flat>
                        <v-icon value="italic" @click="formatText('italic')">
                          format_italic
                        </v-icon>
                      </v-btn>
                      <v-btn flat>
                        <v-icon value="title" @click="formatText('size')">
                          format_size
                        </v-icon>
                      </v-btn>
                      <!-- <v-btn flat>
                                        <v-icon  @click="formatText('unordered list')" value="unordered_list">format_list_bulleted</v-icon>
                                    </v-btn>
                                    <v-btn flat>
                                        <v-icon  @click="formatText('order list')" value="ordered_list">format_list_numbered</v-icon>
                                    </v-btn> -->
                    </v-btn-toggle>
                  </v-flex>
                </v-flex>
                <v-flex xs6 style="display: inline-block;">
                  <label>PREVIEW</label>
                  <div
                    class="markdown-fields"
                    v-html="mdRender(editedItem.description)"
                  />
                </v-flex>
                <v-btn
                  class="mb-2"
                  color="grey lighten"
                  small
                  flat
                  @click="showMarkdown = !showMarkdown"
                >
                  <v-icon>short_text</v-icon> markdown syntax guide
                </v-btn>

                <hr class="row-divider">
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
                    >
                    <v-icon class="file-icon" @click="pickFile">
                      attach_file
                    </v-icon>
                    <!-- <v-btn v-if="readyToUpload" label="upload" @click="processFiles" ></v-btn> -->
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
                  <embed :src="item" width="100%" height="100%">
                </v-card>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div>
              <label> Operator </label> {{ editedItem.username }} <br>
              <label> Updated </label> {{ editedItem.created | relativeTime }}
            </div>

            <v-spacer />
            <v-progress-circular
              v-if="request.inProgress"
              :size="50"
              color="primary"
              indeterminate
            />
            <v-switch v-if="editIndex != -1" label="save" @click="submit" />
            <v-btn v-else flat @click="submit">
              add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        v-if="showExploFindings"
        class="exploration"
        right
        flat
        @click="addExploFindings"
      >
        add Explo findings
      </v-btn>
    </div>
    <v-layout v-if="displayNotifications.length > 0" row wrap>
      <v-data-table
        :headers="headers"
        :items="displayNotifications"
        :search="search"
        item-key="id"
        class="elevation-1"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr :key="props.index" @click="props.expanded = !props.expanded">
            <td>
              <span v-if="!props.item.username"> -- </span>
              {{ props.item.username }}
            </td>
            <td>{{ props.item.created | relativeTime }}</td>
            <td>
              <span v-if="!props.item.category"> -- </span>
              <span
                v-if="
                  props.item.category && props.item.category == 'EXPLO_FINDINGS'
                "
                class="exploration"
              >
                EXPLORATION findings
              </span>
              <span v-else>
                {{ props.item.category }}
              </span>
            </td>
            <td>
              <span v-if="!props.item.description"> -- </span>{{ props.item.description | snippetNoMarkdown }}
            </td>
            <td>{{ props.item.files.length }}</td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card
            :id="props.index"
            :key="props.index"
            class="expanded-field"
            flat
          >
            <v-card-text v-html="mdRender(props.item.description)" />
            <v-divider light />
            <v-card
              v-for="(item, index) in props.item.signedFiles"
              :key="index"
              class="file-attachment"
              @click="showPreview(index, props.item.signedFiles.length)"
            >
              <img
                v-if="item.contentType.indexOf('image') != -1"
                :src="item.url"
                width="100%"
                height="100%"
              >
              <v-flex
                v-else-if="
                  item.contentType == 'application/msword' ||
                    item.contentType.indexOf('text') != -1
                "
                justify-center
                class="preview-file-icon"
              >
                <a :href="item.url" target="_blank">
                  <v-icon color="grey">{{ allFileIcons[item.contentType] }}
                  </v-icon></a>
              </v-flex>
              <object
                v-else
                :data="item.url"
                :type="item.contentType"
                width="100%"
                height="100%"
              >
                <embed :src="item.url" width="100%" height="100%">
              </object>
            </v-card>
            <v-dialog
              v-model="previewDialog"
              justify-center
              max-width="800px"
              transition="dialog-transition"
            >
              <v-card flat tile>
                <v-window v-model="previewIndex">
                  <v-window-item
                    v-for="(item, n) in props.item.signedFiles"
                    :key="n"
                  >
                    <v-card>
                      <img
                        v-if="item.contentType.indexOf('image') != -1"
                        :src="item.url"
                        width="100%"
                        height="100%"
                        @click="previewDialog = true"
                      >
                      <object
                        v-else
                        :data="item.url"
                        :type="item.contentType"
                        width="100%"
                        height="100%"
                        style="min-height: 80vh;"
                      >
                        <embed :src="item.url" width="100%" height="100%">
                      </object>
                    </v-card>
                  </v-window-item>
                </v-window>
                <v-card-actions
                  v-if="previewLength > 1"
                  class="justify-space-between"
                  color="primary"
                >
                  <v-btn flat @click="prev">
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-item-group
                    v-model="previewIndex"
                    class="text-xs-center"
                    mandatory
                  >
                    <v-item
                      v-for="n in props.item.signedFiles"
                      :key="`btn-${n}`"
                    >
                      <v-btn
                        slot-scope="{ active, toggle }"
                        :input-value="active"
                        icon
                        @click="toggle"
                      >
                        <v-icon>mdi-record</v-icon>
                      </v-btn>
                    </v-item>
                  </v-item-group>
                  <v-btn flat @click="next">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-card-actions class="text-xs-right list-actions">
              <v-switch label="edit" @click="editItem(props.item)" />
              <v-icon small @click="deleteItem(props.item)">
                delete
              </v-icon>
            </v-card-actions>
          </v-card>
        </template>
      </v-data-table>
    </v-layout>
    <v-layout v-else>
      <div class="no-data-available">
        No notifications yet
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import $ from 'jquery';
import marked from 'marked';
import {
  EVENT_NOTIFICATION_CATEGORIES,
  EVENT_NOTIFICATION_HEADERS,
} from '@/common/common';
import {
  FETCH_EVENT_NOTIFICATIONS,
  CREATE_EVENT_NOTIFICATION,
  EDIT_EVENT_NOTIFICATION,
  DELETE_EVENT_NOTIFICATION,
  FETCH_UPLOAD_URL,
  PUT_SIGNED_REQUEST,
  FETCH_DOWNLOAD_URL,
} from '@/store/actions.type';
import { DEFAULT_EVENT_NOTIFICATION_FIELDS } from '@/common/form-fields';
import { REQUEST_NOTIFICATION_STATUSES } from '@/common/network-handler';
// import MarkDownExplain from '@/views/util/MarkdownExplain.vue'
import MarkdownPanel from '@/views/util/MarkdownPanel.vue';
import { UPDATE_EVENTNOTIFICATIONS_SIGNEDURLS } from '@/store/mutations.type';
import { FILE_ICONS } from '@/common/file-preview.js';

export default {
  name: 'REventNotifications',
  components: {
    MarkdownPanel,
  },

  filters: {},
  props: {
    reviewFields: {
      type: Array,
    },
  },
  data() {
    return {
      dialog: false,
      showMarkdown: false,
      previewDialog: false,
      previewIndex: 0,
      previewLength: 0,
      editing: false,
      allNotificationCategories: EVENT_NOTIFICATION_CATEGORIES,
      allFileIcons: FILE_ICONS,
      selectedCategory: '',
      headers: EVENT_NOTIFICATION_HEADERS,
      defaultItem: DEFAULT_EVENT_NOTIFICATION_FIELDS,
      editedItem: DEFAULT_EVENT_NOTIFICATION_FIELDS,
      editIndex: -1,
      search: '',
      readyToUpload: false,
      request: REQUEST_NOTIFICATION_STATUSES,
      previewFileUrls: [],
      signedFileUrls: [],
      files: [],
      toggle_format: null,
      downloadUrls: [],
      signedStatus: {},
    };
  },
  computed: {
    ...mapGetters([
      'currentUser',
      'currentEventId',
      'oldEventNotifications',
      'eventNotifications',
      'bucketUrls',
      'uploadingFile',
    ]),
    showExploFindings() {
      if (this.reviewFields) return this.reviewFields.indexOf('explo-findings') != -1;
    },
    displayNotifications() {
      const vm = this;
      return this.eventNotifications.filter((item) => {
        if (vm.selectedCategory) return item.category == vm.selectedCategory;
        return item;
      });
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        if (!this.editedItem.updated) {
          this.editedItem.updated = new Date();
        }
      } else {
        this.close();
      }
    },
    eventNotifications(val) {
      const vm = this;
      val.map((item, index) => {
        const signedUrls = [];
        item.files.forEach((file) => {
          vm.$store.dispatch(FETCH_DOWNLOAD_URL, file).then((data) => {
            signedUrls.push(data);
            item.signedFiles = signedUrls;
          });
        });
        vm.$store.commit(UPDATE_EVENTNOTIFICATIONS_SIGNEDURLS, {
          index,
          signedUrls,
        });
      });
    },
  },
  mounted() {
    this.fetchEventNotifications();
  },
  methods: {
    addExploFindings() {
      this.dialog = true;
      this.editedItem.category = 'EXPLO_FINDINGS';
    },
    removeFile(index) {
      $('#fileUpload').val('');
      this.previewFileUrls.splice(index, 1);
    },
    fetchEventNotifications() {
      this.$store.dispatch(FETCH_EVENT_NOTIFICATIONS, {
        eventId: parseInt(this.currentEventId),
      });
    },
    mdRender(value) {
      if (value) return marked(value);
    },
    editItem(item) {
      this.dialog = true;
      this.editIndex = _.findIndex(this.eventNotifications, item);
      this.editedItem = Object.assign({}, item);
      this.previewFileUrls = item.signedFiles.map(item => item.url);
      this.signedFileUrls = _.clone(this.previewFileUrls);
    },
    deleteItem(item) {
      const itemIndex = _.findIndex(this.eventNotifications, item);
      this.$store.dispatch(DELETE_EVENT_NOTIFICATION, parseInt(item.id));
      this.eventNotifications.splice(itemIndex, 1);
    },
    pickFile() {
      this.$refs.myUpload.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      for (let f = 0; f < files.length; f++) {
        const fr = new FileReader();
        fr.readAsDataURL(files[f]);
        fr.addEventListener('load', () => {
          const fileUrl = fr.result;
          this.previewFileUrls.push(fileUrl);
        });
      }
    },
    processFiles(files) {
      const vm = this;
      Object.keys(files).forEach((key) => {
        const file = files[key];
        const fileName = file.name;
        const params = {
          key: `event/${vm.currentEventId}/notifications`,
          filename: fileName,
        };
        vm.$store.dispatch(FETCH_UPLOAD_URL, params).then((payload) => {
          if (payload) {
            const fileLink = payload.url;
            vm.signedFileUrls.push(fileLink);
            vm.uploadFile(file, key);
          }
        });
      });
    },
    uploadFile(file, index) {
      this.$store.dispatch(PUT_SIGNED_REQUEST, file).then((data) => {
        if (index == this.signedFileUrls.length - 1) this.save();
      });
    },
    submit() {
      this.request.inProgress = true;
      const files = this.$refs.myUpload.files;
      if (files.length > 0) {
        this.processFiles(files);
      } else {
        this.save();
      }
    },
    save() {
      const timeNow = new Date();
      const isEdit = this.editIndex > -1 && this.editedItem.id;
      const action = isEdit ? EDIT_EVENT_NOTIFICATION : CREATE_EVENT_NOTIFICATION;

      const params = _.extend(this.editedItem, {
        username: this.currentUser.username,
      });
      params.files = this.signedFileUrls;

      if (isEdit) {
        params.updated = timeNow;
        delete params.created;
        delete params.eventid;
        delete params.signedFiles;
      } else {
        params.eventId = parseInt(this.currentEventId);
        params.created = timeNow;
        delete params.updated;
      }

      this.$store.dispatch(action, params).then((payload) => {
        if (payload.status == 200) {
          this.close();
        }
      });
    },
    close() {
      this.fetchEventNotifications();
      this.dialog = false;
      this.showMarkdown = false;
      this.request.inProgress = false;
      setTimeout(() => {
        this.editedItem = _.clone(this.defaultItem);
        this.previewFileUrls = [];
        this.signedFileUrls = [];
        this.editIndex = -1;
      }, 300);
    },
    formatText(type) {
      const cursorStart = getCursorPosStart();
      const cursorEnd = getCursorPosEnd();
      const v = this.editedItem.description;
      const txtBefore = v.substring(0, cursorStart);
      let txtCenter = v.substring(cursorStart, cursorEnd);
      if (txtCenter.length == 0) {
        txtCenter = type;
      }
      const txtAfter = v.substring(cursorEnd, v.length);
      let combine;
      switch (type) {
        case 'bold':
          combine = `${txtBefore} **${txtCenter}** ${txtAfter}`;
          break;
        case 'italic':
          combine = `${txtBefore} *${txtCenter}* ${txtAfter}`;
          break;
        case 'size':
          combine = `${txtBefore} \n\r# ${txtCenter}\n\r${txtAfter}`;
          break;
        default:
          combine = v;
          break;
      }

      this.editedItem.description = combine;
    },
    showPreview(index, length) {
      this.previewDialog = true;
      this.previewIndex = index;
      this.previewLength = length;
    },
    next() {
      this.previewIndex = this.previewIndex + 1 === this.previewLength
        ? 0
        : this.previewIndex + 1;
    },
    prev() {
      this.previewIndex = this.previewIndex - 1 < 0
        ? this.previewLength - 1
        : this.previewIndex - 1;
    },
  },
};

function getCursorPosStart() {
  return $('#descriptionField')[0].selectionStart;
}
function getCursorPosEnd() {
  return $('#descriptionField')[0].selectionEnd;
}
</script>
<style lang="scss">
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
.v-carousel,
.v-carousel__item {
  height: inherit !important;
}
.reminder-notes {
  color: $text-light-grey;
  font-style: italic;
  margin-bottom: 21px;
}
.theme--dark {
  .reminder-notes {
    color: #fff;
  }
}

.preview-file-icon {
  height: 100%;
  align-items: center;
}
.file-attachment {
  vertical-align: top;
}
</style>
