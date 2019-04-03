import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  // mode: 'history', // Required for Adal library
  routes: [
    {
      path: '/',
      redirect: '/events'
    },
    {
      name: 'cognito-login',
      path: '/cognito-login',
      component: () => import('@/views/Login'),
      children: [
        {
          path: '',
          name: 'about',
          component: () => import('@/views/About')
        }
      ]
    },
    {
      name: 'map-main',
      path: '/map/:eventId?',
      props: true,
      component: () => import('@/components/MapMain.vue')
    },
    {
      name: 'events',
      path: '/events',
      component: () => import('@/components/EventList'), // TODO: need to merge eventsMeta & action here.
      props: true,
      children: [
        {
          name: 'event',
          path: ':slug',
          component: () => import('@/components/Event'),
          props: true,
          children: [
            {
              path: '',
              name: 'event-general',
              component: () => import('@/views/Event/General'),
              props: true
            },
            {
              path: 'notifications',
              name: 'event-notifications',
              component: () => import('@/views/Event/Notifications'),
              props: true
            },
            , {
                name: 'newsfeed',
                path: ':slug/newsfeed',
                component: () => import('@/components/NewsFeed'),
                props: true,
                children:[{
                    path: 'twitter',
                    name: 'event-twitter',
                    component: () => import('@/views/NewsFeed/Twitter')
                }, {
                    path: 'rss',
                    name: 'event-rss',
                    component: () => import('@/views/NewsFeed/RssFeed')
                }, {
                    path: 'relatedReports',
                    name: 'event-related-reports',
                    component: () => import('@/views/NewsFeed/RelatedReports')
                },
                ]
            },
            {
              path: 'responses',
              name: 'event-responses',
              component: () => import('@/views/Event/Responses'),
              props: true
            },
            {
              path: 'extCapacity',
              name: 'event-extCapacity',
              component: () => import('@/views/Event/ExtCapacity'),
              props: true
            },
            {
              path: 'figures',
              name: 'event-figures',
              component: () => import('@/views/Event/Figures'),
              props: true
            },
            {
              path: 'resources',
              name: 'event-resources',
              component: () => import('@/views/Event/Resources'),
              props: true
            },
            {
              path: 'sitrep',
              name: 'event-sitrep',
              component: () => import('@/views/Event/SITREP'),
              props: true
            }
        ]
    },{
        name: 'event-edit',
        path: '/editor/:slug?',
        component: () => import('@/views/EventEdit'),
        props: true
    },{
        name: 'contacts',
        path: '/contacts',
        component: () => import('@/components/ContactList'),
        props: true
    },{
        name: 'reports',
        path: '/reports',
        component: () => import('@/components/Placeholder'),
        props: true
    },{
        name: 'placeholder',
        path: '/placeholder',
        component: () => import('@/components/Placeholder'),
        props: true
    }]
});
