## vue国际化项目兼容elementUI 国际化，可自己切换。
## 获取浏览器语言环境默认显示相关语言。
## 配置标题 页面title可根据语言切换，如果页面title随着组件变化而变只需在语言包配置即可。


> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification 正式打包 打包根路径需要在 webpack.base.conf.js设置
npm run build


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 动态改变页面title
1.默认html页面为一级title是写死的。
2.二级title在i18n.js设置是近来项目默认的，也在切换语言的时候改变。这个二级title执行比根据不同页面显示不同title快，所以不影响页面不同title不同。
3.三级title就是页面不同显示不同title,页面变化在路由index.js里面设置。要是后来切换语言就在切换语言的地方设置