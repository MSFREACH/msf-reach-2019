<template>
  <v-layout row wrap>
      <v-dialog  v-model="dialog" persistent max-width="880px">
          <v-btn slot="activator" fab small flat :size="40">
              <v-icon> add </v-icon>
          </v-btn>
        <!-- 1. data agreement
        2. personal details / 3. type of contact
        4. contact details / 5. social media
        6. confirmation -->
        <template>
            <v-stepper v-model="e1" class="elevation-0">
              <v-stepper-header flat>
                <v-stepper-step :complete="e1 > 1" step="1">Data consent <small>GDPR</small></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 2" step="2">Personal details <small>Type of contact</small></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 3" step="3">Contact methods <small>Social media</small></v-stepper-step>
                <v-spacer></v-spacer>
                <v-icon class="action-link" @click="close">close</v-icon>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                    <p>The information you provide will be treated as strictly confidential and used in accordance to our <a href="http://msf-seasia.org/node/14721">Privacy Policy</a>. It will be shared to MSF entities and partners (for technical reasons of development of REACH) only.
                    </p>
                    <v-form ref="consent" lazy-validation>
                        <v-layout align-center>
                            <v-checkbox v-model="consent.gdpr" :rules="[v => !!v || 'You must agree to continue!']" required></v-checkbox> I consent that information can be shared with other MSF entities. The information will be used to contact you if there is an emergency near your location of living, to request information for MSF assessment.
                        </v-layout>
                        <v-layout align-center>
                            <v-checkbox v-model="consent.permssion" :rules="[v => !!v || 'You must agree to continue!']" required></v-checkbox>
                            I acknowledge I give permission for my contact details / have permission from contacts I am entering to enter their information. The information may be used to contact the person to request information for MSF assessment.
                        </v-layout>
                        <v-layout align-center>
                            <v-checkbox v-model="consent.private"></v-checkbox>
                            I wish to keep this data private for my use in MSF.
                        </v-layout>

                    </v-form>



                     <p>Please contact <a href="mailto:lucie.gueuning@hongkong.msf.org">lucie.gueuning@hongkong.msf.org</a> for any queries or to remove your contact information from our database.</p>
                  <v-btn class="right" flat @click="e1 = 2"> Continue</v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-container grid-list-md>
                        <v-form ref="personal" lazy-validation>
                            <v-layout row wrap>
                                <v-flex xs2>
                                    <v-select :items="allTitles" v-model="newContact.title" label="Title" required></v-select>
                                    <v-text-field v-if="newContact.title == 'other'" label="specify" v-model="other.title"></v-text-field>
                                </v-flex>
                                <v-flex xs3>
                                    <v-text-field label="First Name" required></v-text-field>
                                </v-flex>
                                <v-flex xs3>
                                    <v-text-field label="Last Name" required></v-text-field>
                                </v-flex>
                                <!-- join into name string  -->
                                <v-flex xs4>
                                    <v-text-field label="Alias" v-model="newContact.otherNames"></v-text-field>
                                </v-flex>
                                <v-divider></v-divider>
                                <label>Meeting notes</label>
                                <v-text-field label="Link to Sharepoint" v-model="newContact.sharepoint"></v-text-field>
                                <v-textarea label="notes" v-model="newContact.notes" outline></v-textarea>

                            </v-layout>
                        </v-form>
                        <v-divider vertical></v-divider>
                        <v-form ref="typeOf" lazy-validation>
                            <v-layout row wrap>
                                <v-flex xs3>
                                    <v-select :items="allContactTypes" v-model="newContact.type" label="Category" item-value="name"></v-select>
                                </v-flex>
                                <v-flex v-if="newContact.type == 'Other'">
                                    <v-text-field label="Specify other type..." v-model="other.type" counter="150"></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-text-field label="Job Title" v-model="newContact.job_title" counter="150"></v-text-field>
                                </v-flex>
                            </v-layout>

                            <v-layout v-if="newContact.type == defaultContact" row wrap>
                                <v-flex xs3>
                                    <v-select :items="allMSFEmploy" v-model="newContact.msf_employment" label="Current employment status"></v-select>
                                </v-flex>
                                <v-flex xs3>
                                    <v-select :items="allOCs" v-model="newContact.OC" label="Operational Centre"></v-select>
                                </v-flex>
                                <v-flex xs6>
                                    <label>Partner sections/Branch office/Mission/Project (if any)</label>
                                    <v-textarea v-model="newContact.msf_additional" outline></v-textarea>
                                </v-flex>


                            </v-layout>
                            <v-layout v-else row wrap>
                                <v-flex xs3>
                                    <v-checkbox label="MSF Association Member" v-model="newContact.msf_associate"></v-checkbox>
                                    <v-checkbox label="Former Staff" v-model="newContact.msf_peer"></v-checkbox>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field label="Organisation/employer name" v-model="newContact.employer" counter="150"></v-text-field>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field label="Divison/unit/office" v-model="newContact.division" counter="150"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-form>
                        <h4>Please indicate the location where you are currently based. Please update it as soon as you move.<span style="color:red;">*</span></h4>
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
                                    <v-text-field label="Mobile" v-model="newContact.cell" max="50" type="number"></v-text-field>
                                    <v-text-field label="Work" v-model="newContact.work" max="50" type="number"></v-text-field>
                                    <v-text-field label="Home" v-model="newContact.home" max="50" type="number"></v-text-field>
                                </v-flex>
                                <v-flex xs6>
                                    <label>Email</label>
                                    <v-text-field label="Primary" v-model="newContact.email" max="50" type="number"></v-text-field>
                                    <v-text-field label="Secondary" v-model="newContact.email2" max="50" type="number"></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-divider></v-divider>
                            <label>Social media</label>
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <v-text-field label="WhatsApp" v-model="newContact.WhatsApp" max="50" type="number"></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field label="Twitter" v-model="newContact.Twitter" max="50" type="text"></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field label="Facebook" v-model="newContact.Facebook" max="50" type="text"></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field label="Telegram" v-model="newContact.Telegram" max="50" type="number"></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field label="Skype" v-model="newContact.Skype" max="50" type="text"></v-text-field>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field label="Instagram" v-model="newContact.Instagram" max="50" type="text"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                    <span class="right">
                        <v-progress-circular v-if="inProgress" :indeterminate="true"></v-progress-circular>
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

import { DEFAULT_CONTACT, CONTACT_TITLES } from '@/common/form-fields';
import { DEFAULT_CONTACT_TYPE, CONTACT_TYPES, CONTACT_MSF_EMPLOY_STATUS, CONTACT_OCS } from '@/common/common';
import { CREATE_CONTACT } from '@/store/actions.type';


export default {
    name: 'new-contact',
    data(){
        return{
            e1: 0,
            dialog: false,
            consent: {
                gdpr: null,
                permission: null,
                isPrivate: null
            },
            newContact: DEFAULT_CONTACT,
            defaultContact: DEFAULT_CONTACT,
            allOCs: CONTACT_OCS,
            allTitles: CONTACT_TITLES,
            allContactTypes: CONTACT_TYPES,
            allMSFEmploy: CONTACT_MSF_EMPLOY_STATUS,
            defaultContact: DEFAULT_CONTACT_TYPE,
            other: {
                title: null,
                type: null
            },
            inProgress: false
        }
    },
    methods:{
        close(){
            this.dialog = false;
        },
        save(){
            var payload = _.clone(this.newContact);
            if (payload.type == 'other') payload.type = other.type;
            if(payload.title =='other')  payload.title = other.title;
            var vm = this;
            this.store.dispatch(CREATE_CONTACT, payload).then(res => {
                setTimeout(() => vm.close(), 1000);
            });
        }
    }
}
</script>

<style lang="css">
</style>
