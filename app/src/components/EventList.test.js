import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import EventList from './EventList.vue';

const localVue = createLocalVue();

localVue.use(VueRouter);
localVue.use(Vuetify);
localVue.use(Vuex);

describe('EventList', () => {
  const stubs = ['router-link'];

  let actions;
  let getters;
  let router;
  let store;

  function subject() {
    return shallowMount(EventList, {
      localVue,
      router,
      store,
      stubs,
    });
  }

  beforeEach(() => {
    router = new VueRouter();

    actions = {
      fetchEvents: jest.fn(),
    };

    getters = {
      events: jest.fn().mockReturnValue([]),
      isLoadingEvent: jest.fn().mockReturnValue(true),
    };

    store = new Vuex.Store({
      actions,
      getters,
    });
  });

  it('loads events when mounted', () => {
    const wrapper = subject();
    expect(actions.fetchEvents).toHaveBeenCalledWith(
      expect.any(Object),
      { filters: {}, status: 'all' },
      undefined,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
