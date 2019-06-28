import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import store from '../store/store'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import colors from 'vuetify/es5/util/colors'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuetify)

Vue.use(Vuetify, {
  theme: {
    primary: colors.shades.black,
    secondary: colors.shades.white
  }
})

Vue.http.options.root = 'https://vuejs-couse-http.firebaseio.com/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
