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
  latLng: { lat: -8, lng: -55 },
  addresses: [],
  showSearchAddress: false
};

const getters = {
  zoom: state => {
    return state.zoom;
  },
  address: state => {
    return state.address;
  },
  latLng: state => {
    return state.latLng;
  },
  showSearchAddress: state => {
    return state.showSearchAddress;
  },
  addressHistory: state => {
    return state.addresses;
  }
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
  TOGGLE_SEARCH_ADDRESS(state) {
    state.showSearchAddress = !state.showSearchAddress;
  },
  ADD_SEARCH_TO_HISTORY(state, result) {
    state.addresses.push(result);
  },
  DELETE_FROM_HISTORY(state, address) {
    state.addresses = state.addresses.filter(addrezz => {
      return addrezz.place_id != address.place_id;
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
