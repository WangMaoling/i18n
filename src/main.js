// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import router from './router'
import ElementUI from 'element-ui'
import Vue from 'vue'
import App from './App'
import i18n from './i18n/i18n';

Vue.use(ElementUI);
// 全局调用 添加分组方法
window.eventBus = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
