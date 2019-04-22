import Vue from "vue";
import App from "./App.vue";
import Clipboard from "v-clipboard";
import Toasted from "vue-toasted";
import VueSweetalert2 from "vue-sweetalert2";

import { store } from "./store";

Vue.config.productionTip = false;

Vue.use(Clipboard);
Vue.use(Toasted, {
  position: "top-center",
  duration: 3000,
  singleton: true
});
Vue.use(VueSweetalert2);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
