<template>
    <div class="sidebar">
        <!-- <i class="iconfont icon-tianjia"></i> -->
        <el-menu active-text-color="#DCF3FD" text-color="#565656" background-color="#EFF8FC" :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                      <!--  icon-yiyuanjianjie -->
                        <template slot="title"><i :class="item.icon" class="iconfont" :style="{color:item.color}"></i>{{ item.title }}</template>
                        <div v-if="item.index=='subordinate'">
                          <el-menu-item :class="{'is-active':subItem.slaveHospitalId==nextCurrent}" v-for="(subItem,i) in xiajiSub" :key="i" :index="'subordinateHospital?id='+subItem.slaveHospitalId+'&name='+subItem.groupName">
                              <i class="iconfont icon-yiyuan"></i>{{ subItem.groupName }}
                          </el-menu-item>
                          <div>
                            <!-- <router-link class="group el-menu-item addgroup" to="addSubordinateHospital"><i class="iconfont icon-add" style="color:#08B3E9"></i>添加下级医院</router-link> -->
                            <!-- <span class="group el-menu-item addgroup" @click="addNextGroup">
                              <i class="iconfont icon-add" style="color:#08B3E9"></i>添加下级医院
                            </span> -->
                          </div>
                        </div>
                       
                        <el-menu-item v-else v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            <i class="iconfont" :class="item.icon"></i>
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <div v-if="item.index=='allpatient'">
                        <el-menu-item :index="item.index" id="allpatient">
                            <i class="iconfont icon-quanbu" :style="{color:item.color}"></i>
                            {{ item.title }}
                        </el-menu-item>
                        <div class="fenzuDivShow">
                            <el-menu-item class="group" :class="{'is-active':treeItem.id==current}" :title="treeItem.groupName" v-for="(treeItem,j) in treesubs" :key="j" :index="'allpatient?id='+treeItem.id">
                                <i style="#59A9F2" class="iconfont icon-fenzu"></i>{{treeItem.groupName}}
                                <i class="el-icon-edit" v-if="treeItem.id!='0'&&treeItem.id!='00'" @click.stop="editGroup(treeItem)"></i>
                            </el-menu-item>
                            <div class="group el-menu-item addgroup" @click="addgroup"><i class="iconfont icon-add" style="color:#08B3E9"></i>添加分组</div>   
                        </div>
                    </div>
                    <el-menu-item v-if="item.index!='allpatient'" :index="item.index">
                        <img v-if="item.index=='diagnosis'" :src="item.icon">
                        <i v-if="!item.index!='diagnosis'" class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
                        {{ item.title }}
                        <!-- <el-badge v-if="item.index=='remoteConsultation'" :is-dot="isdot" class="item"> -->
                          <el-badge v-if="item.index=='remoteConsultation'" :value="isdot" class="item"></el-badge>
                        <!-- </el-badge> -->
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
        <el-dialog
            title="编辑分组"
            :visible.sync="dialogVisible"
            width="35%">
                <span>请输入分组名称</span>            
            <div class="el-message-box__input">
                <div class="el-input">
                    <input autocomplete="off" type="text" rows="2" :value="editFenzu.groupName" ref="editfenzu" validateevent="true" class="el-input__inner">
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clickDeleteFenzu" class="fl">删除此分组</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickEditFenzuSure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      isdot:0,//远程会诊红点 默认不显示
      service:true,//是否显示 辅助测试内容
      hospitalData:JSON.parse(localStorage.getItem("hospitalData")),//拿到从点击列表过来的数据
      hospitalId: JSON.parse(localStorage.getItem("hospitalData"))?JSON.parse(localStorage.getItem("hospitalData")).hospitalId:'',
      // 主从医院,1:主,2.从,其他情况既不是主,也不是从
      masterOrSlave: JSON.parse(localStorage.getItem("hospitalData"))?JSON.parse(localStorage.getItem("hospitalData")).masterOrSlave:'',
      current: '-1', //用分组id来确定选中的分组
      nextCurrent:'-1',//用医院id来确定选中的医院
      items: [
        // {
        //   icon: "icon-quanbu",
        //   index: "allpatient",
        //   title: "全部患者",
        //   color:'#08B3E9'
        // },
        // // {//旧版
        // //   icon: "icon-xueqianzhenduan",
        // //   index: "treeGai",
        // //   title: "辅助医疗诊断",
        // //   color:'rgb(245, 84, 103)',
        // // },
        // {//新版 测试版本
        //   icon: "static/img/icon_fenxi.svg",
        //   index: "diagnosis",
        //   title: "辅助诊断",
        //   color:'rgb(245, 84, 103)',
        // },
        // {//新版 测试版本
        //   icon: "icon-xueqianzhenduan",
        //   index: "test",
        //   title: "辅助测试",
        //   color:'rgb(245, 84, 103)',
        // },
        // {
        //   icon: "icon-xuexipingtai",
        //   index: "teachcenter",
        //   title: "教学中心",
        //   color:'#AF75EF',
        // },
        // {
        //   icon: "icon-gengduo",
        //   index: "moreservice",
        //   title: "更多服务",
        //   color:'#F17D05'
        // },
        // {
        //   icon: "icon-shanchu",
        //   index: "recycle",
        //   title: "回收站",
        //   color:'#FF5E0C'
        // },
        // {
        //   icon: "icon-shebeiguanli",
        //   index: "equipment",
        //   title: "设备管理",
        //   color:'#4BC159'
        // },
        // {
        //   icon: "icon-shezhi2",
        //   index: "personalCenter",
        //   title: "账号设置",
        //   color:'#431BF1'
        // }
      ],
      editFenzu: "", //当前选中的分组
      treesubs: [],
      dialogVisible: false,
      xiajiSub:[
        // {
        //   slaveHospitalId: "1234",//医院id
        //   groupName: '北京医院北京医院北京医院'
        // },
        // {
        //   slaveHospitalId: "4321",
        //   groupName: '上海医院'
        // }
      ],
      timer:'',//调用接口的计时器
    };
  },
  computed: {
    masterOrSlaveStore(){
      return this.$store.state.masterOrSlaveStore;
    },
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    haveAddSlavePermission(){
      return this.$store.state.haveAddSlavePermission;
    }
  },
  watch: {
    //观察路由变化 变化了就执行fetchDate方法
    $route: "fetchDate",
    masterOrSlaveStore(val,oldval){
      this.hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
      this.masterOrSlave = JSON.parse(localStorage.getItem("hospitalData")).masterOrSlave;
      this.getBannerBar();
    },  
    haveAddSlavePermission(val,oldval){
      this.getBannerBar();
    }
  },
  methods: {
    fetchDate(to,from) {
      //刷新时候 吧分组导航主动换成激活状态。
      // console.log(from)
      let id = to.query.id;
      let path = to.path;
      if (path == "/allpatient") {
        //判断是否存在id 以及id在不在树里面
        let door = false;
        if (id) {
          this.treesubs.forEach(element => {
            if (id == element.id) {
              door = true;
            }
          });
        } else {
          this.current = '-1';
        }
        if (door == true) {
          this.current = '-1';
          this.current = id;
          setTimeout(function() {
            $("#allpatient")
              .removeClass("is-active")
              .css("color", "#565656");
          }, 20);
        } else {
          $("#allpatient").addClass("is-active");
        }
      } else {
        this.current = '-1';
      }
      if (path == "/subordinateHospital") {
        //判断是否存在id 以及id在不在树里面
        let door = false;
        if (id) {
          this.xiajiSub.forEach(element => {
            if (id == element.slaveHospitalId) {
              door = true;
            }
          });
        } else {
          this.nextCurrent = '-1';
        }
        if (door == true) {
          this.nextCurrent = id;
          // setTimeout(function() {
          //   $("#allpatient")
          //     .removeClass("is-active")
          //     .css("color", "#565656");
          // }, 20);
        } else {
          // $("#allpatient").addClass("is-active");
        }
      } else {
        this.nextCurrent = '-1';
      }
    },
    changeActive() {},
    // addNextGroup(){
    //   // 添加下级医院
    //   let that = this;      
    //   this.addNextDialogVisible = true;
    // },
    addgroup() {
      //添加分组
      let that = this;      
      this.$prompt("请输入分组名称", "添加分组", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入分组名称",
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              // alert(instance.inputValue)
              this.$axios.post("create_feiyue_group.htm", {
                params: {
                  // groupReqList:[
                  //   {
                      id:new Date().getTime(),
                      hospitalId: this.hospitalId,
                      groupName:instance.inputValue,
                      isDel:0
                  //   }
                  // ]
                }
              }).then(response => {
                  if (response.data.errorCode != 0) {
                    this.$message({
                      type: "error",
                      message: response.data.errorMsg,
                      duration: "1000",
                    });
                    return;
                  }
                  // 因为接口没有返回新建分组的id以及name所以下面代码没法用，只能从新调用获取分组接口
                  // this.treesubs.push({ id: response.data.groupId, groupName: value });
                  //   //添加成功把树写在vuex
                  // this.$store.commit("newGroupData", this.treesubs);
                  this.$message({
                      type: "success",
                      message: "添加成功",
                      duration: "1000"
                  });
                  done();
                  that.$axios
                    .post("query_group_list.htm", {
                      params: {
                        hospitalId: that.hospitalId
                      }
                    })
                    .then(response => {
                      if (response.data.errorCode != 0) {
                        return;
                      }
                      that.treesubs = response.data.groupList;
                      that.xiajiSub = response.data.slaveHospitalList; 
                      that.treesubs.push({id:'00',groupName:'远程随访'});                     
                      that.treesubs.push({id:'0',groupName:'未分组'});
                      that.$store.commit("newGroupData", that.treesubs);
                    })
                    .catch(error => {});
              }).catch(error => {});
            } else {
              done();
            }
          }
      })
        .then(({ value }) => {
          
        })
        .catch(() => {});
    },
    editGroup(item) {
      //编辑分组
      this.dialogVisible = true;
      this.editFenzu = item;
    },
    clickEditFenzuSure() {
      //点击编辑确定
      // this.editFenzu.groupName = this.$refs.editfenzu.value.trim();
      //添加成功把树写在vuex
      this.$axios.post("update_feiyue_group.htm", {
          params: {
            // groupReqList:[
            //   {
                id:this.editFenzu.id,
                groupName:this.$refs.editfenzu.value.trim(),
                isDel:0
            //   }
            // ]
          }
      }).then(response => {
          if (response.data.errorCode != 0) {
            this.$message({
              type: "error",
              message: response.data.errorMsg,
              duration: "1000"
            });
            return;
          }
          this.dialogVisible = false;
          this.treesubs.push({id:'00',groupName:'远程随访'});
          this.treesubs.push({id:'0',groupName:'未分组'});
          this.$store.commit("newGroupData", this.treesubs);
          this.$message({
            type: "success",
            message: "修改成功",
            duration: "500",
            onClose:function(){
              location.reload()
            }
          });
          
      }).catch(error => {});
    },
    clickDeleteFenzu() {
      //删除分组
       this.$confirm("确认删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios.post("update_feiyue_group.htm", {
            params: {
              // groupReqList:[
              //   {
                  groupName:this.editFenzu.groupName,
                  isDel:'1',
                  id:this.editFenzu.id,
              //   }
              // ] 
            }
        }).then(response => {
            if (response.data.errorCode != 0) {
              this.$message({
                type: "error",
                message: response.data.errorMsg,
                duration: "1500"
              });
              return;
            }
            let index = this.treesubs.indexOf(this.editFenzu)
            this.treesubs.splice(index, 1)
            this.$store.commit("newGroupData", this.treesubs);
            this.$message({
              type: "success",
              message: "删除成功",
              duration: "1000"
            });
            this.dialogVisible = false;
        }).catch(error => {});
      }).catch(() => {});
    },
    getBannerBar() {
      // let url = window.location.hostname.split('.')[0];
      // if(url.indexOf('dev')=='-1'&&window.location.hostname!='localhost'&&url!='192'){
      //   // 正式
      //   if(this.masterOrSlave!='2'&&this.masterOrSlave!='3'){
      //     this.$nextTick(function () {
      //       this.items=[{
      //         icon: "icon-quanbu",
      //         index: "allpatient",
      //         title: "全部患者",
      //         color:'#08B3E9'
      //       },
      //       {
      //         icon: "icon-yiyuanjianjie",
      //         index: "subordinate",
      //         title: "下级医院患者",
      //         color:'#36CBAE',
      //         subs: []
      //       },
      //       {//新版 测试版本
      //         icon: "static/img/icon_fenxi.svg",
      //         index: "diagnosis",
      //         title: "辅助诊断",
      //         color:'rgb(245, 84, 103)',
      //       },
      //       {
      //         icon: "icon-xuexipingtai",
      //         index: "teachcenter",
      //         title: "教学中心",
      //         color:'#AF75EF',
      //       },
      //       {
      //         icon: "icon-gengduo",
      //         index: "moreservice",
      //         title: "更多服务",
      //         color:'#F17D05'
      //       },
      //       {
      //         icon: "icon-shanchu",
      //         index: "recycle",
      //         title: "回收站",
      //         color:'#FF5E0C'
      //       },
      //       {
      //         icon: "icon-shebeiguanli",
      //         index: "equipment",
      //         title: "设备管理",
      //         color:'#4BC159'
      //       },
      //       {
      //         icon: "icon-shezhi2",
      //         index: "personalCenter",
      //         title: "账号设置",
      //         color:'#431BF1'
      //       }]
      //     })
      //   }else{
      //     this.$nextTick(function () {
      //       this.items=[{
      //         icon: "icon-quanbu",
      //         index: "allpatient",
      //         title: "全部患者",
      //         color:'#08B3E9'
      //       },
      //       {//新版 测试版本
      //         icon: "static/img/icon_fenxi.svg",
      //         index: "diagnosis",
      //         title: "辅助诊断",
      //         color:'rgb(245, 84, 103)',
      //       },
      //       {
      //         icon: "icon-xuexipingtai",
      //         index: "teachcenter",
      //         title: "教学中心",
      //         color:'#AF75EF',
      //       },
      //       {
      //         icon: "icon-gengduo",
      //         index: "moreservice",
      //         title: "更多服务",
      //         color:'#F17D05'
      //       },
      //       {
      //         icon: "icon-shanchu",
      //         index: "recycle",
      //         title: "回收站",
      //         color:'#FF5E0C'
      //       },
      //       {
      //         icon: "icon-shebeiguanli",
      //         index: "equipment",
      //         title: "设备管理",
      //         color:'#4BC159'
      //       },
      //       {
      //         icon: "icon-shezhi2",
      //         index: "personalCenter",
      //         title: "账号设置",
      //         color:'#431BF1'
      //       }]
      //     })
      //   }
      // }else{
        //测试   
          // 主医院或者 空医院
          if(this.$store.state.haveAddSlavePermission=='1'){
            if(this.masterOrSlave!='2'&&this.masterOrSlave!='3'){
              this.$nextTick(function () {
                this.items=[{
                  icon: "icon-quanbu",
                  index: "allpatient",
                  title: "全部患者",
                  color:'#08B3E9'
                },
                {
                  icon: "icon-yiyuanjianjie",
                  index: "subordinate",
                  title: "下级医院患者",
                  color:'#36CBAE',
                  subs: []
                },
                {
                  icon: "static/img/icon_fenxi.svg",
                  index: "diagnosis",
                  title: "辅助诊断",
                  color:'rgb(245, 84, 103)',
                },{
                  icon: "icon-tv",
                  index: "remoteConsultation",
                  title: "远程会诊",
                  color:'#FF8D6C',
                },
                {
                  icon: "icon-xuexipingtai",
                  index: "teachcenter",
                  title: "教学中心",
                  color:'#AF75EF',
                },
                {
                  icon: "icon-gengduo",
                  index: "moreservice",
                  title: "更多服务",
                  color:'#F17D05'
                },
                {
                  icon: "icon-shanchu",
                  index: "recycle",
                  title: "回收站",
                  color:'#FF5E0C'
                },
                {
                  icon: "icon-shebeiguanli",
                  index: "equipment",
                  title: "设备管理",
                  color:'#4BC159'
                },
                {
                  icon: "icon-shezhi2",
                  index: "personalCenter",
                  title: "账号设置",
                  color:'#431BF1'
                }]
              })
            }else{
              this.$nextTick(function () {
                this.items=[{
                  icon: "icon-quanbu",
                  index: "allpatient",
                  title: "全部患者",
                  color:'#08B3E9'
                },
                {
                  icon: "static/img/icon_fenxi.svg",
                  index: "diagnosis",
                  title: "辅助诊断",
                  color:'rgb(245, 84, 103)',
                },{
                  icon: "icon-tv",
                  index: "remoteConsultation",
                  title: "远程会诊",
                  color:'#FF8D6C',
                },
                {
                  icon: "icon-xuexipingtai",
                  index: "teachcenter",
                  title: "教学中心",
                  color:'#AF75EF',
                },
                {
                  icon: "icon-gengduo",
                  index: "moreservice",
                  title: "更多服务",
                  color:'#F17D05'
                },
                {
                  icon: "icon-shanchu",
                  index: "recycle",
                  title: "回收站",
                  color:'#FF5E0C'
                },
                {
                  icon: "icon-shebeiguanli",
                  index: "equipment",
                  title: "设备管理",
                  color:'#4BC159'
                },
                {
                  icon: "icon-shezhi2",
                  index: "personalCenter",
                  title: "账号设置",
                  color:'#431BF1'
                }]
              })
            }
            
          }else{
            this.$nextTick(function () {
              this.items=[{
                icon: "icon-quanbu",
                index: "allpatient",
                title: "全部患者",
                color:'#08B3E9'
              },
              {
                icon: "static/img/icon_fenxi.svg",
                index: "diagnosis",
                title: "辅助诊断",
                color:'rgb(245, 84, 103)',
              },{
                icon: "icon-tv",
                index: "remoteConsultation",
                title: "远程会诊",
                color:'#FF8D6C',
              },
              {
                icon: "icon-xuexipingtai",
                index: "teachcenter",
                title: "教学中心",
                color:'#AF75EF',
              },
              {
                icon: "icon-gengduo",
                index: "moreservice",
                title: "更多服务",
                color:'#F17D05'
              },
              {
                icon: "icon-shanchu",
                index: "recycle",
                title: "回收站",
                color:'#FF5E0C'
              },
              {
                icon: "icon-shebeiguanli",
                index: "equipment",
                title: "设备管理",
                color:'#4BC159'
              },
              {
                icon: "icon-shezhi2",
                index: "personalCenter",
                title: "账号设置",
                color:'#431BF1'
              }]
            })
          }
    }, 
    getTree(){
      let that = this;      
      this.$axios
      .post("query_group_list.htm", {
        params: {
          hospitalId: that.hospitalId,
          masterHospital:this.masterOrSlave=='1'?that.hospitalId:'',
        }
      })
      .then(response => {
        if (response.data.errorCode != 0) {
          return;
        }
        that.treesubs = response.data.groupList;
        that.xiajiSub = response.data.slaveHospitalList;

        that.treesubs.push({id:'00',groupName:'远程随访'});
        that.treesubs.push({id:'0',groupName:'未分组'});
        this.$store.commit("newGroupData", that.treesubs);
        //刷新时候 吧分组导航主动换成激活状态。
        let id = this.$route.query.id;
        //判断是否存在id 以及id在不在树里面
        let door = false;
        let nextDoor = false;
        if (id) {
          this.treesubs.forEach(element => {
            if (id == element.id) {
              door = true;
            }
          });
          this.xiajiSub.forEach(element => {
            if (id == element.slaveHospitalId) {
              nextDoor = true;
            }
          });
          if (door == true) {
            this.current = id;
            $("#allpatient")
              .removeClass("is-active")
              .css("color", "#565656");
          }
          if (nextDoor == true) {
            this.nextCurrent = id;
            // $("#allpatient")
            //   .removeClass("is-active")
            //   .css("color", "#565656");
          }
        } else {
          this.current = '-1';
          this.nextCurrent = '-1';
        }
      })
      .catch(error => {});
    },
    query_hospital_apply(){
      // 查询主从关系状态
      let that = this;      
      if (process.env.NODE_ENV == 'development') {
        return  //由于定时的原因会导致 退出时刷新两次        
      } else if (process.env.NODE_ENV == 'debug') {
        return  //由于定时的原因会导致 退出时刷新两次       
      } else if (process.env.NODE_ENV == 'production') {
        let url = window.location.hostname.split('.')[0];
        if(url.indexOf('dev')=='-1'){
          
        }else{
          return  //由于定时的原因会导致 退出时刷新两次       
        }
      } 
      that.timer = setInterval(function(){
        that.hospitalData = JSON.parse(localStorage.getItem("hospitalData"));
        that.$axios.post("query_hospital_apply.htm", {
          params: {}
        }).then(response => {
          that.$store.commit("newHaveAddSlavePermission", response.data.haveAddSlavePermission);
          if(response.data.masterOrSlave=='3'){
            // 被别人关联了
            that.hospitalData.masterOrSlave='3';
            that.hospitalData.masterOrgName=response.data.masterOrgName;
            that.hospitalData.masterSlaveApplyTime=response.data.masterSlaveApplyTime;
            that.hospitalData.haveAddSlavePermission=response.data.haveAddSlavePermission;
            that.isdot = 1;
            localStorage.setItem('hospitalData',JSON.stringify(that.hospitalData))
            that.$store.commit("mewMasterOrSlave", '3');
            //判断当前显示页面是不是远程会诊页面如果是就刷新浏览器，不是就不变
          }else if(response.data.masterOrSlave=='2'){
            // 同意了关联
            that.hospitalData.masterOrSlave='2';
            that.hospitalData.masterOrgName=response.data.masterOrgName;
            that.hospitalData.masterSlaveApplyTime=response.data.masterSlaveApplyTime;
            that.hospitalData.haveAddSlavePermission=response.data.haveAddSlavePermission;
            localStorage.setItem('hospitalData',JSON.stringify(that.hospitalData))
            that.$store.commit("mewMasterOrSlave", '2');
            clearInterval(that.timer);
          }else if(response.data.masterOrSlave=='1'){
            // 关联了别人变成主了
            if(that.hospitalData.masterOrSlave!='1'){
              that.hospitalData.masterOrSlave='1';
              that.hospitalData.masterOrgName=response.data.masterOrgName;
              that.getTree();
            }
            that.hospitalData.masterOrSlave='1';
            that.hospitalData.masterOrgName=response.data.masterOrgName;
            that.hospitalData.haveAddSlavePermission=response.data.haveAddSlavePermission;            
            localStorage.setItem('hospitalData',JSON.stringify(that.hospitalData))
            that.$store.commit("mewMasterOrSlave", '1');
            clearInterval(that.timer);
            // 调用
          }else{
            that.hospitalData.masterOrSlave=response.data.masterOrSlave;
            that.hospitalData.masterOrgName=response.data.masterOrgName;
            that.hospitalData.haveAddSlavePermission=response.data.haveAddSlavePermission;            
            localStorage.setItem('hospitalData',JSON.stringify(that.hospitalData))
            that.$store.commit("mewMasterOrSlave", response.data.masterOrSlave);
          }
        }).catch(error => {});
      },15000)
      if(that.hospitalData.masterOrSlave=='1'){
        setInterval(function(){
          that.getTree();
        },15000)
      }
      if(that.hospitalData.masterOrSlave=='1'||that.hospitalData.masterOrSlave=='2'){
        setInterval(function(){
          that.$axios.post("new_notify.htm", {
            params: {masterOrSlave:that.hospitalData.masterOrSlave}
          }).then(response => {
            if(response.data.newNotify>0){
              that.isdot = Number(response.data.newNotify);
              that.$store.commit("newNotify", response.data.newNotify);
            }else{
              that.isdot = 0;
              that.$store.commit("newNotify", '0');              
            }
          }).catch(error => {});
        },15000)
      }
    }
  },
  // beforeCreate() {
  //   let url = window.location.hostname.split('.')[0];
  //   if(url.indexOf('dev')=='-1'&&window.location.hostname!='localhost'&&url!='192'){
  //     // 正式
  //     if(this.masterOrSlave!='2'){
  //       this.$nextTick(function () {
  //         this.items=[{
  //           icon: "icon-quanbu",
  //           index: "allpatient",
  //           title: "全部患者",
  //           color:'#08B3E9'
  //         },
  //         {
  //           icon: "icon-yiyuanjianjie",
  //           index: "subordinate",
  //           title: "下级医院患者",
  //           color:'#36CBAE',
  //           subs: []
  //         },
  //         {//新版 测试版本
  //           icon: "static/img/icon_fenxi.svg",
  //           index: "diagnosis",
  //           title: "辅助诊断",
  //           color:'rgb(245, 84, 103)',
  //         },
  //         {
  //           icon: "icon-xuexipingtai",
  //           index: "teachcenter",
  //           title: "教学中心",
  //           color:'#AF75EF',
  //         },
  //         {
  //           icon: "icon-gengduo",
  //           index: "moreservice",
  //           title: "更多服务",
  //           color:'#F17D05'
  //         },
  //         {
  //           icon: "icon-shanchu",
  //           index: "recycle",
  //           title: "回收站",
  //           color:'#FF5E0C'
  //         },
  //         {
  //           icon: "icon-shebeiguanli",
  //           index: "equipment",
  //           title: "设备管理",
  //           color:'#4BC159'
  //         },
  //         {
  //           icon: "icon-shezhi2",
  //           index: "personalCenter",
  //           title: "账号设置",
  //           color:'#431BF1'
  //         }]
  //       })
  //     }else{
  //       this.$nextTick(function () {
  //         this.items=[{
  //           icon: "icon-quanbu",
  //           index: "allpatient",
  //           title: "全部患者",
  //           color:'#08B3E9'
  //         },
  //         {//新版 测试版本
  //           icon: "static/img/icon_fenxi.svg",
  //           index: "diagnosis",
  //           title: "辅助诊断",
  //           color:'rgb(245, 84, 103)',
  //         },
  //         {
  //           icon: "icon-xuexipingtai",
  //           index: "teachcenter",
  //           title: "教学中心",
  //           color:'#AF75EF',
  //         },
  //         {
  //           icon: "icon-gengduo",
  //           index: "moreservice",
  //           title: "更多服务",
  //           color:'#F17D05'
  //         },
  //         {
  //           icon: "icon-shanchu",
  //           index: "recycle",
  //           title: "回收站",
  //           color:'#FF5E0C'
  //         },
  //         {
  //           icon: "icon-shebeiguanli",
  //           index: "equipment",
  //           title: "设备管理",
  //           color:'#4BC159'
  //         },
  //         {
  //           icon: "icon-shezhi2",
  //           index: "personalCenter",
  //           title: "账号设置",
  //           color:'#431BF1'
  //         }]
  //       })
  //     }
  //   }else{
  //     //测试   
  //     if(this.masterOrSlave!='2'){
  //       this.$nextTick(function () {
  //       // this.items.splice(2,1);
  //         this.items=[{
  //           icon: "icon-quanbu",
  //           index: "allpatient",
  //           title: "全部患者",
  //           color:'#08B3E9'
  //         },
  //         {
  //           icon: "icon-yiyuanjianjie",
  //           index: "subordinate",
  //           title: "下级医院患者",
  //           color:'#36CBAE',
  //           subs: []
  //         },
  //         {//新版 测试版本
  //           icon: "static/img/icon_fenxi.svg",
  //           index: "diagnosis",
  //           title: "辅助诊断",
  //           color:'rgb(245, 84, 103)',
  //         },{
  //           icon: "icon-tv",
  //           index: "remoteConsultation",
  //           title: "远程会诊",
  //           color:'#FF8D6C',
  //         },
  //         {//新版 测试版本
  //           icon: "icon-xueqianzhenduan",
  //           index: "test",
  //           title: "辅助测试",
  //           color:'rgb(245, 84, 103)',
  //         },
  //         {
  //           icon: "icon-xuexipingtai",
  //           index: "teachcenter",
  //           title: "教学中心",
  //           color:'#AF75EF',
  //         },
  //         {
  //           icon: "icon-gengduo",
  //           index: "moreservice",
  //           title: "更多服务",
  //           color:'#F17D05'
  //         },
  //         {
  //           icon: "icon-shanchu",
  //           index: "recycle",
  //           title: "回收站",
  //           color:'#FF5E0C'
  //         },
  //         {
  //           icon: "icon-shebeiguanli",
  //           index: "equipment",
  //           title: "设备管理",
  //           color:'#4BC159'
  //         },
  //         {
  //           icon: "icon-shezhi2",
  //           index: "personalCenter",
  //           title: "账号设置",
  //           color:'#431BF1'
  //         }]
  //         // console.log(this.items)
  //       })
  //     }else{
  //       alert(1)
  //       this.$nextTick(function () {
  //         // this.items.splice(2,1);
  //         this.items=[{
  //           icon: "icon-quanbu",
  //           index: "allpatient",
  //           title: "全部患者",
  //           color:'#08B3E9'
  //         },
  //         {//新版 测试版本
  //           icon: "static/img/icon_fenxi.svg",
  //           index: "diagnosis",
  //           title: "辅助诊断",
  //           color:'rgb(245, 84, 103)',
  //         },{
  //           icon: "icon-tv",
  //           index: "remoteConsultation",
  //           title: "远程会诊",
  //           color:'#FF8D6C',
  //         },
  //         {//新版 测试版本
  //           icon: "icon-xueqianzhenduan",
  //           index: "test",
  //           title: "辅助测试",
  //           color:'rgb(245, 84, 103)',
  //         },
  //         {
  //           icon: "icon-xuexipingtai",
  //           index: "teachcenter",
  //           title: "教学中心",
  //           color:'#AF75EF',
  //         },
  //         {
  //           icon: "icon-gengduo",
  //           index: "moreservice",
  //           title: "更多服务",
  //           color:'#F17D05'
  //         },
  //         {
  //           icon: "icon-shanchu",
  //           index: "recycle",
  //           title: "回收站",
  //           color:'#FF5E0C'
  //         },
  //         {
  //           icon: "icon-shebeiguanli",
  //           index: "equipment",
  //           title: "设备管理",
  //           color:'#4BC159'
  //         },
  //         {
  //           icon: "icon-shezhi2",
  //           index: "personalCenter",
  //           title: "账号设置",
  //           color:'#431BF1'
  //         }]
  //         // console.log(this.items)
  //       })
  //     }
  //   }
  // },  
  mounted() {
    let that = this;
    this.getBannerBar();
    this.getTree();
    this.query_hospital_apply();
    // alert(this.masterOrSlave)
    // 直接调用接口拿数据写在vuex里面 不放缓存了

    eventBus.$on('addgroup',function(){
      that.addgroup();
    })
    // 添加下级医院
    // eventBus.$on('addNextGroup',function(){
    //   that.addNextGroup();
    // })
    eventBus.$on('updateTree',function(){
      that.getTree();
    })
  }
};
</script>

<style scoped>

.sidebar .group {
  display: flex;
  font-size: 18px;
}
.sidebar .el-icon-edit {
  position: absolute;
  padding: 5px 3px;
  font-size: 20px;
  top: 13px;
  right: -5px;
  display: none;
}
.sidebar {
  display: block;
  width: 200px;
  min-width: 200px;
  padding-bottom: 70px;
  background-color: rgb(239, 248, 252);
  height:100vh;
  overflow-y: auto;
}
.sidebar > ul {
  /* height: 100%; */
  padding-top: 10px;
  padding-bottom:80px;
  border: none;
  /* overflow-y: auto; */
}
.sidebar .el-menu-item {
  font-size: 18px;
  text-align: left;
  padding-left: 15% !important;
  display: flex;
  align-items: center;
}
.sidebar .el-menu-item .iconfont {
  font-size: 20px;
  margin-right: 8px;
}
.sidebar .el-menu-item:hover {
  background-color: #DCF3FD !important;
}
.sidebar .el-menu-item.group:hover .el-icon-edit {
  display: block;
}
.sidebar .el-menu-item.group {
  text-align: left;
  font-size: 16px !important;;
  padding-left: 24% !important;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  position: relative;
}
.sidebar .el-menu-item.group .iconfont {
  font-size: 16px !important;;
  display: inline-block;
  margin-top: -4px;
}
.sidebar .el-menu-item.group.is-active {
  background-color: #DCF3FD !important;
  color: rgb(8, 179, 233) !important;
}
.sidebar .el-menu-item.is-active {
  background-color: #DCF3FD !important;
  color: rgb(8, 179, 233) !important;
}

</style>
