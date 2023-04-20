<template>
  <a-row id='lda-row'>
    <a-col ref='stationCol' :span="14">
      <div :id="'chartLDA'" class="chart-nyc"></div>
    </a-col>
    <a-col :span="10" style="padding-left: 25px;">
      <a-row style="padding-bottom: 20px;">
        <div class="introduce" :style="{margin: 0}">
          选择模型
        </div>
        <br/>
        <div>
          <a-radio-group :value="checkType" button-style="solid" @change="radioTypeChange">
            <a-radio-button value="">正常</a-radio-button>
            <a-radio-button value="out_">无POI</a-radio-button>
          </a-radio-group>
        </div>
      </a-row>

      <a-row>
        <div class="introduce" :style="{margin: 0}">
          选择主题
        </div>
        <br/>
        <a-radio-group :value="chooseIndex" @change="radioChange">
          <!--          <a-tooltip v-for="(item, index) in topicList" :placement="index < 4 ? 'top' : 'bottom'"-->
          <!--                     :title="item.label" :key="item.value" color="#eff6f5">-->
          <a-radio v-for="(item, index) in TopicList" :key="index" :value="index">Topic {{ index }}</a-radio>
          <!--          </a-tooltip>-->
        </a-radio-group>
      </a-row>
      <!--      <a-row>-->
      <!--        <div :style="{ borderBottom: '1px solid #E9E9E9', margin: '20px 0 10px 0', padding: '3px 0' }">-->
      <!--          站点介绍-->
      <!--        </div>-->
      <!--        <a-descriptions :title="description.title" class="card-box">-->
      <!--          <a-descriptions-item >{{ description.value }}</a-descriptions-item>-->
      <!--        </a-descriptions>-->
      <!--      </a-row>-->
    </a-col>
  </a-row>
</template>

<script>
import {getLDAHeatMap} from "@/network/lda";
import {objOfValueToArr} from "@/common/resFilter";

let pieces = [
  {label: 'P1 Station', value: 0, color: '#5470c6'},
  {label: 'P2 Station', value: 1, color: '#3ba272'},
  {label: 'P3 Station', value: 2, color: '#fc8452'},
  {label: 'P4 Station', value: 3, color: '#ea7ccc'},
  {label: 'P5 Station', value: 4, color: '#fac858'},
  {label: 'P6 Station', value: 5, color: '#73c0de'},
  {label: 'P7 Station', value: 6, color: '#9a60b4'},
]
const visual1 = {
  type: 'piecewise',//分段标签
  min: 1,
  max: 7,
  orient: 'horizontal',
  left: 'center',
  top: '1%',
  // textGap: 5,
  textStyle: {
    fontSize: 11,
  },
  itemSymbol: 'circle',
  pieces: pieces,
}
const visual2 = {
  type: 'piecewise',//分段标签
  orient: 'horizontal',
  left: 'center',
  top: '1%',
  textStyle: {
    fontSize: 11,
  },
  itemSymbol: 'circle',
  pieces: [{label: '无POI', value: 99, color: '#120742'}],
}
export default {
  name: "LDAMap",
  data() {
    return {
      myChart: null,
      TopicList: [],
      chooseIndex: 0,
      checkType: '',
      isMounted: false,
      // topicList: [
      //   {label: 'Topic 1', value: 0,},
      //   {label: 'Topic 2', value: 1,},
      //   {label: 'Topic 3', value: 2,},
      //   {label: 'Topic 4', value: 3,},
      //   {label: 'Topic 5', value: 4,},
      //   {label: 'Topic 6', value: 5,},
      //   {label: 'Topic 7', value: 6,},
      //   {label: 'Topic 8', value: 7,},
      // ]
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
      this.initMap();
      this.getData('');
      window.addEventListener("resize", this.resizeChart);
      this.isMounted = true
    })
  },
  deactivated() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    initMap() {
      this.myChart = this.$echarts.init(document.getElementById('chartLDA'))

      const hours = Array.from({length: 24}, (v, k) => k);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


      const option = {
        legend: {
          data: ['stations'],
          top: 130,
          left: 33,
        },
        tooltip: false,

        xAxis: {
          type: 'category',
          data: hours,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: days,
          splitArea: {
            show: true
          }
        },
        visualMap: visual1,
      };
      this.myChart.setOption(option);
    },
    getData(type) {
      let map = {
        'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3, 'fri': 4, 'sat': 5, 'sun': 6
      }
      getLDAHeatMap(type).then(res => {
        this.TopicList = objOfValueToArr(res.data.data).map(item => {
          let temp = objOfValueToArr(item)
          return temp.map(word => {
            return [parseInt(word.slice(3).split('p')[0]),
              map[word.slice(0, 3)], parseInt(word.slice(3).split('p')[1] || 99)]
          })
        })
        console.log(this.TopicList)
        this.drawStation();
      })
    },
    drawStation() {
      let series = [{
        name: 'LDAHeatmap',
        type: 'heatmap',
        data: this.TopicList[this.chooseIndex],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]

      this.myChart.setOption({series})
    },
    radioChange(item) {
      // console.log(item.target.value)
      this.chooseIndex = item.target.value
      this.drawStation();
    },
    radioTypeChange(item) {
      this.checkType = item.target.value
      this.chooseIndex = 0
      this.getData(this.checkType);
      let visualMap = this.checkType === '' ? visual1 : visual2;
      this.myChart.setOption({visualMap})
    },
    resizeChart() {
      this.myChart.getDom().style.width = this.$refs.stationCol.$el.offsetWidth + 'px';
      this.myChart.resize();
    },
  }
}
</script>

<style scoped>
#chartLDA {
  height: calc(100vh - 60px - 30px - 48px - 4px);
}

.ant-radio-wrapper {
  margin: 0 10px 5px 0;
}

</style>