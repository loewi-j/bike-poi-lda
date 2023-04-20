<template>
  <a-row id='station-row'>
    <a-col ref='stationCol' :span="14">
      <div id='chartTime' ref='chartTime'></div>
    </a-col>
    <a-col :span="10" style="padding-left: 25px">
      <a-row>
        <div class="introduce" :style="{margin: 0}">
          选择站点类别
        </div>
        <br/>
        <a-radio-group :value="chooseIndex" @change="radioChange">
          <a-tooltip v-for="(item, index) in descriptionList" :placement="index < 4 ? 'top' : 'bottom'"
                     :title="item.title" :key="item.key" color="#eff6f5">
            <a-radio :value="index">{{ item.key }}</a-radio>
          </a-tooltip>
        </a-radio-group>
      </a-row>
      <a-row>
        <div class="introduce">
          站点介绍
        </div>
        <a-descriptions :title="description.title" class="card-box">
          <a-descriptions-item >{{ description.value }}</a-descriptions-item>
        </a-descriptions>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import {getTimeData} from "@/network/bike";
import {objOfValueToArr} from "@/common/resFilter";

export default {
  name: "StationTime",
  computed: {
    chartWidth() {
      if (this.isMounted) {
        return this.$refs.stationCol.$el.offsetWidth + 'px'
      }
    },
    description() {
      return this.descriptionList[this.chooseIndex];
    }
  },
  data() {
    return {
      myChart: null,
      StationSeries: [],
      weekList: [],
      workList: [],
      isMounted: false,
      descriptionList: [
        {title: '夜晚活动类站点', key: 'P1 Station', value: 'P1 Station'},
        {title: '教育类站点', key: 'P2 Station', value: 'P2 Station'},
        {title: '住宅类站点', key: 'P3 Station', value: 'P3 Station'},
        {title: '交通类站点', key: 'P4 Station', value: 'P4 Station'},
        {title: '饮食类站点', key: 'P5 Station', value: 'P5 Station'},
        {title: '户外活动类站点', key: 'P6 Station', value: 'P6 Station'},
        {title: '购物类站点', key: 'P7 Station', value: 'P7 Station'},
      ],
      chooseIndex: 0,
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
      let echart = this.$refs.chartTime;
      this.myChart = this.$echarts.init(echart)
      let xAxis = Array.from({length: 24}, (v, k) => k);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['weekdays Station', 'weekends Station']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
      };
      this.myChart.setOption(option);
    },
    getData() {
      getTimeData().then(res => {
        this.weekList = objOfValueToArr(res.data.week).map(item => {
          return objOfValueToArr(item)
        })
        this.workList = objOfValueToArr(res.data.work).map(item => {
          return objOfValueToArr(item)
        })
        this.drawStation();
      })
    },
    drawStation() {
      let colorList = [
        ['#5470c6', '#2c3c68'],
        ['#3ba272', '#225e42'],
        ['#fc8452', '#a15433'],
        ['#ea7ccc', '#8e4a7b'],
        ['#fac858', '#977835'],
        ['#73c0de', '#3e6979'],
        ['#9a60b4', '#5a386a'],
      ]

      this.StationSeries = [
        {
          name: 'weekends Station',
          type: 'line',
          color: colorList[this.chooseIndex][0],
          data: this.weekList[this.chooseIndex]
        },
        {
          name: 'weekdays Station',
          type: 'line',
          color: colorList[this.chooseIndex][1],
          data: this.workList[this.chooseIndex]
        },
      ]
      this.myChart.setOption({series: this.StationSeries})
    },
    radioChange(item) {
      // console.log(item.target.value)
      this.chooseIndex = item.target.value
      this.drawStation();
    },
    resizeChart() {
      this.myChart.getDom().style.width = this.$refs.stationCol.$el.offsetWidth + 'px';
      this.myChart.resize();
    },
  }
}
</script>

<style scoped>
#chartTime {
  /*width: 85%;*/
  height: calc(100vh - 60px - 30px - 48px - 4px);
}

.ant-radio-wrapper {
  margin: 0 10px 5px 0;
}

.card-box {
  overflow-y: scroll;
  height: calc(100vh - 60px - 30px - 48px - 4px - 70px - 28px - 67px);
  background-color: #eff1f4;
  border-radius: 5px;
  padding: 10px;
  /*border: #42b983 solid 1px;*/
}
.card-box::-webkit-scrollbar {
  display: none;
}

</style>
<style>
.ant-descriptions-title {
  color: #666 !important;
  letter-spacing: 1px;
}
</style>