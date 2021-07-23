import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueRouter from 'vue-router'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import 'assets/js/filter'
import 'assets/stylus/index.styl'
import VueLazyload from 'vue-lazyload'
import * as WPS from 'assets/js/web-office-sdk-v1.1.3.es'
// import Vconsole from 'vconsole'
Vue.prototype.wps = WPS
// import global from 'assets/js/global.js'
// let vConsole = new Vconsole();
// Vue.use(vConsole);
Vue.use(Vant)
Vue.use(VueRouter)
Vue.use(VueLazyload, {
    error: require('@/assets/images/defaultuser.png'),
    loading: require('@/assets/images/defaultuser.png'),
})
// Vue.prototype.global=global
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
