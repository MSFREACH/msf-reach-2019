<template>
  <v-layout row wrap>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="880px"
      class="newContactWrapper"
    >
      <v-btn slot="activator" :size="40" fab small flat dark>
        <v-icon> add </v-icon>
      </v-btn>
      <!-- 1. data agreement
        2. personal details / 3. type of contact
        4. contact details / 5. social media
        6. confirmation -->
      <template>
        <v-stepper v-model="e1" class="elevation-0">
          <v-stepper-header flat>
            <v-stepper-step :complete="e1 > 1" step="1">
              Data consent
              <small>GDPR</small>
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="e1 > 2" step="2"
              >Personal details <small>Type of contact</small></v-stepper-step
            >
            <v-divider />
            <v-stepper-step :complete="e1 > 3" step="3"
              >Contact methods <small>Social media</small></v-stepper-step
            >
            <v-spacer />
            <v-icon class="action-link" @click="close">close</v-icon>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <p>
                The information you provide will be treated as strictly
                confidential and used in accordance to our
                <a href="http://msf-seasia.org/node/14721">Privacy Policy</a>.
                It will be shared to MSF entities and partners (for technical
                reasons of development of REACH) only.
              </p>
              <v-form ref="consent" lazy-validation>
                <v-layout align-center>
                  <v-checkbox
                    v-model="consent.gdpr"
                    :rules="[v => !!v || 'You must agree to continue!']"
                    required
                  />
                  I consent that information can be shared with other MSF
                  entities. The information will be used to contact you if there
                  is an emergency near your location of living, to request
                  information for MSF assessment.
                </v-layout>
                <v-layout align-center>
                  <v-checkbox
                    v-model="consent.permssion"
                    :rules="[v => !!v || 'You must agree to continue!']"
                    required
                  />
                  I acknowledge I give permission for my contact details / have
                  permission from contacts I am entering to enter their
                  information. The information may be used to contact the person
                  to request information for MSF assessment.
                </v-layout>
                <v-layout align-center>
                  <v-checkbox v-model="consent.private" />
                  I wish to keep this data private for my use in MSF.
                </v-layout>
              </v-form>
              <p>
                Please contact
                <a href="mailto:lucie.gueuning@hongkong.msf.org"
                  >lucie.gueuning@hongkong.msf.org</a
                >
                for any queries or to remove your contact information from our
                database.
              </p>
              <v-btn class="right" flat @click="e1 = 2"> Continue</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-container grid-list-md>
                <v-form ref="personal" lazy-validation>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-layout row wrap>
                        <v-flex xs4>
                          <v-select
                            v-model="newContact.title"
                            :items="allTitles"
                            label="Title"
                            required
                          />
                          <v-text-field
                            v-if="newContact.title == 'other'"
                            v-model="other.title"
                            label="specify"
                          />
                        </v-flex>
                        <v-flex xs8>
                          <v-text-field
                            v-model="newContact.otherNames"
                            label="Alias"
                          />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex xs6>
                          <v-text-field label="First Name" required />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field label="Last Name" required />
                        </v-flex>
                      </v-layout>
                      <!-- join into name string  -->
                    </v-flex>
                    <v-flex xs6>
                      <label>Meeting notes</label>
                      <v-textarea
                        v-model="newContact.notes"
                        label="notes"
                        box
                      />
                      <v-text-field
                        v-model="newContact.sharepoint"
                        label="Link to Sharepoint"
                      />
                    </v-flex>
                  </v-layout>
                </v-form>
                <v-divider vertical />
                <v-form ref="typeOf" lazy-validation>
                  <v-layout row wrap>
                    <v-flex xs3>
                      <v-select
                        v-model="newContact.type"
                        :items="allContactTypes"
                        label="Category"
                        item-value="name"
                      />
                    </v-flex>
                    <v-flex v-if="newContact.type == 'Other'">
                      <v-text-field
                        v-model="other.type"
                        label="Specify other type..."
                        counter="150"
                      />
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        v-model="newContact.job_title"
                        label="Job Title"
                        counter="150"
                      />
                    </v-flex>
                  </v-layout>

                  <v-layout v-if="newContact.type == defaultContact" row wrap>
                    <v-flex xs3>
                      <v-select
                        v-model="newContact.msf_employment"
                        :items="allMSFEmploy"
                        label="Current employment status"
                      />
                    </v-flex>
                    <v-flex xs3>
                      <v-select
                        v-model="newContact.OC"
                        :items="allOCs"
                        label="Operational Centre"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <label
                        >Partner sections/Branch office/Mission/Project (if
                        any)</label
                      >
                      <v-textarea v-model="newContact.msf_additional" outline />
                    </v-flex>
                  </v-layout>
                  <v-layout v-else row wrap>
                    <v-flex xs3>
                      <v-checkbox
                        v-model="newContact.msf_associate"
                        label="MSF Association Member"
                      />
                      <v-checkbox
                        v-model="newContact.msf_peer"
                        label="Former Staff"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="newContact.employer"
                        label="Organisation/employer name"
                        counter="150"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="newContact.division"
                        label="Divison/unit/office"
                        counter="150"
                      />
                    </v-flex>
                  </v-layout>
                </v-form>
                <h4>
                  Please indicate the location where you are currently based.
                  Please update it as soon as you move.<span style="color:red;"
                    >*</span
                  >
                </h4>
                <!-- <map-input></map-input> -->
              </v-container>

              <v-btn class="right" flat @click="e1 = 3"> Continue</v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-container grid-list-md>
                <v-form ref="contactFields">
                  <v-layout row wrap>
                    <v-flex xs6>
                      <label>Phone number</label>
                      <v-text-field
                        v-model="newContact.cell"
                        label="Mobile"
                        max="50"
                        type="number"
                      />
                      <v-text-field
                        v-model="newContact.work"
                        label="Work"
                        max="50"
                        type="number"
                      />
                      <v-text-field
                        v-model="newContact.home"
                        label="Home"
                        max="50"
                        type="number"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <label>Email</label>
                      <v-text-field
                        v-model="newContact.email"
                        label="Primary"
                        max="50"
                        type="number"
                      />
                      <v-text-field
                        v-model="newContact.email2"
                        label="Secondary"
                        max="50"
                        type="number"
                      />
                    </v-flex>
                  </v-layout>
                  <v-divider />
                  <label>Social media</label>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-text-field
                        v-model="newContact.WhatsApp"
                        label="WhatsApp"
                        max="50"
                        type="number"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        v-model="newContact.Twitter"
                        label="Twitter"
                        max="50"
                        type="text"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        v-model="newContact.Facebook"
                        label="Facebook"
                        max="50"
                        type="text"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        v-model="newContact.Telegram"
                        label="Telegram"
                        max="50"
                        type="number"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        v-model="newContact.Skype"
                        label="Skype"
                        max="50"
                        type="text"
                      />
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        v-model="newContact.Instagram"
                        label="Instagram"
                        max="50"
                        type="text"
                      />
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
              <span class="right">
                <v-progress-circular v-if="inProgress" :indeterminate="true" />
                <v-btn round flat @click.native="save">Create</v-btn>
              </span>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
    </v-dialog>
  </v-layout>
</template>

<script>
import _ from 'lodash';

import { DEFAULT_CONTACT, CONTACT_TITLES } from '@/common/form-fields';
import {
  DEFAULT_CONTACT_TYPE,
  CONTACT_TYPES,
  CONTACT_MSF_EMPLOY_STATUS,
  CONTACT_OCS
} from '@/common/common';
import { CREATE_CONTACT } from '@/store/actions.type';

export default {
  name: 'NewContact',
  data() {
    return {
      e1: 0,
      dialog: false,
      consent: {
        gdpr: null,
        permission: null,
        isPrivate: null
      },
      newContact: DEFAULT_CONTACT,
      allOCs: CONTACT_OCS,
      allTitles: CONTACT_TITLES,
      allContactTypes: CONTACT_TYPES,
      allMSFEmploy: CONTACT_MSF_EMPLOY_STATUS,
      defaultContact: DEFAULT_CONTACT,
      defaultContact: DEFAULT_CONTACT_TYPE,
      other: {
        title: null,
        type: null
      },
      inProgress: false
    };
  },
  methods: {
    close() {
      this.dialog = false;
    },
    save() {
      var payload = _.clone(this.newContact);
      if (payload.type == 'other') payload.type = other.type;
      if (payload.title == 'other') payload.title = other.title;
      var vm = this;
      this.store.dispatch(CREATE_CONTACT, payload).then(() => {
        setTimeout(() => vm.close(), 1000);
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/css/form.scss';
.newContactWrapper {
  .v-text-field .v-input__control .v-input__slot:before {
    border-style: solid;
  }
}
</style>
