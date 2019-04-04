<template>
  <v-container class="relatedContent full-text-fields" app>
    <v-layout row wrap>
      <v-navigation-drawer class="mt-5 CD-drawer" width="200">
        <v-list>
          <label class="ml-2">Country</label>
          <v-list-tile class="round-borders selectText">
            <v-select
              v-model="selectedCountry"
              :items="countries"
              item-text="country"
              item-value="country_code"
            />
          </v-list-tile>
          <v-list-tile />
          <v-list-tile class="activeText" @click="selectedView = defaultView">
            General
          </v-list-tile>
          <v-list-group
            v-for="(category, index) in sectionFields"
            :key="index"
            no-action
            append-icon="remove"
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>
                <label>{{ category.text }}</label>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              v-for="(item, i) in documents[category.value]"
              :key="i + 'i'"
            >
              <v-list-tile-title
                v-if="item.type == 'link'"
                class="clickable"
                @click="goTo(item.metadata.url)"
                v-text="item.metadata.operational_center"
              />
              <v-list-tile-title
                v-if="item.type == 'file'"
                class="clickable"
                @click="showFile(item)"
                v-text="item.metadata.name"
              />
            </v-list-tile>
            <v-list-tile-action
              v-for="(type, i2) in category.inputs"
              :key="i2 + 'ii'"
            >
              <a
                class="form-actions"
                @click="openDetailsModal(type, category.value)"
              >{{ inputTypes[type] }}</a>
            </v-list-tile-action>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
      <v-dialog
        v-model="dialog"
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-text>
            <v-layout
              v-if="this.details.type == 'file'"
              row
              wrap
              class="create-wrapper"
            >
              <v-flex xs5 class="label-blocks">
                <label> Description </label>
                <v-text-field v-model="details.metadata.description" />
              </v-flex>
              <v-flex xs5 class="label-blocks">
                <label> Attach file </label>
                <v-card v-if="previewFileUrl" class="file-attachment">
                  <v-icon class="remove-file-icon" @click="removeFile()">
                    close
                  </v-icon>
                  <embed :src="previewFileUrl" width="100%" height="100%">
                </v-card>
                <v-card v-else class="file-attachment" light>
                  <form enctype="multipart/form-data">
                    <input
                      id="fileUpload"
                      ref="mymyUpload"
                      style="display: none"
                      type="file"
                      accept="*/*"
                      multiple
                      @change="onFilePicked"
                    >
                    <v-icon class="file-icon" @click="pickFile">
                      attach_file
                    </v-icon>
                    <v-btn
                      v-if="readyToUpload"
                      label="upload"
                      @click="processFiles"
                    />
                  </form>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout v-else row wrap>
              <v-flex xs6>
                <v-select
                  v-model="details.metadata.operational_center"
                  :items="allOCs"
                  label="Operational Center"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="details.metadata.url"
                  prepend-icon="link"
                  name="url"
                  label="link"
                />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-progress-circular v-if="uploadingFile" :indeterminate="true" />
            <v-btn color="active" @click="submit">
              add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-layout row wrap class="previewContent">
        <v-flex v-if="selectedView == defaultView" xs12>
          <iframe :src="CIAWorldFactbookUrl" style="height:78vh; width:100%" />
        </v-flex>
        <v-layout v-else row wrap>
          <v-flex xs12 class="previewWindow">
            <img v-if="fileType.indexOf('image') != -1" :src="downloadUrl">
            <object
              v-else
              :data="downloadUrl"
              :type="fileType"
              width="100%"
              height="100%"
            >
              <embed :src="downloadUrl" width="100%" height="100%">
            </object>

            <v-btn id="downloadBtn" color="grey" small fab flat outline>
              <a :href="downloadUrl" target="_blank"><v-icon>save_alt</v-icon></a>
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <div class="fileHeader">
              {{ displayFile.metadata.name }}
            </div>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint no-debugger: off */

import $ from 'jquery';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import {
  FETCH_EVENT,
  FETCH_COUNTRY_DETAILS,
  CREATE_COUNTRY_DETAILS,
  EDIT_COUNTRY_DETAILS,
  DELETE_COUNTRY_DETAILS,
  FETCH_UPLOAD_URL,
  PUT_SIGNED_REQUEST,
  FETCH_DOWNLOAD_URL,
  DOWNLOAD_OBJECT,
} from '@/store/actions.type';
import { OPERATIONAL_CENTERS } from '@/common/response-fields';
import {
  DEFAULT_COUNTRY_DETAILS_ROW,
  CD_DEFAULT_VIEW,
  CD_DETAILS_TYPES,
  CD_DETAILS_CATEGORIES,
} from '@/common/country-details-fields';
import ISO2GEC from '@/common/iso2gec_countryCodes.json';

export default {
  name: 'CountryDetails',
  data() {
    return {
      dialog: false,
      allOCs: OPERATIONAL_CENTERS,
      selectedCountry: null,
      sectionFields: CD_DETAILS_CATEGORIES,
      selectedFiles: [],
      selectedView: CD_DEFAULT_VIEW,
      defaultView: CD_DEFAULT_VIEW,
      inputTypes: CD_DETAILS_TYPES,
      admins: [['Management', 'people_outline'], ['Settings', 'settings']],
      documents: {
        map: [],
        strategy: [],
        security: [],
        mission: [],
        toolbox: [],
        document_repo: [],
      },
      iso2gecCodes: ISO2GEC,
      defaultDetails: DEFAULT_COUNTRY_DETAILS_ROW,
      details: DEFAULT_COUNTRY_DETAILS_ROW,
      readyToUpload: false,
      previewFileUrl: null,
      displayFile: {},
      downloadUrl: null,
      fileType: null,
    };
  },
  computed: {
    ...mapGetters(['eventAreas', 'countryDetails', 'uploadingFile']),
    countryCodes() {
      if (!this.eventAreas.length > 0) return;
      const tmp = this.eventAreas.map(item => item.country_code);
      return _.sortedUniq(tmp);
    },
    countries() {
      if (!this.eventAreas.length > 0) return;
      const tmp = this.eventAreas.map(item => ({
        country: item.country,
        country_code: item.country_code,
      }));
      this.selectedCountry = tmp[0].country_code;
      return _.sortedUniq(tmp);
    },
    CIAWorldFactbookUrl() {
      if (!this.eventAreas.length > 0) return;
      const isoCC = this.selectedCountry
        ? this.selectedCountry
        : this.eventAreas[0].country_code;
      const gecCode = this.iso2gecCodes[isoCC].GEC;
      const url = `https://www.cia.gov/library/publications/the-world-factbook/geos/${gecCode.toLowerCase()}.html`;
      return url;
    },
  },
  watch: {
    eventAreas(val) {
      if (!_.isEmpty(val)) this.fetchCountryDetails();
    },
    countryDetails(val) {
      if (val) {
      }
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_EVENT, this.$route.params.slug);
  },
  methods: {
    fetchCountryDetails() {
      this.$store
        .dispatch(FETCH_COUNTRY_DETAILS, { countries: this.countryCodes })
        .then(() => {
          this.sortNavigation();
        });
    },
    sortNavigation() {
      const vm = this;
      this.countryDetails.forEach((item) => {
        vm.documents[item.category].push(item);
      });
    },
    goTo(url) {
      window.open(url, '_blank');
    },
    openDetailsModal(type, category) {
      this.details.type = type;
      this.details.category = category;
      this.dialog = true;
    },
    pickFile() {
      this.$refs.mymyUpload.click();
    },
    onFilePicked(e) {
      const files = (this.selectedFiles = e.target.files);
      const fr = new FileReader();
      fr.readAsDataURL(files[0]);
      fr.addEventListener('load', () => {
        const fileUrl = fr.result;
        this.previewFileUrl = fileUrl;
        this.readyToUpload = true;
      });
    },
    processFiles() {
      const vm = this;
      const files = this.selectedFiles;
      // name, size, type;
      const fileName = files[0].name;
      const fileType = files[0].type;
      const fileSize = files[0].size;
      const file = files[0];
      const params = {
        key: `countryDetails/${this.selectedCountry}/${this.details.category}`,
        filename: fileName,
      };
      this.$store.dispatch(FETCH_UPLOAD_URL, params).then((payload) => {
        if (payload) {
          const fileLink = payload.url;
          vm.details.metadata.name = fileName;
          vm.details.metadata.url = fileLink;
          this.uploadFile(file);
        }
      });
    },
    uploadFile(file) {
      this.$store.dispatch(PUT_SIGNED_REQUEST, file).then((data) => {
        this.save();
      });
    },
    removeFile(index) {
      $('#fileUpload').val('');
      this.previewFileUrl = null;
    },
    submit() {
      if (this.details.type == 'file') {
        this.processFiles();
      } else {
        this.save();
      }
    },
    save() {
      const cIndex = this.countryCodes.indexOf(this.selectedCountry);
      const countryName = this.countries[cIndex].country;

      const params = _.extend(this.details, {
        country: countryName,
        country_code: this.selectedCountry,
      });
      params.metadata = _.pickBy(params.metadata, _.identity);

      this.$store.dispatch(CREATE_COUNTRY_DETAILS, params).then((payload) => {
        setTimeout(() => this.close(), 1000);
      });
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.details = _.cloneDeep(this.defaultDetails);
        this.previewFileUrl = null;
        this.$router.go();
      }, 300);
    },
    showFile(file) {
      this.$store.dispatch(FETCH_DOWNLOAD_URL, file.metadata.url).then((data) => {
        this.displayFile = file;
        this.downloadUrl = data.url;
        this.fileType = data.contentType;
        this.selectedView = 'fileView';
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
#downloadBtn {
  position: absolute;
  right: 2em;
  bottom: 2em;
}
.previewContent {
  padding: 20px;
  width: calc(100% - 200px);
}
.previewWindow {
  height: 70vh;
  overflow: scroll;
}
.selectText {
  .v-select {
    white-space: pre;
    padding-top: 0;
  }
}
</style>
