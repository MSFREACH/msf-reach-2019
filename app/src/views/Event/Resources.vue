<template>
    <v-container class="eventSubContent statusToggle">
        <nav v-if="displayResource.perStatus && displayResource.perStatus.length> 0" class="statusTabWrapper">
            <v-btn flat small :class="item.status.toLowerCase()+'-wrapper statusTabs'" v-for="(item, index) in eventResources.perStatus" :key="index" @click="switchStatus(item)">{{item.status}}</v-btn>
        </nav>
        <div :class="editing ? 'edit-wrapper full-text-fields':'full-text-fields'" dark>
            <div v-if="displayResource">
                    <v-layout row wrap class="actions" v-if="allowEdit">
                        <v-switch :label="editing ? `save` : `edit`" v-model="editing"></v-switch>
                        <span class="cancel" v-if="editing" @click="cancelEdit()"><v-icon>close</v-icon></span>
                    </v-layout>

                    <v-layout row wrap v-if="editing" dark>
                        <v-flex xs8 ref="staff-list">
                            <v-text-field label="Staff List" v-model="editStatusResource.staff.listFileUrl"></v-text-field>
                        </v-flex>
                        <v-flex xs4></v-flex>
                        <v-flex xs3 ref="expatriates">
                            <v-text-field class="no-border" label="Number of Expatriate" v-model="editStatusResource.staff.expatriateCount"></v-text-field>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs3 ref="national-staff">
                            <v-text-field class="no-border" label="Number of National Staff" v-model="editStatusResource.staff.nationalStaffCount"></v-text-field>
                        </v-flex>
                        <v-flex xs4></v-flex>
                        <hr class="row-divider"/>
                        <div ref="visa-requirements">
                            <div class="primary-text">Nationalities that requires Visa</div>
                            <v-autocomplete class="autocomplete-fields" v-model="editResources.visa_requirement" :disabled="autoNationality.isUpdating" :items="allSelections.countries" box chips cache-items color="blue-grey lighten-2" label="Nationalities"
                            item-text="nationality" item-value="nationality" multiple>
                                <template slot="selection" slot-scope="data">
                                    <v-chip :selected="data.selected" close class="chip--select-multi" @input="removeNationality(data.item)">
                                        {{ data.item.nationality }}
                                    </v-chip>
                                </template>
                            </v-autocomplete>
                        </div>

                        <hr class="row-divider"/>
                        <div ref="vaccination-requirements">
                            <div class="primary-text">Health and vaccination requirements</div>
                            <!-- <v-text-field label="Required" v-model="editResources.vaccination_requirement.required"></v-text-field> -->
                            <v-autocomplete  class="autocomplete-fields" v-model="editResources.vaccination_requirement.required"
                                :disabled="autoVaccinationRequired.isUpdating"
                                :items="allSelections.vaccinations.required"
                                box cache-items label="Required" multiple>
                                <template slot="selection" slot-scope="data">
                                    <v-chip :selected="data.selected" close @input="removeVaccinRequired(data.item)">
                                        {{ data.item.text }}
                                    </v-chip>
                                </template>
                            </v-autocomplete>

                            <!-- <v-text-field label="Recommended" v-model="editResources.vaccination_requirement.recommended"></v-text-field> -->
                            <v-autocomplete class="autocomplete-fields" v-model="editResources.vaccination_requirement.recommended"
                                :disabled="autoVaccinationRecommended.isUpdating"
                                :items="allSelections.vaccinations.recommended"
                                box cache-items label="Recommended" multiple>
                                <template slot="selection" slot-scope="data">
                                    <v-chip :selected="data.selected" close @input="removeVaccinRequired(data.item)">
                                        {{ data.item.text }}
                                    </v-chip>
                                </template>
                            </v-autocomplete>
                        </div>
                        <hr class="row-divider"/>
                        <div class="one-half">
                            <v-text-field ref="total-budget" label="Total Budget" type="number" v-model="editStatusResource.budget.total"></v-text-field>
                            <v-select :items="allSelections.currencies" v-model="editStatusResource.budget.currency" item-text="currency" item-value="currency">
                            </v-select>
                        </div>
                        <div class="one-half">
                            <label> Supply Chain Specificities </label>
                            <v-flex d-flex>
                                <v-select :items="allSupplyChains" v-model="editStatusResource.supply_chain.type"></v-select>
                            </v-flex>
                            <v-textarea solo label="description" v-model="editStatusResource.supply_chain.description" background-color="white" color="secondary"></v-textarea>
                        </div>
                        <v-flex xs12>
                            <label> Institutional Donors </label>
                            <v-text-field ref="institutional-donors" label="From who" v-model="editResources.institutional_donors[0].amount"></v-text-field>
                            <v-text-field ref="institutional-donors" label="Amount" v-model="editResources.institutional_donors[0].from_who"></v-text-field>
                        </v-flex>

                    </v-layout>
                    <v-layout row wrap v-else>
                        <div class="full-width" :class="displayStatusResources.status+'Wrapper'">
                            <div class="full-width">
                                <div class="one-half" ref="staff-list">
                                    <label>Staff List</label>
                                    <span v-if="!displayStatusResources.staff.listFileUrl">--</span> {{displayStatusResources.staff.listFileUrl}}
                                </div>
                                <v-spacer></v-spacer>
                                <div class="one-half" ref="expatriates">
                                    <label>Number of Expatriate</label>
                                    <span v-if="!displayStatusResources.staff.expatriateCount">--</span> {{displayStatusResources.staff.expatriateCount}}
                                </div>
                                <div class="one-half" ref="national-staff">
                                    <label>Number of National staff</label>
                                    <span v-if="!displayStatusResources.staff.nationalStaffCount">--</span> {{displayStatusResources.staff.nationalStaffCount}}
                                </div>
                            </div>
                            <div class="full-width">
                                <div class="one-half" ref="supply-chain">
                                    <label>SUPPLY CHAIN SPECIFITIES</label>
                                    <span v-if="displayStatusResources.supply_chain">
                                    {{displayStatusResources.supply_chain.type}} -
                                    <span class="notes">  {{displayStatusResources.supply_chain.description}} </span>
                                    </span>
                                    <span v-else> -- </span>
                                </div>
                                <div class="one-half" ref="total-budget">
                                    <label>Total Budget</label>
                                    <span v-if="displayStatusResources.budget.total">
                                        {{displayStatusResources.budget.total.amount}} {{displayStatusResources.budget.currency}} - {{displayStatusResources.budget.total.from_who}}
                                    </span>
                                    <span v-else> -- </span>
                                </div>
                            </div>
                        </div>
                        <hr class="row-divider"/>

                        <div ref="visa-requirements">
                            <div class="primary-text">Nationalities that requires Visa</div>
                            <label>Nationalities</label>
                            <span v-if="displayResource.visa_requirement.length == 0">--</span> {{displayResource.visa_requirement.toString()}}
                        </div>
                        <hr class="row-divider"/>
                        <div ref="vaccination-requirements">
                            <div class="primary-text">Health and vaccination requirements</div>
                            <label>Required</label>
                            <span v-if="displayResource.vaccination_requirement.required.length == 0"> -- </span> {{displayResource.vaccination_requirement.required.toString()}}

                            <label>Recommended</label>
                            <span v-if="displayResource.vaccination_requirement.recommended.length == 0"> -- </span> {{displayResource.vaccination_requirement.recommended.toString()}}

                        </div>
                        <hr class="row-divider"/>
                        <div ref="institutional-donors">
                            <label>Institutional Donors</label>
                            <span v-if="displayResource.institutional_donors.length ==0">--</span>
                            <span v-else v-for="(item, i) in displayResource.institutional_donors" :key="i">{{item.from_who}} : {{item.amount}}</span>
                        </div>
                    </v-layout>
            </div>
            <div v-else>
                No resources recorded yet
            </div>
        </div>
    </v-container>

        <!-- TODO: * Analysis suggestions: contacts -->
    </div>
</template>

<!-- TODO: seee https://vuetifyjs.com/en/components/autocompletes for autocomplete examples -->


<script>
/*eslint no-unused-vars: off*/
/*eslint no-debugger: off*/
import { mapGetters } from 'vuex';
import { EDIT_EVENT_RESOURCES } from '@/store/actions.type';
import { UPDATE_EVENT_RESOURCES } from '@/store/mutations.type';
import COUNTRIES from '@/common/countries.json';
import CURRENCIES from '@/common/currency-symbols.json';
import VACCINATION from '@/common/WHO_vaccinations.json';
import { DEFAULT_RESOURCES_FIELDS, SUPPLY_CHAIN_SPECIALITIES, DEFAULT_STATUS_RESOURCES_FIELDS } from '@/common/resource-fields';

export default {
    name: 'r-event-resources',
    props: {
        reviewFields:{
            type: Array
        }
    },
    data(){
        return {
            editing: false,
            _beforeEditingCache: DEFAULT_RESOURCES_FIELDS,
            _beforeEditPerStatusCache: DEFAULT_STATUS_RESOURCES_FIELDS,
            defaultResources: DEFAULT_RESOURCES_FIELDS,
            editResources: DEFAULT_RESOURCES_FIELDS,
            editStatusResource: DEFAULT_STATUS_RESOURCES_FIELDS,
            defaultStatusResource: DEFAULT_STATUS_RESOURCES_FIELDS,
            activeStatusIndex: 0,
            requiredNationalities: [],
            autoNationality:{
                autoUpdate: true,
                isUpdating: false
            },
            requireVaccinations: [],
            allSupplyChains: SUPPLY_CHAIN_SPECIALITIES,
            autoVaccinationRequired:{
                autoUpdate: true,
                isUpdating: false
            },
            recommendedVaccination: [],
            autoVaccinationRecommended:{
                autoUpdate: true,
                isUpdating: false
            },
            allSelections:{
                countries: COUNTRIES,
                currencies: CURRENCIES,
                vaccinations: VACCINATION
            }
        };
    },
    components: {
        //TODO: add + edit
    },
    mounted(){
        if(this.reviewFields) this.highlightReview();
    },
    methods: {
        highlightReview(isEdit){
            var vm = this;
            this.reviewFields.forEach(function(field){
                vm.$refs[field].style.background = isEdit ? 'rgba(255,255,255, .25)' : '#E5F0F9';
            });
        },
        removeHighlight(){
            var vm = this;
            this.reviewFields.forEach(function(field){
                vm.$refs[field].style.background = "none";
            })
        },
        switchStatus(statusResource){
            this.displayStatusResources = Object.assign({}, statusResource);
        },
        cancelEdit(){
            Object.assign(this.eventResources, this._beforeEditingCache);
            Object.assign(this.displayStatusResources, this._beforeEditPerStatusCache);

            this.editResources = this._beforeEditingCache = _.clone(this.defaultResources);
            this.editStatusResource = this._beforeEditPerStatusCache = _.clone(this.defaultStatusResource);
            this.editing = false;
        },
        save(){
            this.editStatusResource.status = this.eventStatus; 
            this.editResources.perStatus[this.activeStatusIndex] = this.editStatusResource;
            this.$store.commit(UPDATE_EVENT_RESOURCES, this.editResources);
            this.$store.dispatch(EDIT_EVENT_RESOURCES).then((data) =>{
            });

        },
        removeNationality (item) {
            const index = this.editResources.visa_requirement.indexOf(item.nationality);
            if (index >= 0) this.editResources.visa_requirement.splice(index, 1);
        },
        removeVaccinRequired (item) {
            const index = this.editResources.vaccination_requirement.required.indexOf(item.value);
            if (index >= 0) this.editResources.vaccination_requirement.required.splice(index, 1);
        },
        removeVaccinRec (item) {
            const index = this.editResources.vaccination_requirement.recommended.indexOf(item.nationality);
            if (index >= 0) this.editResources.vaccination_requirement.recommended.splice(index, 1);
        }
    },
    watch: {
        editing(val){
            if(val){
                this.editResources = this._beforeEditingCache = _.clone(this.displayResource);
                this.editStatusResource = this._beforeEditPerStatusCache = _.clone(this.displayStatusResources);
            }else{
                this.save();
            }

            if(this.reviewFields){
                var vm = this;
                if(val) {
                    setTimeout(function(){ vm.highlightReview(true)}, 500);
                }else{
                    setTimeout(function(){ vm.removeHighlight()}, 500);
                }
            }
        },
        autoNationality(val){
            if(val.isUpdating){
                setTimeout(() => (this.autoNationality.isUpdating = false), 3000);
            }
        }
    },
    filters: {
    },
    computed: {
        ...mapGetters([
            'eventResources',
            'eventStatus'
        ]),
        displayResource(){
            if(!this.eventResources) return this.defaultResources;
            return _.clone(this.eventResources);
        },
        displayStatusResources(){
            if(!this.eventResources) return this.defaultStatusResource;

            var result = this.eventResources.perStatus.filter(item =>{
                return item.status == this.eventStatus;
            });
            this.activeStatusIndex = this.eventResources.perStatus.indexOf(result[0]);
            return result[0];
        },
        allowEdit(){
            if(!_.isEqual(this.displayStatusResources, this.defaultStatusResource)){
                return this.displayStatusResources.status == this.eventStatus;
            }else{
                return (this.eventStatus != 'monitoring') && (this.eventStatus !='complete');
            }
            return this.eventStatus != 'monitoring';
        }
    }
};

</script>
<style lang="scss">
    @import '@/assets/css/display.scss';
    @import '@/assets/css/edit.scss';
</style>
