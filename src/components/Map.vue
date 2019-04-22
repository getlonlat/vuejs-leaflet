<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class="card">
    <div class="card-image" style="height: 420px">
      <l-map
        ref="lmap"
        :zoom="zoom"
        :center="mapCenter"
        :options="mapOptions"
        style="height: 100%; width: 100%"
        @update:zoom="zoomUpdate"
        @update:center="centerUpdate"
      >
        <l-tile-layer :url="url" :attribution="attribution" />
        <l-marker
          :lat-lng="mapCenter"
          :draggable="true"
          @dragend="dragEnd"
        ></l-marker>
      </l-map>
    </div>

    <div class="card-content">
      <div class="columns">
        <div class="column">
          <div class="control">
            <label class="label">Latitude</label>
            <div class="field has-addons">
              <div class="control">
                <a class="button is-static">Y</a>
              </div>
              <div class="control is-expanded">
                <label>
                  <input
                    type="text"
                    class="input"
                    placeholder="Latitude"
                    :value="markerPosition.lat"
                  />
                </label>
              </div>
              <div class="control">
                <button
                  class="button is-light"
                  v-clipboard="() => markerPosition.lat"
                  v-clipboard:success="clipboardSuccessHandler"
                >
                  <span class="icon">
                    <i class="far fa-copy"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <label class="label">Longitude</label>
          <div class="control">
            <div class="field has-addons">
              <div class="control">
                <a class="button is-static">X</a>
              </div>
              <div class="control is-expanded">
                <label>
                  <input
                    type="text"
                    class="input"
                    placeholder="Longitude"
                    :value="markerPosition.lng"
                  />
                </label>
              </div>
              <div class="control">
                <button
                  class="button is-light"
                  v-clipboard="() => markerPosition.lng"
                  v-clipboard:success="clipboardSuccessHandler"
                >
                  <span class="icon">
                    <i class="far fa-copy"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <label for="hash" class="label">Geohash</label>
          <div class="control">
            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  id="hash"
                  type="text"
                  class="input is-fullwidth"
                  placeholder="Geohash"
                  :value="hash"
                />
              </div>
              <div class="control">
                <button
                  class="button is-light"
                  v-clipboard="() => hash"
                  v-clipboard:success="clipboardSuccessHandler"
                >
                  <span class="icon">
                    <i class="far fa-copy"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field has-addons" v-if="address">
        <div class="control">
          <a class="button is-static">Address</a>
        </div>
        <div class="control is-expanded">
          <input type="text" class="input is-fullwidth" v-model="address" />
        </div>
        <div class="control">
          <button
            class="button is-light"
            v-clipboard="() => address"
            v-clipboard:success="clipboardSuccessHandler"
          >
            <span class="icon">
              <i class="far fa-copy"></i>
            </span>
          </button>
        </div>
      </div>
    </div>

    <footer class="card-footer">
      <a class="card-footer-item" @click="toggleSearchAddress">
        <span class="icon">
          <i class="fas fa-search"></i>
        </span>
        <span class="is-hidden-mobile">SEARCH ADDRESS</span>
      </a>
      <a class="card-footer-item" @click="updatePosition">
        <span class="icon">
          <i class="far fa-compass"></i>
        </span>
        <span>GEOLOCATION</span>
      </a>
      <a class="card-footer-item" @click="dropMarker">
        <span class="icon">
          <i class="fas fa-map-marker-alt"></i>
        </span>
        <span class="is-hidden-mobile">DROP MARKER</span>
      </a>
    </footer>
  </div>
</template>

<script>
import { Icon } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
var geohash = require("ngeohash");

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      center: null,
      currentZoom: 11.5,
      currentCenter: L.latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      }
    };
  },
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  computed: {
    zoom() {
      return this.$store.getters.zoom;
    },
    address() {
      return this.$store.getters.address;
    },
    mapCenter() {
      return this.$store.getters.latLng;
    },
    markerPosition() {
      return this.$store.getters.latLng;
    },
    hash() {
      return geohash.encode(this.markerPosition.lat, this.markerPosition.lng);
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
      this.$store.dispatch("setZoom", zoom);
    },
    centerUpdate(center) {
      this.center = center;
    },
    updatePosition() {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.$store.dispatch("setLatLng", latLng);
          this.$store.dispatch("setZoom", 15);
        },
        error => {
          console.error(error);
          // TODO: handle geolocation errors
        }
      );
    },
    dropMarker() {
      this.$store.dispatch("setLatLng", this.center);
    },
    dragEnd(evt) {
      const latLng = { lat: evt.target._latlng.lat, lng: evt.target._latlng.lng };
      this.$store.dispatch("setLatLng", latLng);
    },
    toggleSearchAddress() {
      this.$store.dispatch("toggleSearchAddress");
    },
    clipboardSuccessHandler() {
      this.$toasted.show("Copied to clipboard.");
    }
  }
};
</script>
