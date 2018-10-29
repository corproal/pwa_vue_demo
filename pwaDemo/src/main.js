import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import axios from 'axios'

import global from './components/Global.vue'

Vue.config.productionTip = false
Vue.prototype.Global = global
Vue.prototype.$axios = axios
//axios.defaults.withCredentials=true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
