import Vue from "vue";
import App from "./App.vue";
import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;
console.log(process.env.VUE_APP_SOCKET_URL);

// const url = "http://localhost:3000";
const url = process.env.VUE_APP_SOCKET_URL;

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: url
  })
);

new Vue({
  render: h => h(App)
}).$mount("#app");
