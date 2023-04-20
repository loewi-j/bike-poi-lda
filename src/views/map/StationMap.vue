<template>
  <a-row id='station-row'>
    <a-col ref='stationCol' :span="14">
      <div id='chartStation' ref='chartStation'></div>
    </a-col>
    <a-col :span="10" style="padding-left: 25px">
      <a-row>
        <div class="introduce" :style="{margin: 0}">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
        </div>
        <br/>
        <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange"/>
      </a-row>
<!--      可以增加模式切换，固定缩放比例-->
      <a-row>
        <div class="introduce">
          基本介绍
        </div>
        <a-collapse class="collapse-box" v-model="activeKey" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" style="color: #384d9c"/>
          </template>
          <a-collapse-panel v-for="(item, index) in collapseList" :key="index + ''" :header="item.title"
                            :style="customStyle">
            <p>{{ item.value }}</p>
          </a-collapse-panel>
          <a-collapse-panel :key="collapseList.length + ''" header="站点的特点" :style="customStyle">
            <p>P1 Station</p>
          </a-collapse-panel>
        </a-collapse>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import nycGEO from '@/assets/geo/nyc_geo_bor.json'
import {getStationsCenter} from '@/network/site'
import {getPOIData} from '@/network/bike'
import {objOfValueToArr} from '@/common/resFilter'

const POI = 'POI点';
const STATION = '站点';
const plainOptions = [POI, STATION];
const defaultCheckedList = [POI, STATION];

export default {
  name: 'StationMap',
  data() {
    return {
      myChart: null,
      StationSeries: [],
      stationList: [],
      isMounted: false,
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions,
      activeKey: ['0', '1', '2'],
      collapseList: [
        {title: 'POI数据', value: 'POI数据来源于Foursquare打卡数据集，每一个打卡记录对应着一个POI地点的信息，包含有地点类别ID，地点名，GPS经纬度以及时间戳。'},
        {title: '站点数据', value: '根据站点周围POI比例将站点聚类为7类，同时，根据站点容量进一步区分为大型站点和小型站点。容量大于平均容量的站点被认为是大型站点。其他的被认为是小站点。'},
      ],
      customStyle: 'background: #eff1f4;border-radius: 4px;padding-bottom: 10px;border: 0;overflow: hidden',
    }
  },
  computed: {
    chartWidth() {
      if (this.isMounted) {
        return this.$refs.stationCol.$el.offsetWidth + 'px'
      }
    }
  },
  watch: {
    chartWidth(val) {
      this.$nextTick(() => {
        this.myChart.getDom().style.width = val;
        this.myChart.resize();
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      this.getData();
      window.addEventListener("resize", this.resizeChart);
      this.isMounted = true
    })
  },
  deactivated() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    initMap() {
      this.$echarts.registerMap('Station', nycGEO);
      let echart = this.$refs.chartStation;
      this.myChart = this.$echarts.init(echart)

      let stites = [[-74.00293877, 40.73401143], [-74.006107805, 40.71834326], [-73.93018, 40.7020585],
        [-73.99078, 40.7562138], [-74.0, 40.73], [-73.982656, 40.78396536], [-74.0024267770875, 40.72054615617803]]

      //3 6 较边缘
      let pieces = [
        {label: 'P1 Station', value: 0, color: '#5470c6'},
        {label: 'P2 Station', value: 1, color: '#3ba272'},
        {label: 'P3 Station', value: 2, color: '#fc8452'},
        {label: 'P4 Station', value: 3, color: '#ea7ccc'},
        {label: 'P5 Station', value: 4, color: '#fac858'},
        {label: 'P6 Station', value: 5, color: '#73c0de'},
        {label: 'P7 Station', value: 6, color: '#9a60b4'},
      ]
      // #00ABC4
      // #666666
      // #ED0872
      // #08B89C
      let COLOR_ALL = ['#5470c6', '#91cc75', '#3ba272', '#fac858',
        '#ea7ccc', '#fc8452', '#ee6666', '#73c0de', '#9a60b4']
      let LABEL_ALL = ['夜晚Ni', '教育Ed', '专业Pr', '吃饭Ea',
        '交通Tr', '住宅Re', '艺术Ar', '户外Ou', '购物Sh']
      let VALUE_ALL = [3, 1, 5, 2, 8, 6, 0, 4, 7]
      let piecesPOI = [];
      for (let i = 0; i < 9; i++) {
        piecesPOI.push({
          value: VALUE_ALL[i],
          label: LABEL_ALL[i],
          color: COLOR_ALL[i]
        });
      }
      const option = {
        // title: {
        //   text: '共享单车站点类型和周边POI的空间分布情况',
        //   left: 'right'
        // },
        //数据映射
        visualMap: [
          {
            type: 'piecewise',//分段标签
            min: 0,
            max: 10,
            // left: 30,
            top: 20,
            orient: 'vertical',//组件竖直放置
            align: 'left',//色块在左
            textGap: 14,//文字主体之间的距离
            itemSymbol: 'circle',//右下角映射组件使用圆点形状
            // show: false,
            seriesIndex: 0,//指定取哪个系列的数据(series.data)，若不设置则会影响图上标点颜色设置。
            dimension: 3,
            pieces: pieces,
          },
          {
            type: 'piecewise',
            min: 0,
            max: 9,
            // left: 30,
            bottom: 30,
            splitNumber: 9,
            seriesIndex: 1,
            dimension: 2,
            pieces: piecesPOI
          }
        ],
        tooltip: false,
        animation: false,
        geo: {
          name: 'Station',
          nameProperty: 'borough',
          roam: true,
          map: 'Station',
          show: true,
          // zoom: 32,
          zoom: 5,
          // center: stites[4],
          center: [-73.976, 40.73],
          itemStyle: {
            borderColor: '#7f7f7f',  //地图区域的边框
          },
          emphasis: {
            itemStyle: {
              areaColor: '',
            },
            label: {
              show: false,
            },
          },
        },
      };
      this.myChart.setOption(option);
    },
    getData() {
      Promise.all([getPOIData(), getStationsCenter()]).then(res => {
        // console.log(res)
        this.stationList = objOfValueToArr(res[1].data.data)
        this.poiList = objOfValueToArr(res[0].data.data)
        console.log(this.poiList.length)
        this.drawStation();
      })
    },
    drawStation() {
      let convertData = this.stationList.map(item => {
        return {
          name: item.id,
          value: [item.longitude, item.latitude, item.size, item.type_id]
        };
      })

      const POI_series = this.poiList.map(item => {
        let longitude = item['longitude']
        let latitude = item['latitude']
        if (longitude && latitude) {
          return [longitude, latitude, item['type'], item['venue_category_name'], item['top_category']]
        }
      })

      this.StationSeries = [
        {
          name: 'stations',
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 0,
          symbol: this.checkedList.includes(STATION) ? 'circle' : 'none',
          symbolSize: (val) => {
            return val[2] === 1 ? 10 : 6;
          },
          itemStyle: {
            borderColor: '#6f6f6f',
            borderWidth: 0.4,
          },
          data: convertData,
          zlevel: 3,
        },
        {
          name: 'poi',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: this.checkedList.includes(POI) ? 'circle' : 'none',
          data: POI_series,
          symbolSize: 3,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          itemStyle: {
            borderColor: '#6f6f6f',
            borderWidth: 0.1,
          },
          emphasis: false,
          zlevel: 2,
        },
        // {
        //   name: 'stations',
        //   type: 'scatter',
        //   coordinateSystem: 'geo',
        //   geoIndex: 0,
        //   symbolSize: 120,
        //   itemStyle: {
        //     color: 'rgba(255, 255, 255, 0)',
        //     borderColor: '#404040',
        //     borderWidth: 0.7,
        //     // borderWidth: 0,
        //   },
        //   data: convertData,
        //   zlevel: 3,
        // },
      ]
      this.myChart.setOption({series: this.StationSeries})
    },
    resizeChart() {
      this.myChart.getDom().style.width = this.$refs.stationCol.$el.offsetWidth + 'px';
      this.myChart.resize();
    },
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
      this.drawStation()
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      this.drawStation()
    },
  }
}
</script>

<style scoped>
#chartStation {
  /*width: 85%;*/
  height: calc(100vh - 60px - 30px - 48px - 4px);
}
.collapse-box {
  overflow-y: scroll;
  height: calc(100vh - 60px - 30px - 48px - 4px - 70px - 28px - 40px);
}
.collapse-box::-webkit-scrollbar {
  display: none;
}
</style>