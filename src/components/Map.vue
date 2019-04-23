<template>
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
    <app-controls></app-controls>
    <app-map-footer></app-map-footer>
  </div>
</template>

<script>
import MapControls from "./MapControls.vue";
import MapFooter from "./MapFooter.vue";
import { Icon } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

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
      mapOptions: {
        zoomSnap: 0.5
      }
    };
  },
  components: {
    LMap,
    LMarker,
    LTileLayer,
    appControls: MapControls,
    appMapFooter: MapFooter
  },
  computed: {
    zoom() {
      return this.$store.getters.zoom;
    },
    mapCenter() {
      return this.$store.getters.latLng;
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.$store.dispatch("setZoom", zoom);
    },
    centerUpdate(center) {
      this.$store.dispatch("setCenterMap", center);
    },
    dragEnd(evt) {
      const latLng = {
        lat: evt.target._latlng.lat,
        lng: evt.target._latlng.lng
      };
      this.$store.dispatch("setLatLng", latLng);
    }
  }
};
</script>
