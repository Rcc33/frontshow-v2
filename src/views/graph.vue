<template>
  <div class="gragh_outer">
    <div class="mychart" id="mychart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'graphVue',
  data () {
    return {
      it: null,
      week: [],
      myChart: {},
      xData: [], // 横坐标
      yInitDate: [85, 85, 85, 85, 85], // 应到人数
      yData: [] // 实到人数
    }
  },
  methods: {
    getDate () {
      const that = this
      const today = new Date()
      const day = today.getDay()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const startTime = new Date(date + ' 00:00:00').getTime()
      const endTime = new Date(date + ' 23:59:59').getTime()
      const oneDay = 86400000
      const groupList = {}
      switch (day) {
        case 1:
          this.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [3, 4, 5, 6, 7]
          break
        case 2:
          this.xData = ['Tue', 'Wed', 'Thur', 'Fri', 'Mon']
          this.week = [1, 4, 5, 6, 7]
          break
        case 3:
          this.xData = ['Wed', 'Thur', 'Fri', 'Mon', 'Tue']
          this.week = [1, 2, 5, 6, 7]
          break
        case 4:
          this.xData = ['Thur', 'Fri', 'Mon', 'Tue', 'Wed']
          this.week = [1, 2, 3, 6, 7]
          break
        case 5:
          this.xData = ['Fri', 'Mon', 'Tue', 'Wed', 'Thur']
          this.week = [1, 2, 3, 4, 7]
          break
        case 6:
          this.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [1, 2, 3, 4, 5]
          break
        case 0:
          this.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [2, 3, 4, 5, 6]
          break
      }
      for (const i in this.week) {
        axios.post('/api/perceptionEvent/sequence/query',
          {
            eventList: ['Sign_In'],
            objectId: [],
            location: [],
            timeRange: {
              startTime: (startTime - oneDay * this.week[i]) / 1000,
              endTime: (endTime - oneDay * this.week[i]) / 1000
            },
            count: 0
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
            groupList[i] = res.data.data.length
            if (Object.keys(groupList).length === that.week.length) {
              const temp = []
              for (let item = that.week.length - 1; item >= 0; item--) {
                temp.push(groupList[item])
              }
              const op = that.myChart.getOption()
              op.series[0].data = temp
              op.xAxis[0].data = that.xData
              that.myChart.setOption(op, true)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    initEcharts () {
      const today = new Date()
      const day = today.getDay()
      switch (day) {
        case 1:
          this.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [3, 4, 5, 6, 7]
          break
        case 2:
          this.xData = ['Tue', 'Wed', 'Thur', 'Fri', 'Mon']
          this.week = [1, 4, 5, 6, 7]
          break
        case 3:
          this.xData = ['Wed', 'Thur', 'Fri', 'Mon', 'Tue']
          this.week = [1, 2, 5, 6, 7]
          break
        case 4:
          this.xData = ['Thur', 'Fri', 'Mon', 'Tue', 'Wed']
          this.week = [1, 2, 3, 6, 7]
          break
        case 5:
          this.xData = ['Fri', 'Mon', 'Tue', 'Wed', 'Thur']
          this.week = [1, 2, 3, 4, 7]
          break
        case 6:
          this.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [1, 2, 3, 4, 5]
          break
        case 0:
          this.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [2, 3, 4, 5, 6]
          break
      }
      const option = {
        title: {
          text: '本周实验室打卡统计',
          textStyle: {
            color: '#ededf2',
            fontWeight: '600',
            fontSize: 17
          },
          x: 'center',
          y: 'top'
        },
        grid: {
          show: false,
          top: '22%',
          right: '5%',
          bottom: '25%',
          left: '10%'
        },
        xAxis: {
          axisTick: {
            alignWithLabel: true // 保证刻度线和标签对齐
          },
          data: this.xData,
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            },
            fontSize: 13,
            margin: 15
          }
        },
        yAxis: {
          minInterval: 1,
          axisPointer: {
            snap: true
          },
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            },
            fontSize: 13,
            margin: 15
          }
        },
        series: [
          {
            name: '实到人数',
            type: 'bar',
            data: this.yData,
            barGap: '20%',
            barCategoryGap: '40%',
            backgroundStyle: {
              color: 'rgb(100, 140, 241)'
            }
          },
          {
            name: '应到人数',
            data: this.yInitDate,
            type: 'bar',
            backgroundStyle: {
              color: 'rgb(100, 140, 241)'
            }
          }
        ],
        legend: {
          data: [
            {
              name: '实到人数', // 强制设置图形为圆。
              textStyle: {
                color: '#ededf2'
              }
            },
            {
              name: '应到人数', // 强制设置图形为圆。
              textStyle: {
                color: '#ededf2'
              }
            }
          ],
          left: '75%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#7294FD'
            }
          }
        }
      }
      this.myChart = echarts.init(document.getElementById('mychart'))
      this.myChart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })
      const that = this
      setTimeout(function () {
        that.it.next()
      }, 1000)
    },
    refreshData () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const time = new Date(date + ' 24:00:00').getTime() - Date.parse(today) + 1000
      setTimeout(function () {
        that.getDate()
        that.refreshData()
      }, time)
    },
    * runMounted () {
      yield this.initEcharts()
      yield this.getDate()
    }
  },

  mounted () {
    this.it = this.runMounted()
    this.it.next()
    this.refreshData()
  }
}
</script>

<style>
.gragh_outer {
  width: 100%;
  height: 100%;
  border: 1px #81b3ec solid;
  box-sizing: border-box;
  border-radius: 10px;
}

.mychart {
  float: left;
  width: 100%;
  height: 100%;
  margin-top: 4%;
}
</style>
