<template>
    <v-container row app class="listContainer">
        <v-card v-if="isLoadingContact" class="event-preview">
              Loading events...
        </v-card>
        <div class="searchHeader">
            <v-text-field v-model="search" label="Search" single-line hide-details xs10></v-text-field>
            <v-select v-model="filterType" :items="allTypes" label="Type" round clearable></v-select>
        </div>

        <v-layout justify-space-between row wrap>
            <v-flex xs3 class="treeNav">
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
    </v-container>
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
@import '@/assets/css/display.scss';
@import '@/assets/css/edit.scss';
.count{
    color: #ccc;
    font-size: 10px;
}
.treeNav{
    height: calc(100vh - 120px);
    overflow: scroll;
}

.listContainer{
    top: 60px;
    position: relative;
    max-width: unset;
}
</style>
