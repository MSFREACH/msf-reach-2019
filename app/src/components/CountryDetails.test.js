import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

import CountryDetails from './CountryDetails.vue';

import ISO2GEC from '@/common/iso2gec_countryCodes.json';

jest.mock('@/common/iso2gec_countryCodes.json', () => ({
  ID: { GEC: 'TEST-ID-GEC' },
  PH: { GEC: 'TEST-PH-GEC' }
}));

const localVue = createLocalVue();

localVue.use(VueRouter);
localVue.use(Vuetify);
localVue.use(Vuex);

describe('CountryDetails', () => {
  const stubs = [];

  let actions;
  let getters;
  let router;
  let store;

  function subject() {
    return shallowMount(CountryDetails, {
      localVue,
      router,
      store,
      stubs
    });
  }

  beforeEach(() => {
    router = new VueRouter();

    actions = {
      fetchEvent: jest.fn()
    };

    getters = {
      eventAreas: jest.fn().mockReturnValue([]),
      countryDetails: jest.fn().mockReturnValue(null),
      uploadingFile: jest.fn().mockReturnValue(false)
    };

    store = new Vuex.Store({
      actions,
      getters
    });
  });

  it('loads event when mounted', () => {
    const wrapper = subject();
    expect(actions.fetchEvent).toHaveBeenCalled();
  });

  it('renders the factbook info for the first country by default', () => {
    getters.eventAreas.mockReturnValue([
      {
        region: 'Metro Manila',
        country: 'Philippines',
        country_code: 'PH'
      }
    ]);
    const wrapper = subject();
    expect(wrapper.find('iframe').element.src).toBe(
      'https://www.cia.gov/library/publications/the-world-factbook/geos/test-ph-gec.html'
    );
  });

  it('renders the factbook info for the selected country', () => {
    getters.eventAreas.mockReturnValue([
      {
        region: 'Metro Manila',
        country: 'Philippines',
        country_code: 'PH'
      },
      {
        region: 'Sulawesi Tengah',
        country: 'Indonesia',
        country_code: 'ID'
      }
    ]);

    const wrapper = subject();

    expect(wrapper.find('iframe').element.src).toBe(
      'https://www.cia.gov/library/publications/the-world-factbook/geos/test-ph-gec.html'
    );

    wrapper.setData({ selectedCountry: 'ID' });

    expect(wrapper.find('iframe').element.src).toBe(
      'https://www.cia.gov/library/publications/the-world-factbook/geos/test-id-gec.html'
    );
  });
});
