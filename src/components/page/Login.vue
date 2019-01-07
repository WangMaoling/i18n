<template>
    <div>
        <p>{{$t('message.hello')}}</p> 
        <el-select v-model="value"  @change="change" :placeholder="$t('message.select')">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="block">
            <el-date-picker
            type="date"
            :placeholder="$t('el.datepicker.selectDate')">
            </el-date-picker>
        </div>
        <div class="block">
            <el-date-picker
            align="right"
            type="date"
            :placeholder="$t('el.datepicker.selectDate')"
            >
            </el-date-picker>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            options: [
                {
                value: "en",
                label: "English"
                },
                {
                value: "cn",
                label: "中文"
                }
            ],
            value: localStorage.getItem('language'),
        };
    },
    methods: {
        change(e) {
            localStorage.setItem('language',e)
            this.$i18n.locale = e;
            //1.设置页面title这个是二级title
            // document.title = this.$t('message.pageTitle.title');
            // 2.三级title设置 得根据当前页面路由位置，去拿到title
            var page = this.$route.path.split('/').pop();
            document.title = this.$t('message.pageTitle.'+page);
        }
    },
    mounted(){
       console.log(this.$i18n.locale)
    }
};
</script>
