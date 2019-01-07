
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//分组 登录信息统一放缓存里面
var hospitalData = JSON.parse(localStorage.getItem("hospitalData"));//拿到从点击列表过来的数据

//masterOrSlaveStore 在登录页面已经 写进去了   登录之后不触发masterOrSlaveStore改变 store存的数据不会变化
// 所以在登陆后触发一下这样就能更新了。

const store = new Vuex.Store({
    state:{
        //测试给一个数据 正用接口的时候在换成'';
        groupData:'',
        masterOrSlaveStore:hospitalData?hospitalData.masterOrSlave:'',//登录医院的类型，主从，或啥都不是
        newNotify:'0',// 新消息数量 变化后主动调用会诊列表接口
        haveAddSlavePermission:hospitalData?hospitalData.haveAddSlavePermission:'0',//后台是够开启添加下级医院功能
    },
    mutations:{
        newGroupData(state,msg){
            state.groupData = msg;
        },
        mewMasterOrSlave(state,msg){
            state.masterOrSlaveStore = msg;
        },
        newNotify(state,msg){
            state.newNotify = msg;
        },
        newHaveAddSlavePermission(state,msg){
            state.haveAddSlavePermission = msg;
        }
    }

})
export default store;
