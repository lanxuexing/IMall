// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import { currency } from './utils/currency'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'

Vue.config.productionTip = false
// 图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '../static/loading-svg/error.png',
  loading: '../static/loading-svg/loading-bars.svg',
  attempt: 1
})
// 分页
Vue.use(infiniteScroll)
// 格式化金额管道
Vue.filter('currency', currency);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
