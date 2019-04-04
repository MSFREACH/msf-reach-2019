<template>
    <v-layout row app class="listContainer">
        <v-card v-if="isLoadingContact" class="event-preview">
              Loading contacts...
        </v-card>

        <v-layout justify-space-between row wrap>
            <v-flex xs3 class="contactListPanel">
                <v-toolbar class="listHeader" slot="header" flat>
                    <div class="full-width">
                        <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
                        <new-contact></new-contact>
                    </div>
                    <v-divider></v-divider>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-btn-toggle v-model="isOrganization">
                                <v-btn flat value="false">Individual</v-btn>
                                <v-btn flat value="true">Organisation</v-btn>
                            </v-btn-toggle>
                        </v-flex>
                        <v-flex xs6>
                            <v-select v-model="filterType" :items="allTypes" label="Type" round clearable></v-select>
                        </v-flex>
                    </v-layout>
                </v-toolbar>
                <v-flex v-for="(letterGroup, i) in alphabeticalClusters" :key="'letter-'+i" v-if="letterGroup.children.length > 0">
                  <v-subheader>
                    <v-flex xs2 left> {{letterGroup.label.toUpperCase()}}</v-flex> <v-divider></v-divider>
                  </v-subheader>
                  <v-data-iterator
                    content-tag="v-layout"
                    :items="letterGroup.children"
                    :search="search"
                    no-data-text="No contacts found"
                    hide-actions
                    row wrap>

                    <v-list class="result-list" slot="item" slot-scope="props">
                      <v-list-tile :key="props.item.id" avatar ripple avatar @click="select(props.item)">
                        <v-list-tile-content>
                          {{props.item.properties.properties.name}} <i> {{props.item.properties.properties.type}} </i>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-icon color="grey lighten-1">bookmark</v-icon>
                          <v-icon color="grey lighten-1">share</v-icon>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-data-iterator>
                </v-flex>

            </v-flex>
            <v-flex xs9 text-xs-center>
                <v-scroll-y-transition mode="out-in">
                    <div v-if="!selected" class="title grey--text">
                        Select Contact
                    </div>
                    <v-card v-else :key="selected.id" class="pt-4 mx-auto" flat max-widtd="400">
                        <h3>{{selected.properties.properties.name}}</h3>
                        <v-card-text v-if="selected.properties.properties.type == defaultType">
                            {{selected.properties.properties.OC}}
                            {{selected.properties.properties.employment}}
                            {{selected.properties.properties.additional}}
                            {{selected.properties.properties.job_title}}
                        </v-card-text>
                        <v-card-text else>
                            <v-chip label v-show="selected.properties.properties.msf_associate">MSF Associate </v-chip>
                            <v-chip label v-show="selected.properties.properties.msf_peer"> MSF Peer </v-chip>
                            {{selected.properties.properties.employer}}
                            {{selected.properties.properties.job_title}}
                            {{selected.properties.properties.division}}
                        </v-card-text>

                        <v-divider></v-divider>
                        <v-layout tag="v-card-text" text-xs-left wrap d-flex>
                            <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2 v-show="selected.properties.properties.cell">Mobile:</v-flex>
                            <v-flex>{{ selected.properties.properties.cell }}</v-flex>
                            <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2 v-show="selected.properties.properties.work">Work:</v-flex>
                            <v-flex>
                                {{ selected.properties.properties.work }}
                            </v-flex>
                            <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2 v-show="selected.properties.properties.home">Home:</v-flex>
                            <v-flex>{{ selected.properties.properties.home }}</v-flex>
                            <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2><v-icon>mail</v-icon></v-flex>
                            <v-flex>
                                <div> {{ selected.properties.properties.email }} </div>
                                <div v-show="selected.properties.properties.email2"> {{ selected.properties.properties.email2 }} </div>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex>
                                <span class="mdi mdi-whatsapp" v-if="checkEqual( selected.properties.properties.cell, selected.properties.properties.WhatsApp)"></span>
                                <span class="mdi mdi-whatsapp" v-else> {{selected.properties.properties.WhatsApp }} </span>
                            </v-flex>
                            <v-flex>
                                    <span class="mdi mdi-telegram" v-if="checkEqual( selected.properties.properties.cell, selected.properties.properties.Telegram)"> </span>
                                    <span class="mdi mdi-telegram" v-else> {{ selected.properties.properties.Telegram }}  </span>
                            </v-flex>
                            <v-flex v-show="selected.properties.properties.skype">
                                <span class="mdi mdi-skype"></span>
                                <span> {{ selected.properties.properties.skype }} </span>
                            </v-flex>
                            <v-flex v-show="selected.properties.properties.Instagram">
                                <span class="mdi mdi-instagram"></span>
                                <span> {{ selected.properties.properties.Instagram }} </span>
                            </v-flex>

                        </v-layout>
                        <v-flex xs12 v-show="selected.properties.properties.address">
                            <v-icon>location_on</v-icon>
                            <span> {{ selected.properties.properties.address }} </span>
                        </v-flex>
                    </v-card>
                </v-scroll-y-transition>
            </v-flex>
        </v-layout>
    </v-layout>
</template>
<script>
/*eslint no-debugger: off*/
/*eslint no-console: off*/
/*eslint no-unused-vars: off*/
import { mapGetters } from 'vuex';
import { FETCH_CONTACTS } from '@/store/actions.type';
import { DEFAULT_CONTACT_TYPE, CONTACT_TYPES} from '@/common/common';
import NewContact from '@/views/New/NewContact.vue';

export default {
    name: 'ContactList',
    props: {
        private: { // This is My contacts
            type: Boolean,
            required: false
        },
        assigned: { // This is Assigned to me
            type: Boolean,
            required: false
        }
    },
    data(){
        return {
            search: '',
            active: [],
            open: [],
            expanded: {},
            selected: null,
            defaultType: DEFAULT_CONTACT_TYPE,
            allTypes: CONTACT_TYPES,
            filterType: '',
            isOrganization: false,
            displayContacts: []
        };
    },
    components:{
        NewContact
    },
    computed: {
        ...mapGetters([
            'contactsCount',
            'isLoadingContact',
            'contacts'
        ]),
        alphabeticalClusters(){
          var charCode,
              i = 0;
          var alphabets = [];
          for(charCode = 65; charCode < 91; charCode++){
            var letter = String.fromCharCode(charCode).toLowerCase();
            alphabets.push(letter);
          }

          const sortedChildren = alphabets.map(letter => ({
            label: letter,
            children: this.getSameInitials(letter)
          }));

          var others = this.contacts.filter(contact => {
              return (alphabets.indexOf(contact.properties.properties.name.charAt(0).toLowerCase()) == -1);
          });

          var orderedInitials = _.clone(sortedChildren);

          orderedInitials.push({
            label: '#',
            children: this.getOtherInitial(others)
          });

          return orderedInitials;

        }
        // ,
        // selected () {
        //     if (!this.active.length) return undefined;
        //     const id = this.active[0];
        //     return this.contacts.find(contact => contact.properties.id === id);
        // }
    },
    watch:{
        contacts(val){
            val.forEach( i => {
                this.$set(this.expanded, i.properties.id, false);
            });

            this.displayContacts = _.sortBy(this.contacts, ['properties.properties.name']);
        }
    },
    mounted() {
        this.fetchContacts();
    },
    methods: {
        fetchContacts(){
            this.$store.dispatch(FETCH_CONTACTS);
        },
        checkEqual(one, two){
            return one.replace(/[^0-9]/ig, '') == two.replace(/[^0-9]/ig, '');
        },
        filterByType(contact){
            console.log('CONTACT LIST --- ', contact);
            return contact.properties.properties.type == this.filterType;
        },
        select(contact){
          this.selected = contact;
        },
        getName (name) {
            return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
        },
        getSameInitials(letter){
          const contacts = [];
          for (const contact of this.contacts) {
              if (contact.properties.properties.name.charAt(0).toLowerCase() !== letter) continue
              contacts.push({
              ...contact,
              id: contact.properties.id,
              name: this.getName(contact.properties.properties.name)
              })
          }

          return contacts.sort((a, b) => {
              return a.properties.properties.name > b.properties.properties.name ? 1 : -1
          })
        },
        getOtherInitial(others){
          const contacts = [];
          for (const contact of others){
            contacts.push({
              ...contact,
              name: this.getName(contact.properties.properties.name)
            })
          }
          return contacts.sort((a, b) => {
              return a.properties.properties.name > b.properties.properties.name ? 1 : -1
          })
        }

    }

};
</script>

<style lang="scss">
@import '@/assets/css/lists.scss';
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
.count{
    color: #ccc;
    font-size: 10px;
}
.contactListPanel{
    background: $bg-milk-grey;
    height: calc(100vh - 64px);
    overflow: scroll;
    display: block;
}
.theme--light.v-btn-toggle{
    background: none;
}
.listContainer{
    top: 64px;
    position: relative;
    max-width: unset;
}
</style>
