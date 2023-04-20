<template>
  <a-row id='station-row'>
    <a-col ref='stationCol' :span="15">
      <div :id="'chartNYC'" class="chart-nyc"></div>
    </a-col>
    <a-col :span="9" style="padding-left: 20px; padding-right: 10px">
      <a-row>
        <div class="introduce" :style="{margin: '0 0 20px 0'}">
          基本介绍
        </div>
        <a-collapse v-model="activeKey" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" style="color: #384d9c"/>
          </template>
          <a-collapse-panel v-for="(item, index) in collapseList" :key="index + ''" :header="item.title"
                            :style="customStyle">
            <p>{{ item.value }}</p>
          </a-collapse-panel>
        </a-collapse>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import nycGEO from '@/assets/geo/nyc_geo_bor.json'
import {getStationsData} from '@/network/site'
import {objOfValueToArr} from '@/common/resFilter'

export default {
  name: "NYCMap",
  data() {
    return {
      myChart: null,
      NYCSeries:[],
      stationList: [],
      activeKey: ['0', '1', '2'],
      collapseList: [
        {title: '数据集', value: '研究样本中的600个自行车共享站主要位于曼哈顿地区、北布鲁克林地区和皇后区西部。'},
        {title: '空间单位', value: '本研究将邮政编码列表区（ZCTA）作为基本空间单位，研究中的共享单车站点总共分布在62个ZCTA。'}
        // {title: '', value: '本研究将邮政编码列表区（ZCTA）作为基本空间单位，研究中的共享单车站点总共分布在64个ZCTA'}
      ],
      customStyle: 'background: #eff1f4;border-radius: 4px;padding-bottom: 10px;border: 0;overflow: hidden',
    }
  },
  mounted() {
    this.initMap();
    this.getData();
  },
  methods: {
    initMap() {
      this.$echarts.registerMap('NYC', nycGEO);
      this.myChart = this.$echarts.init(document.getElementById('chartNYC'))

      this.NYCSeries = [{
        type: "map",  //类型map
        geoIndex: 0,
        label: {  //地图显示的地点名
          show: true,
          color: "#fff",
          fontSize: 16,
        },
        data:[
            {name: 'Brooklyn', value: 0},
            {name: 'Bronx', value: 1},
            {name: 'Manhattan', value: 2},
            {name: 'Queens', value: 3},
          ],
      }]

      let pieces = [
        {label: 'Brooklyn', value: 0, color: '#a3a4d7'},
        {label: 'Bronx', value: 1, color: '#d5a4b0'},
        {label: 'Manhattan', value: 2, color: '#dcdcac'},
        {label: 'Queens', value: 3, color: '#a7d2b5'},
      ]
      const option = {
        //数据映射
        visualMap: {
          type: "piecewise",//分段标签
          min: 0,
          max: 4,
          left: 30,
          top: 30,
          orient: "vertical",//组件竖直放置
          align: "left",//色块在左
          // textGap: 14,//文字主体之间的距离
          itemSymbol: "circle",//右下角映射组件使用圆点形状
          show: true,
          seriesIndex: 0,//指定取哪个系列的数据(series.data)，若不设置则会影响图上标点颜色设置。
          pieces: pieces,
        },
        legend: {
          data: ['stations'],
          top: 130,
          left: 33,
        },
        tooltip: false,
        // tooltip: {
        //   show: true
        // },
        geo: {
          name: 'NYC',
          nameProperty: 'borough',
          // type: 'map',
          roam: true,
          map: 'NYC',
          show: true,
          zoom: 1.5,
          center: [
            -73.924698693518843,
            40.747598586622799
          ],
          itemStyle: {
            borderColor: "#7f7f7f",  //地图区域的边框
          },
          emphasis: {
            itemStyle: {
              areaColor: '#efe7c5',
            },
            label: {
              show: false,
            },
          },
        },
        series: this.NYCSeries,
      };
      this.myChart.setOption(option);
    },
    getData() {
      getStationsData().then(res =>{
        this.stationList = objOfValueToArr(res.data.data)
        this.drawStation();
      })
    },
    drawStation() {
      let convertData = this.stationList.map(item => {
          return {
            name: item.id,
            value: [item.sLongitude, item.sLatitude]
          };
      })

      this.NYCSeries = this.NYCSeries.slice(0, 1)
      this.NYCSeries.push({
        name: 'stations',
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        symbolSize: 5,
        itemStyle: {
          normal: {
            color: '#dd263b'
          }
        },
        data: convertData,
        zlevel: 1,
      })
      this.myChart.setOption({series: this.NYCSeries})
    }
  }
}
</script>

<style scoped>
.chart-nyc {
  width: 700px;
  height: calc(100vh - 60px - 30px - 48px - 4px);
}
.ant-collapse-panel {

}
</style>