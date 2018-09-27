<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="contentBox">
            <v-sidebar></v-sidebar>
            <div class="content">
                <div class="mesContent">
                    <transition name="fade" mode="out-in">
                        <!-- 另外一种通过name设置保存状态的方法 -->
                        <!-- <keep-alive include="allpatient">
                            <router-view></router-view>
                        </keep-alive> -->
                        <keep-alive>
                        <router-view v-if="$route.meta.keepAlive">
                            <!-- 这里是会被缓存的视图组件，比如 Home！ -->
                            </router-view>
                        </keep-alive>
                     </transition>
                    <transition name="fade" mode="out-in">
                        <router-view v-if="!$route.meta.keepAlive">
                            <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
                        </router-view>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        }
    }
</script>
<style >
.fade-leave-active{
     display: none;
     opacity: 0;
}
.fade-enter-active{
    transition: opacity .2s;
}
.fade-enter{
    opacity: 0;
}
.fade-leave{
    opacity: 0;
    display: none;
}
/* 框架定位等 */
.contentBox{
    width: 100%;
    display: flex;
    height: 100%;
    position: absolute;
}
.content {
    position: relative;
    height: 100%;
    width: 100% !important;
    box-sizing: border-box;
    overflow-x: auto !important;
    padding: 20px 20px 0 20px;
}
.mesContent {
    width: 100%;
    /* min-height: 100%; */
    padding-bottom: 80px;
}
</style>

