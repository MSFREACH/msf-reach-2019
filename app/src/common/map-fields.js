export const MAPBOX_STYLES = {
  thematic: 'mapbox://styles/msfhk/cjroob8dq413f2smtih8x97xb',
  terrain: 'mapbox://styles/msfhk/cjqyk9p1c9r6o2rscym6nt90f',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v11',
  humanitarian: 'mapbox://styles/mapbox/light-v10',
};

export const MAP_FILTERS = [
  {
    name: 'Events',
    id: 'events',
    value: 'events',
    children: [
      { name: 'Monitoring', id: 'events_monitoring', value: 'monitoring' },
      { name: 'Ongoing', id: 'events_ongoing', value: 'ongoing' },
      {
        name: 'Emergency Reponse',
        id: 'events_intervention',
        value: 'intervention',
      },
      { name: 'Exploration', id: 'events_exploration', value: 'exploration' },
      { name: 'Complete', id: 'events_complete', value: 'complete' },
    ],
  },
  {
    name: 'Reports',
    id: 'reports',
    value: 'reports',
    children: [
      { name: 'Access', id: 'reports_access', value: 'access' },
      { name: 'Contacts', id: 'reports_contacts', value: 'contacts' },
      { name: 'Needs', id: 'reports_needs', value: 'needs' },
      { name: 'Security', id: 'reports_security', value: 'security' },
    ],
  },
  {
    name: 'Contacts',
    id: 'contacts',
    value: 'contacts',
    children: [
      { name: 'MSF Staff', id: 'contacts_internal', value: 'internal' },
      { name: 'External', id: 'contacts_external', value: 'external' },
    ],
  },
  // {label: 'RSS Feeds', id:'rssFeeds', value: 'rssFeeds', subItems: [
  //     {label: 'Advisory', id:'advisory', value: 'advisory'},
  //     {label: 'Information', id:'information', value: 'information'},
  //     {label: 'Warning', id:'warning', value: 'warning'},
  //     {label: 'Watch', id:'watch', value: 'watch'}
  // ]}
];

export const MAP_LAYERS_ID = {
  EVENTS: {
    HEATMAP: 'events-heat',
    EPICENTER: 'events-epicenter',
    EPICENTER_ICON: 'events-epicenter-icons',
    CLUSTER_COUNT: 'events-cluster-count',
    UNCLUSTER_POINTS: 'events-unclustered-point',
  },
  REPORTS: {
    ACCESS: 'reports_access',
  },
};
