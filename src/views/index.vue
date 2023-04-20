<template>
  <div id="layout">
    <a-layout>
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <transition name="trans">
          <div class="logo">
            <img v-if="collapsed" :width="50" :src="logo"/>
            <img v-else :width="170" :src="bicycle"/>
          </div>
        </transition>
        <a-menu
            mode="inline"
            :default-selected-keys="['1']"
            :style="{ height: 'calc(100vh - 93px)', borderRight: 0 }"
        >
          <a-menu-item key="0" @click="changeMenu('NYCMap')">
            <a-icon type="global"/>
            <span>站点与ZCTA</span>
          </a-menu-item>
          <a-menu-item key="1" @click="changeMenu('StationMap')">
            <a-icon type="dot-chart"/>
            <span>站点与POI</span>
          </a-menu-item>
          <a-menu-item key="2" @click="changeMenu('StationTime')">
            <a-icon type="calendar"/>
            <span>到达时间分布</span>
          </a-menu-item>
          <a-menu-item key="3" @click="changeMenu('LDAMap')">
            <a-icon type="car"/>
            <span>出行模式</span>
          </a-menu-item>
          <a-menu-item key="4" @click="changeMenu('LDAPercent')">
            <a-icon type="build"/>
            <span>空间分布</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
          />
          {{ this.$route.meta.title }}
        </a-layout-header>
        <a-layout-content>
          <a-card :bordered="false" style="">
            <keep-alive>
              <router-view/>
            </keep-alive>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import bicycle from '@/assets/bicycle.png'
import logo from '@/assets/bicycle_logo.png'

export default {
  name: "index",
  data() {
    return {
      collapsed: false,
      bicycle: bicycle,
      logo: logo,
    };
  },
  methods: {
    //路由内容切换
    changeMenu(route) {
      console.log(route)
      //获取路由对象并切换
      this.$router.push('/index/' + route)
    },
  }
}
</script>

<style scoped>
#layout .logo {
  margin: -16px 15px;
}

#layout .ant-layout-header {
  padding: 0;
  background: #eff1f4;
  color: #384d9c;
  font-weight: bold;
  line-height: 64px;
  font-size: 16px;
  letter-spacing: 1px;
}

#layout .ant-layout-sider {
  background: #fffcf9;
  line-height: 120px;
  height: calc(100vh - 60px);
  box-shadow: 2px 0 5px -5px #aaaaaa;
}

#layout .ant-layout-content {
  /*background: #eae3d3;*/
  min-height: calc(100vh - 64px);
  line-height: 120px;
}

#layout .trigger {
  font-size: 18px;
  vertical-align: middle;
  padding: 0 24px;
  /*color: #85a79e;*/
  cursor: pointer;
  transition: color 0.3s;
}

#layout .trigger:hover {
  color: #112378;
}

#layout .ant-menu {
  background: #fffcf9;
  box-shadow: 2px 0 5px -5px #aaaaaa;

  /*color: #faebce;*/
}

.ant-card {
  width: 97%;
  margin: 15px auto;
  min-height: calc(100vh - 64px - 30px);
  box-shadow: 2px 2px 5px -2px #c7c7c7;
  border-radius: 5px;
}
.trans-enter,.trans-leave-to{
  opacity: 0;
  width: 0;
  height: 0;
}

/*变大变小*/
/*Opacity为1的状态*/
.trans-enter-to,.trans-leave{
  opacity: 1;
  width: 100px;
  height: 100px;
}

/*变大变小*/
/*过渡*/
.trans-enter-active,.trans-leave-active{
  transition: all 3s;
}
/*#layout .ant-menu .ant-menu-item-active{*/
/*  color: rgba(255,255,255,0.65);*/
/*}*/
/*#layout .ant-menu .ant-menu-item {*/
/*  background: #85a79e;*/
/*}*/

/*#85a79e
  #bcd8d1
  #bcd8d1
  #e8f3f1
*/
/*#layout > .ant-layout {*/
/*  margin-bottom: 48px;*/
/*}*/
</style>
<style>
.introduce {
  border-bottom: 1px solid #dcdcdc;
  margin: 20px 0 10px 0;
  padding: 3px 0;
  color: #384d9c;
  font-weight: 600;
  font-size: 16px;
}
</style>