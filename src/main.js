import Vue from "vue";
import App from "./App.vue";
import router from "./vue-router";
import store from "./store";

import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import theme from "muse-ui/lib/theme";

// theme.use("dark");
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';

Vue.use(MuseUI);
Vue.use(Message);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
