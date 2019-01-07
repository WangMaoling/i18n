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
</script>
<style >
</style>

