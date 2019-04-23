import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import axios from "axios";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "getlonlat-vue",
  storage: localStorage
});

const state = {
  zoom: 4,
  address: null,
  precision: 6,
  latLng: { lat: -8, lng: -55 },
  addresses: [],
  showSearchAddress: false
};

const getters = {
  zoom: state => state.zoom,
  address: state => state.address,
  latLng: state => state.latLng,
  center: state => state.center,
  showSearchAddress: state => state.showSearchAddress,
  addressHistory: state => state.addresses
};

const mutations = {
  SET_ZOOM(state, zoom) {
    state.zoom = zoom;
  },
  SET_ADDRESS(state, address) {
    state.address = address;
  },
  SET_LATLNG(state, latLng) {
    state.latLng = latLng;
  },
  SET_CENTER_MAP(state, center) {
    state.center = center;
  },
  TOGGLE_SEARCH_ADDRESS(state) {
    state.showSearchAddress = !state.showSearchAddress;
  },
  ADD_SEARCH_TO_HISTORY(state, result) {
    state.addresses.push(result);
  },
  DELETE_FROM_HISTORY(state, address) {
    state.addresses = state.addresses.filter(addrezz => {
      return addrezz.place_id !== address.place_id;
    });
  },
  CLEAR_SEARCH_HISTORY(state) {
    state.addresses = [];
  }
};

const actions = {
  setZoom({ commit }, zoom) {
    commit("SET_ZOOM", zoom);
  },
  setLatLng({ commit }, latLng) {
    commit("SET_LATLNG", latLng);

    const params = {
      lat: latLng.lat,
      lon: latLng.lng,
      format: "json"
    };
    axios
      .get("https://nominatim.openstreetmap.org/reverse", { params })
      .then(result => {
        commit("SET_ADDRESS", result.data.display_name);
      });
  },
  setCenterMap({ commit }, center) {
    commit("SET_CENTER_MAP", center);
  },
  toggleSearchAddress({ commit }) {
    commit("TOGGLE_SEARCH_ADDRESS");
  },
  addToHistory({ commit }, searchResult) {
    commit("ADD_SEARCH_TO_HISTORY", searchResult);
  },
  deleteFromHistory({ commit }, address) {
    commit("DELETE_FROM_HISTORY", address);
  },
  clearHistory({ commit }) {
    commit("CLEAR_SEARCH_HISTORY");
  }
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [vuexPersist.plugin]
});
