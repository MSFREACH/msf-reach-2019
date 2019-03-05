<template>
    <v-layout row app xs12 :clipped="$vuetify.breakpoint.mdAndUp">
        <v-card v-if="isLoadingContact" class="event-preview">
              Loading events...
        </v-card>
        <v-container v-else>

            <v-toolbar slot="header" mt0 flat>
                <v-flex xs6 md4 lg3>
                    <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-flex>
                <v-flex xs6 md4 lg3>
                    <v-select v-model="filterType" :items="allTypes" attach chips label="filter by type"></v-select>
                </v-flex>
            </v-toolbar>
            <v-layout justify-space-between pa-3>
                <v-flex xs5>
                    <v-treeview
                        :active.sync="active"
                        :items="items"
                        :load-children="fetchContacts"
                        :open.sync="open"
                        activatable
                        active-class="primary--text"
                        class="grey lighten-5"
                        open-on-click
                        transition
                    >
                        <template v-slot:prepend="{item, active}">
                            <v-icon v-if="!item.children" :color="active? 'primary' : ''"> mdi-account </v-icon>
                        </template>
                        <template v-slot:label="{item}">
                            {{item.name}}
                            <span class="count" v-if="item.children">{{ item.children.length }}</span>
                        </template>
                    </v-treeview>
                </v-flex>
                <v-flex d-flex text-xs-center>
                    <v-scroll-y-transition mode="out-in">
                        <div v-if="!selected" class="title grey--text">
                            Select Contact
                        </div>
                        <v-card v-else :key="selected.id" class="pt-4 mx-auto" flat max-widtd="400">
                            {{selected.properties}}
                        </v-card>
                    </v-scroll-y-transition>
                </v-flex>
            </v-layout>
                        <!-- <v-card>
                            <v-card-text> {{ props.item.properties }} </v-card-text>
                            <v-card-actions>
                                <v-icon>phone</v-icon>
                                <span>Mobile: {{ props.item.properties.properties.cell }} </span>
                                <span>Work: {{ props.item.properties.properties.work }} </span>
                                <span>Home: {{ props.item.properties.properties.home }} </span>
                                <v-btn v-if="props.item.properties.properties.WhatsApp" flat fab small>
                                    <span class="mdi mdi-whatsapp" v-if="checkEqual( props.item.properties.properties.cell, props.item.properties.properties.WhatsApp)"></span>
                                    <span class="mdi mdi-whatsapp" v-else> {{props.item.properties.properties.WhatsApp }} </span>
                                </v-btn>
                                <v-btn v-if="props.item.properties.properties.Telegram" flat fab small>
                                    <span class="mdi mdi-telegram" v-if="checkEqual( props.item.properties.properties.cell, props.item.properties.properties.Telegram)"> </span>
                                    <span class="mdi mdi-telegram" v-else> else {{ props.item.properties.properties.Telegram }}  </span>
                                </v-btn>
                            </v-card-actions>
                            <v-card-text v-if="props.item.properties.properties.type == defaultType">
                                {{props.item.properties.properties.OC}}
                                {{props.item.properties.properties.employment}}
                                {{props.item.properties.properties.additional}}
                                {{props.item.properties.properties.job_title}}
                            </v-card-text>
                            <v-card-text else>
                                <v-chip label v-show="props.item.properties.properties.msf_associate">MSF Associate </v-chip>
                                <v-chip label v-show="props.item.properties.properties.msf_peer"> MSF Peer </v-chip>
                                {{props.item.properties.properties.employer}}
                                {{props.item.properties.properties.job_title}}
                                {{props.item.properties.properties.division}}
                            </v-card-text>
                            <v-card-actions>
                                <v-icon>mail</v-icon>
                                <span> {{ props.item.properties.properties.email }} </span>
                                <span v-show="props.item.properties.properties.email2"> {{ props.item.properties.properties.email2 }} </span>
                            </v-card-actions>
                            <v-card-actions v-show="props.item.properties.properties.skype">
                                <span class="mdi mdi-skype"></span>
                                <span> {{ props.item.properties.properties.skype }} </span>
                            </v-card-actions>
                            <v-card-actions v-show="props.item.properties.properties.Instagram">
                                <span class="mdi mdi-instagram"></span>
                                <span> {{ props.item.properties.properties.Instagram }} </span>
                            </v-card-actions>
                            <v-card-actions v-show="props.item.properties.properties.address">
                                <v-icon>location_on</v-icon>
                                <span> {{ props.item.properties.properties.address }} </span>
                            </v-card-actions>
                        </v-card> -->
                </v-flex>
        </v-container>
    </v-layout>
</template>
<script>
/*eslint no-debugger: off*/
/*eslint no-console: off*/
/*eslint no-unused-vars: off*/
import { mapGetters } from 'vuex';
import { FETCH_CONTACTS } from '@/store/actions.type';
import { DEFAULT_CONTACT_TYPE, CONTACT_TYPES} from '@/common/common';
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
            defaultType: DEFAULT_CONTACT_TYPE,
            allTypes: CONTACT_TYPES,
            filterType: ''
        };
    },
    computed: {
        ...mapGetters([
            'contactsCount',
            'isLoadingContact',
            'contacts'
        ]),
        items () {
            const children = this.allTypes.map(type => ({
                id: type.value,
                name: this.getName(type.text),
                children: this.getChildren(type.text)
            }))
            var tmpTypeLabel = this.allTypes.map(type => {
                return type.text;
            });

            var others = this.contacts.filter(contact => {
                return (tmpTypeLabel.indexOf(contact.properties.properties.type) == -1);
            });

            var orderedList = _.clone(children);
            orderedList.push({
                id: 2,
                name: 'Uncategorized',
                children: this.getOtherChildren(others)
            });

            return orderedList;
        },
        selected () {
            if (!this.active.length) return undefined;
            const id = this.active[0];
            return this.contacts.find(contact => contact.properties.id === id);
        }
    },
    watch:{
        contacts(val){
            val.forEach( i => {
                this.$set(this.expanded, i.properties.id, false);
            });
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
        getChildren (type) {
            const contacts = []

            for (const contact of this.contacts) {
                if (contact.properties.properties.type !== type) continue
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
        getOtherChildren(others){
            const contacts = []

            for (const contact of others) {
                contacts.push({
                ...contact,
                name: this.getName(contact.properties.properties.name)
                })
            }

            return contacts.sort((a, b) => {
                return a.properties.properties.name > b.properties.properties.name ? 1 : -1
            })
        },

        getName (name) {
            return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
        }
    }

};
</script>

<style lang="scss">
@import '@/assets/css/lists.scss';
.count{
    color: #ccc;
    font-size: 10px;
}
</style>
