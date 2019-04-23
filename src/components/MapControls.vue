<template>
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
        <div class="control">
          <label class="label">Latitude, Longitude</label>
          <div class="field has-addons">
            <div class="control is-expanded">
              <label>
                <input
                  type="text"
                  class="input"
                  placeholder="Latitude, Longitude"
                  :value="latLng"
                />
              </label>
            </div>
            <div class="control">
              <button
                class="button is-light"
                v-clipboard="() => latLng"
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
</template>

<script>
var geohash = require("ngeohash");

export default {
  computed: {
    markerPosition() {
      return this.$store.getters.latLng;
    },
    latLng() {
      return this.markerPosition.lat + "," + this.markerPosition.lng;
    },
    address() {
      return this.$store.getters.address;
    },
    precision() {
      return this.$store.getters.precision;
    },
    hash() {
      return geohash.encode(
        this.markerPosition.lat,
        this.markerPosition.lng,
        this.precision
      );
    }
  },
  methods: {
    clipboardSuccessHandler() {
      this.$toasted.show("Copied to clipboard.");
    }
  }
};
</script>
