// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import router from './router'
<<<<<<< HEAD
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
=======
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import '@/assets/css/main.css'
import '@/assets/css/element-variables.scss'
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './vuex/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

import i18n from './i18n/i18n';

//设置为 false 以阻止 vue 在启动时生成生产提示
// Vue.config.productionTip = false
Vue.use(ElementUI,Vuex);
import qs from 'qs';

let axiosIns = axios.create({});
if (process.env.NODE_ENV == 'development') {
    axiosIns.defaults.baseURL = 'http://dev.healthcare-inc.com/feiyue-app/';
} else if (process.env.NODE_ENV == 'debug') {
    axiosIns.defaults.baseURL = '***';
} else if (process.env.NODE_ENV == 'production') {
    let url = window.location.hostname.split('.')[0];
    if(url.indexOf('dev')=='-1'){
        axiosIns.defaults.baseURL = 'https://service.healthcare-inc.com/feiyue-app/';
    }else{
        axiosIns.defaults.baseURL = 'http://dev.healthcare-inc.com/feiyue-app/';
    }
} 
axiosIns.defaults.responseType = 'json';
axiosIns.defaults.transformRequest = [
    function (data) {
        //数据序列化
        return qs.stringify(data);
    }
];
axiosIns.defaults.validateStatus = function (status) {
    return true;
};
axiosIns.defaults.timeout = 5000;
axiosIns.interceptors.request.use(function (config) {
    if(config.url.includes('asthma-app')){
        // config.url.replace(/feiyue-app/, "asthma-app")
        // axiosIns.defaults.baseURL.replace(/feiyue-app/, "asthma-app")  
        // axiosIns.defaults.baseURL.common = 'https://dev.healthcare-inc.com/';
        config.baseURL=config.baseURL.replace(/feiyue-app\//, "");
        config.url=config.url.replace(/feiyue-app/, "asthma-app");
    }
    // alert(axiosIns.defaults.baseURL)
    //配置config
    config.headers.Accept = 'application/json';
    if (process.env.NODE_ENV == 'development'){
        console.log(config.data)
    }
    // console.log(config)
    config.data={params:aes_encrypted(config.data.params)}
    return config;
});
axiosIns.interceptors.response.use(function (response) {
    // alert(response.status)
    let data = response.data;
    let status = response.status;
    if (status === 200) {
        if(response.data.errorCode=='216'){
            localStorage.clear();
            location.reload();
        }
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
}, function (error) {
    // 对响应错误做点什么
    ElementUI.Message({
        type: "error",
        message:'数据请求请求超时，请稍后再试！',
        duration: "2000",
    });
    return Promise.reject(error);
});
Vue.prototype.$axios = axiosIns;
// 全局调用 添加分组方法
window.eventBus = new Vue();

//页面上部进度条
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  next()
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})

// Vue.directive('scroll', {
//     inserted: function (el) {
//         let tr = 1;
//         el.addEventListener('mousewheel',function(e){
//             var direction = e.deltaY>0?'down':'up'
//             console.log(direction)
//             console.log(e)
//             if(direction=='down'){
//                 tr = tr+0.1;
//                 if(tr>=2){
//                     tr=2;
//                 }
//                 el.style.transform = 'scale('+(tr)+')';
//             }
//             if(direction=='up'){
//                 tr = tr-0.1;
//                 if(tr<=1){
//                     tr=1;
//                 }
//                 el.style.transform = 'scale('+(tr)+')';
//             }
            
//         })
//     }
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
>>>>>>> ebfb9de12895124e2ffe0266442dc7963fc1ba36
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
<<<<<<< HEAD
=======
// you can set only in production env show the error-log
if (process.env.NODE_ENV === 'production') {
    Vue.config.errorHandler = function(err, vm, info) {
        Vue.nextTick(() => {
            let addErrorLog = [err, vm, info, window.location.href]
            // console.error(addErrorLog)
        })
    }
}
>>>>>>> ebfb9de12895124e2ffe0266442dc7963fc1ba36
