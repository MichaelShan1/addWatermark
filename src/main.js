import Vue from 'vue'
import App from './App.vue'
import router from './router';
// import * as pdfjsLib from "pdfjs-dist";
// import * as pdfjsLib from 'pdfjs-dist'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
