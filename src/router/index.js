import Vue from 'vue'
import Router from 'vue-router'
import I18n from '../i18n/i18n'
Vue.use(Router);
const routes = new Router({
  // mode: 'history', //后端支持可开
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      meta: {
        title: I18n.t('message.pageTitle.login')
      },
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    }
  ]
})
export default routes;
