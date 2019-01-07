<template>
    <div>
        <div class="header bgcf">
            <div class="headerleft">
                <div class="headerkuai">
                    <img src="static/img/logo.png" alt="">
                </div>
                <div class="headerleft-title">肺悦呼吸系统疾病诊疗管理系统</div>
            </div>
            <div class="user-info" style="cursor: default;">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span>
                        {{name}}{{department}}
                        <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="name">修改用户名称</el-dropdown-item>
                        <el-dropdown-item command="password">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
//    import axios from 'axios';

    export default {
        data() {
            return {
               name: '',
               department:'',
            }
        },
        methods:{
            handleCommand(command) {
                let that = this;
                if(command == 'loginout'){
                    localStorage.clear();                    
                    this.$message({
                        type: 'success',
                        message: '退出成功，请重新登陆',
                        duration:'1000',
                        onClose:function(){
                            that.$router.push({path: '/login'});
                        }
                    });
                }else{
                    that.$router.push({path: '/personalCenter?edit='+command});
                }
            },
            getUsernme(){
                this.name = JSON.parse(localStorage.getItem("hospitalData")).orgName;
                this.department = JSON.parse(localStorage.getItem("hospitalData")).department;
            }
        },
        mounted(){
            this.getUsernme();
            let that = this;
            eventBus.$on('getUsernme',function(){
                that.getUsernme();
            })
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        z-index: 50;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .headerleft{
         display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 22px;
    }
    .headerleft-title{
        color:#fff;
    }
    .headerkuai{
        width: 170px;
        height: 55px;
        margin: 0 20px 0 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .headerkuai img{
        width: 85%;
    }
    .edituserems .edituseremsbox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
    }
    .edituserems .edituseremsspan{
        width: 90px;
    }
   .user-info {
        float: right;
        padding-right: 30px;
        cursor: pointer;
    }
    .user-info .el-dropdown{
        font-size: 16px;
        padding:20px 0;
        color: #fff;
        cursor: pointer;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        cursor: pointer;
        font-size: 16px;
        vertical-align: middle;
    }
    .el-dropdown-menu{
        top:47px !important;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
