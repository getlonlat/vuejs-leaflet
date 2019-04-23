<template>
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
</template>

<script>
export default {
  methods: {
    dropMarker() {
      this.$store.dispatch("setLatLng", this.$store.getters.center);
    },
    toggleSearchAddress() {
      this.$store.dispatch("toggleSearchAddress");
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
          this.$swal.fire({
            title: "Ops...",
            text: error.message,
            type: "error"
          });
        }
      );
    }
  }
};
</script>
