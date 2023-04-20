<template>
  <a-row id='lda-row'>
    <a-col ref='stationCol' :span="14">
      <div :id="'chartPer'" ref='chartPer'></div>
    </a-col>
    <a-col :span="10" style="padding-left: 25px">
      <a-row>
        <div class="introduce" :style="{margin: 0}">
          选择站点类别
        </div>
        <br/>
        <a-radio-group :value="chooseTheme" @change="radioChange">
          <!--          <a-tooltip v-for="(item, index) in topicList" :placement="index < 4 ? 'top' : 'bottom'"-->
          <!--                     :title="item.label" :key="item.value" color="#eff6f5">-->
          <a-radio v-for="(item, index) in themeList" :key="item" :value="item">Theme {{ item }}</a-radio>
          <!--          </a-tooltip>-->
        </a-radio-group>
      </a-row>

    </a-col>
  </a-row>
</template>

<script>
import {getLDAPercent} from "@/network/lda";
import {objOfValueToArr} from "@/common/resFilter";
import nycGEO from "@/assets/geo/nyc_geo.json";
import {getStationsCenter} from "@/network/site";

export default {
  name: "LDAPercent",
  data() {
    return {
      myChart: null,
      isMounted: false,
      themeList: [5, 6, 8, 10, 11, 14, 17],
      chooseTheme: 5,
      percentData: [],
      stationList: [],
      max: 0
    }
  },
  computed: {
    chartWidth() {
      if (this.isMounted) {
        return this.$refs.stationCol.$el.offsetWidth + 'px'
      }
    },
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
      this.chooseTheme = this.themeList[0]
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
      let echart = this.$refs.chartPer;
      this.myChart = this.$echarts.init(echart)

      const option = {
        tooltip: false,
        animation: false,
        geo: {
          name: 'Station',
          nameProperty: 'borough',
          roam: true,
          map: 'Station',
          show: true,
          zoom: 3,
          center: [-73.976, 40.73],
          itemStyle: {
            borderColor: '#7f7f7f',  //地图区域的边框
            // color: '#b8b8b8'
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
      Promise.all([getLDAPercent(this.chooseTheme), getStationsCenter()]).then(res => {
      // getLDAPercent(this.chooseTheme).then(res => {
        this.percentData = objOfValueToArr(res[0].data.data)
        this.stationList = objOfValueToArr(res[1].data.data)
        this.max = res[0].data.max
        console.log(this.percentData)
        this.drawStation();
      })
    },
    drawStation() {
      let pieces = [
        {label: 'P1 Station', value: 0, color: '#5470c6'},
        {label: 'P2 Station', value: 1, color: '#3ba272'},
        {label: 'P3 Station', value: 2, color: '#fc8452'},
        {label: 'P4 Station', value: 3, color: '#ea7ccc'},
        {label: 'P5 Station', value: 4, color: '#fac858'},
        {label: 'P6 Station', value: 5, color: '#73c0de'},
        {label: 'P7 Station', value: 6, color: '#9a60b4'},
      ]

      let colorList = {'5': '#7929a0', '6': '#c1389a', '8': '#2548aa', '10': '#c25628',
                      '11': '#bd8f2b', '14': '#1c975d', '17': '#247d9e'}

      let convertData = this.stationList.map(item => {
        return {
          name: item.id,
          value: [item.longitude, item.latitude, item.size, item.type_id]
        };
      })
      let mapData = this.percentData.map(item => {
        return {
          name: item['ZCTA'] + '',
          value: item['0']
        }
      })

      this.myChart.setOption({
        visualMap: [
          {
            type: 'piecewise',//分段标签
            min: 0,
            max: 10,
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
            // type: 'continuous',
            min: 0,
            max: this.max,
            realtime: true,
            precision: 3,
            bottom: 30,
            seriesIndex: 1,
            calculable: true,
            inRange: {
              color: ['#fff', colorList[this.chooseTheme]]
            },
          }
        ],
        series: [
          {
            name: 'stations',
            type: 'scatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
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
            type: "map",  //类型map
            name: 'Station',
            geoIndex: 0,
            label: {  //地图显示的地点名
              show: true,
              color: "#fff",
              fontSize: 16,
            },
            data: mapData,
          }
        ]
      })
    },
    radioChange(item) {
      this.chooseTheme = item.target.value
      this.getData();
    },
    resizeChart() {
      this.myChart.getDom().style.width = this.$refs.stationCol.$el.offsetWidth + 'px';
      this.myChart.resize();
    },
  }
}
</script>

<style scoped>
#chartPer {
  height: calc(100vh - 60px - 30px - 48px - 4px);
}

</style>