import Vue from 'vue'
import Router from 'vue-router'
import MapPOI from "@/views/map/MapPOI";
import NYCMap from "@/views/map/NYCMap";
import StationMap from "@/views/map/StationMap";
import StationTime from "@/views/map/StationTime";
import LDAMap from "@/views/map/LDAMap";
import LDAPercent from "@/views/map/LDAPercent";
import Index from "@/views/index";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/index/NYCMap',
          name: 'NYCMap',
          component: NYCMap,
          meta:{
            title: '纽约市ZCTA中公共自行车站点分布情况'
          },
        },
        {
          path: '/index/StationMap',
          name: 'StationMap',
          component: StationMap,
          meta:{
            title: '共享单车站点类型和周边POI的空间分布情况'
          },
        },
        {
          path: '/index/StationTime',
          name: 'StationTime',
          component: StationTime,
          meta:{
            title: '各类型站点共享单车到达的时间分布'
          },
        },
        {
          path: '/index/LDAMap',
          name: 'LDAMap',
          component: LDAMap,
          meta:{
            title: '共享单车出行模式可视化'
          },
        },
        {
          path: '/index/LDAPercent',
          name: 'LDAPercent',
          component: LDAPercent,
          meta:{
            title: '共享单车出行模式的空间分布'
          },
        },
        {
          path: '/index/test',
          name: 'MapPOI',
          component: MapPOI,
        },
      ]
    },

  ]
})
