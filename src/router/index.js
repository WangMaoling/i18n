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
      path: '/allpatient',
      component: resolve => require(['../components/common/Home.vue'], resolve)
    },
    {
      meta: {
        title: I18n.t('message.pageTitle.login')
      },
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      meta: {
        title: I18n.t('message.pageTitle.404')
      },
      component: resolve => require(['../components/page/404.vue'], resolve)  // 404
    }
  ]
})
routes.beforeEach((to, from, next) => {
  let hospitalData = localStorage.getItem("hospitalData")
  document.title =  to.meta.title;//设置页面title,这个title是根据页面变化而变化的
  if(!hospitalData||hospitalData==''){
      if(to.path=='/login'){//如果是登录页面路径，就直接next()
          next();
      }else{//不然就跳转到登录
         next('/login');
      }
  }else{
    next();
  }
})

export default routes;
