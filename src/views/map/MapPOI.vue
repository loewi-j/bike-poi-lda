<template>
  <div class="container">
    <div :id="'chart-poi'" class="chart-poi"></div>
  </div>
</template>

<script>
import {loadBMap} from '@/network/loadBMap'
import {getPOIData} from '@/network/bike'
// 地图geo
require('echarts/lib/component/geo')
require('echarts/extension/bmap/bmap')

export default {
  name: "MapPOI",
  data() {
    return {
      mapPOI: null,
      BMap: null,
      POI_data: []
    }
  },
  watch: {
    POI_data: {
      deep: true,
      handler() {
        this.drawPOI()
      }
    }
  },
  mounted() {
    // const _this = this;
    loadBMap("zuOOwSLGXP0lBIM2yU8R2YuZze8853ys").then(() => {
      console.log('chart-city')
      this.mapPOI = this.$echarts.init(document.getElementById('chart-poi'))
      console.log(this.mapPOI)

      this.initMap()
      this.getData()

    }).catch((err) => {
      console.log(err);
    });
    window.onresize = () => {
      this.mapPOI.resize()
    }
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.mapPOI.dispose()
  },
  methods: {
    //初始化图表
    initMap() {
      let CLUSTER_COUNT = 9;
      let DIENSIION_CLUSTER_INDEX = 2;
      let COLOR_ALL = [
        '#e06343',
        '#37a354',
        '#db253e',
        '#714bb8',
        '#a8c6f6',
        '#50c1b4',
        '#aed606',
        '#b55dba',
        '#37A2DA',
        '#fef804',
      ];
      let LABEL_ALL =['Travel & Transport', 'Shop & Service', 'Residence', 'Professional & Other Places',
        'Outdoors & Recreation', 'Nightlife Spot','Food', 'College & University', 'Arts & Entertainment']
      let pieces = [];
      for (let i = 0; i < CLUSTER_COUNT; i++) {
        pieces.push({
          value: i,
          label: LABEL_ALL[i],
          color: COLOR_ALL[i]
        });
      }

      const option = {
        animation: false,
        smooth: true,
        emphasis: false,
        sampling: "average",
        title: {
          text: 'POI分布图',
        },
        // tooltip: {
        //   show: true,
        //   formatter: '{c}'
        // },
        visualMap: {
          type: 'piecewise',
          top: 'middle',
          min: 0,
          max: CLUSTER_COUNT,
          left: 10,
          splitNumber: CLUSTER_COUNT,
          dimension: DIENSIION_CLUSTER_INDEX,
          pieces: pieces
        },
        grid: {
          left: 120
        },
        bmap: { // 加载 bmap 组件
          center: [-73.99769, 40.737728],
          zoom: 14, // 地图当前的缩放比例
          roam: true, // 开启鼠标缩放和平移漫游
          scaleLimit: {min: 6, max: 12}, // echarts设置地图最小最大缩放比例的接口不起作用，要使用百度地图的接口设置
        },
      }
      this.mapPOI.setOption(option)
      const styleData = [
        {
          featureType: 'water',
          elementType: 'all',
          stylers: {
            color: '#f2f6f8'
          }
        },
        {
          featureType: 'land',
          elementType: 'all.fill',
          stylers: {
            color: '#8ac0db'
          }
        },
        {
          featureType: 'railway',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'highway',
          elementType: 'all',
          stylers: {
            color: '#fdfdfd'
          }
        },
        {
          featureType: 'highway',
          elementType: 'labels',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'geometry',
          stylers: {
            color: '#fefefe'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'geometry.fill',
          stylers: {
            color: '#fefefe'
          }
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'green',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'subway',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'manmade',
          elementType: 'all',
          stylers: {
            color: '#eeeeee'
          }
        },
        {
          featureType: 'local',
          elementType: 'all',
          stylers: {
            color: '#eeeeee'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'labels',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'boundary',
          elementType: 'all',
          stylers: {
            color: '#eeeeee'
          }
        },
        {
          featureType: 'building',
          elementType: 'all',
          stylers: {
            color: '#eeeeee'
          }
        },
        {
          featureType: 'label',
          elementType: 'labels.text.fill',
          stylers: {
            color: '#5c5c5c'
          }
        }
      ]
      let bmap = this.mapPOI.getModel().getComponent("bmap").getBMap();
      this.BMap = bmap
      bmap.setMapStyle({styleJson: styleData,});
    },

    getData() {
      getPOIData().then(res => {
        console.log(res.data.data)
        this.POI_data = this.objOfValueToArr(res.data.data)
        // this.POI_data = res.data.data.map(item => (
        //     {'legend': item.legend, 'value': this.objOfValueToArr(item.value)}
        // ))
        // console.log(this.POI_data)
      })

    },
    drawPOI() {
      const POI_series = [];
      this.POI_data.map(item => {
        let longitude = item['longitude']
        let latitude = item['latitude']
        if (longitude && latitude) {
          POI_series.push(
              [longitude, latitude, item['type'], item['venue_category_name'], item['top_category']]
          )
        }
      })
      console.log(POI_series)
      const series = [
        {
          name: '内环',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: POI_series,
          symbolSize: 3,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          emphasis: false,
          zlevel: 4
        },
      ]
      const option = {
        series: series,
      }
      console.log('series')
      this.mapPOI.setOption(option)
    },
    // 将Object的属性值输出成Array
    objOfValueToArr(object) {
      let arr = [];
      let i = 0;
      for (let item in object) {
        arr[i] = object[item];
        i++;
      }
      return arr;
    },
  }
}
</script>

<style scoped>
.chart-poi {
  width: 600px;
  height: 700px;
  margin: 0 auto;
}
</style>