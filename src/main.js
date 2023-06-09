import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'ant-design-vue/dist/antd.css';
// import '@/assets/css/chart.css'
// 引入echarts
import echarts from 'echarts'
// import '@/network/initBMap'
import 'normalize.css'
import 'ant-design-vue/dist/antd.less'


Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
Vue.use(Antd);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
