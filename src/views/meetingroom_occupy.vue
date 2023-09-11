<template>
  <div class="occupy_container">
    <div id="occupyChart" class="charts" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      occupyChart: null,
      week: [1, 2, 3, 4, 5],
      it: null,
      occupy: {},
      occupyList: [],
      yData: [],
      head: '',
      tail: ''
    }
  },
  created () { },
  mounted () {
    this.refreshData()
    this.it = this.runMounted()
    this.it.next()
  },
  methods: {
    refreshData () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const time = new Date(date + ' 24:00:00').getTime() - Date.parse(today) + 1000
      setTimeout(function () {
        that.it = null
        that.it = this.runMounted()
        that.it.next()
      }, time)
    },
    * runMounted () {
      yield this.getList()
      yield this.requestChartData()
    },
    getOption (chartData) {
      const option = {
        title: {
          text: '会议室2014-2占用情况',
          textStyle: {
            color: '#ededf2',
            fontWeight: '600',
            fontSize: 17
          },
          x: 'center',
          y: 'top'
        },
        grid: { left: '2%', right: '5%', bottom: '12%', top: '15%', containLabel: true },
        tooltip: {
          show: true,
          trigger: 'item',
          padding: 3,
          axisPointer: {
            type: 'cross',
            snap: true,
            label: {
              backgroundColor: '#7294FD',
              formatter: function (value) {
                if (value.axisDimension === 'y') {
                  return value.value
                } else {
                  const date = new Date(value.value)
                  const H = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
                  const M = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                  const texts = H + M
                  return texts
                }
              }
            }
          },
          formatter: function (params) {
            const data = params.data
            return data.name
          }
        },
        xAxis: [{
          type: 'time',
          min: this.head,
          max: this.tail,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(84, 112, 198, 0.8)'
            }
          },
          axisLabel: {
            color: '#ffffff',
            rotate: '30',
            formatter: function (value) {
              const date = new Date(value)
              const H = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
              const M = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
              const texts = H + M
              return texts
            }
          },
          axisTick: {
            alignWithLabel: true // 保证刻度线和标签对齐
          }
        }],
        yAxis: [{
          data: chartData.yData,
          axisLabel: { color: '#ffffff' },
          axisLine: {
            lineStyle: {
              color: '#ffffff' // 更改坐标轴颜色
            }
          },
          axisTick: {
            alignWithLabel: true // 保证刻度线和标签对齐
          }
        }],
        // dataZoom: [{}],
        dataZoom: [{
          type: 'slider',
          bottom: '5%',
          height: '12px'
        }],
        // { type: 'inside', bottom: '2%' } // 内置于坐标系中，用户在坐标系上通过鼠标拖拽、鼠标滚轮、手指滑动（触屏上）来缩放或漫游坐标系
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              // const data = chartData.listData[api.value(0)]
              const start = api.coord([api.value(1), 5 - api.value(0)])
              const end = api.coord([api.value(2), 5 - api.value(0)])
              const height = api.size([0, 1])[1] * 0.5
              return {
                type: 'rect',
                shape: echarts.graphic.clipRectByRect(
                  {
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                  },
                  {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                  }
                ),
                style: api.style({
                  // text: data.name,
                  fill: 'rgb(84, 112, 198)', // 背景色
                  stroke: 'white', // 边框颜色
                  lineWidth: 1, // 边框宽度
                  fontWeight: 'bold',
                  fontSize: '12',
                  opacity: 0.9
                })
              }
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: chartData.listData,
            label: {
              show: true, // 开启显示
              // position: 'top', // 上方显示
              position: 'inside', // 内部显示
              textStyle: {
                color: 'green',
                fontSize: 15
              }
            }
          }
        ]
      }
      return option
    },
    getList () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const startTime = new Date(date + ' 09:00:00').getTime()
      this.head = new Date(date + ' 09:00:00')
      const endTime = new Date(date + ' 21:00:00').getTime()
      this.tail = new Date(date + ' 21:00:00')
      const oneDay = 86400000
      const day = today.getDay()
      switch (day) {
        case 1:
          this.yData = ['Wed', 'Thur', 'Fri', 'Sat', 'Sun']
          break
        case 2:
          this.yData = ['Thur', 'Fri', 'Sat', 'Sun', 'Mon']
          break
        case 3:
          this.yData = ['Fri', 'Sat', 'Sun', 'Mon', 'Tues']
          break
        case 4:
          this.yData = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed']
          break
        case 5:
          this.yData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur']
          break
        case 6:
          this.yData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          break
        case 0:
          this.yData = ['Tue', 'Wed', 'Thur', 'Fri', 'Sat']
          break
      }
      let count = 0
      for (const i in that.week) {
        const groupList = []
        axios.post('/api/perceptionEvent/sequence/query', {
          eventList: ['Person_Entry', 'Person_Leave'],
          objectId: [],
          location: ['meetingroom02'],
          timeRange: {
            startTime: (startTime - oneDay * that.week[i]) / 1000,
            endTime: (endTime - oneDay * that.week[i]) / 1000
          },
          count: 0
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          const result = res.data.data
          if (result.length !== 0) {
            if (result[0].eventIdentify.name === 'Person_Entry') { // 第一段时间从Person_Entry开始
              let start = result[0].timestamp * 1000
              var end = null
              for (let item = 1; item < result.length; item++) {
                if (result[item].eventIdentify.name === 'Person_Entry' && start == null) {
                  start = result[item].timestamp * 1000
                }
                if (result[item].eventIdentify.name === 'Person_Leave') {
                  end = result[item].timestamp * 1000
                  let temp = new Date(start)
                  let H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                  let M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                  let S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                  const tempStart = new Date(date + ' ' + H + M + ':' + S)
                  const s = H + M
                  temp = new Date(end)
                  H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                  M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                  S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                  const tempEnd = new Date(date + ' ' + H + M + ':' + S)
                  const e = H + M
                  if (s !== e) {
                    groupList.push({
                      name: s + '~' + e,
                      value: [that.week[i], tempStart, tempEnd],
                      startTime: start,
                      endTime: end
                    })
                  }
                  start = null
                  end = null
                }
              }
              if (end === null && start !== null) {
                end = endTime - oneDay * that.week[i]
                let temp = new Date(start)
                let H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                let M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                let S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                const tempStart = new Date(date + ' ' + H + M + ':' + S)
                const s = H + M
                temp = new Date(end)
                H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                const tempEnd = new Date(date + ' ' + H + M + ':' + S)
                const e = H + M
                if (s !== e) {
                  groupList.push({
                    name: s + '~' + e,
                    value: [that.week[i], tempStart, tempEnd],
                    startTime: start,
                    endTime: end
                  })
                }
                start = null
                end = null
              }
            } else if (result[0].eventIdentify.name === 'Person_Leave') { // 第一段时间从9:00开始
              let start = (startTime - oneDay * that.week[i])
              for (let item = 0; item < result.length; item++) {
                if (result[item].eventIdentify.name === 'Person_Entry' && start == null) {
                  start = result[item].timestamp * 1000
                }
                if (result[item].eventIdentify.name === 'Person_Leave') {
                  end = result[item].timestamp * 1000
                  let temp = new Date(start)
                  let H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                  let M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                  let S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                  const tempStart = new Date(date + ' ' + H + M + ':' + S)
                  const s = H + M
                  temp = new Date(end)
                  H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                  M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                  S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                  const tempEnd = new Date(date + ' ' + H + M + ':' + S)
                  const e = H + M
                  if (s !== e) {
                    groupList.push({
                      name: s + '~' + e,
                      value: [that.week[i], tempStart, tempEnd],
                      startTime: start,
                      endTime: end
                    })
                  }
                  start = null
                  end = null
                }
              }
              if (end === null && start !== null) {
                end = endTime - oneDay * that.week[i]
                let temp = new Date(start)
                let H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                let M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                let S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                const tempStart = new Date(date + ' ' + H + M + ':' + S)
                const s = H + M
                temp = new Date(end)
                H = temp.getHours() < 10 ? '0' + temp.getHours() + ':' : temp.getHours() + ':'
                M = temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()
                S = temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()
                const tempEnd = new Date(date + ' ' + H + M + ':' + S)
                const e = H + M
                if (s !== e) {
                  groupList.push({
                    name: s + '~' + e,
                    value: [that.week[i], tempStart, tempEnd],
                    startTime: start,
                    endTime: end
                  })
                }
                start = null
                end = null
              }
            }
          }
          // this.occupy[i] = groupList
          this.occupyList.push(...groupList)
          count++
          // const list = Object.values(this.occupy)
          if (count === this.week.length) {
            // this.occupy = []
            // this.occupy = [...list[0], ...list[1], ...list[2], ...list[3], ...list[4]]
            setTimeout(() => {
              console.log(this.occupyList)
              this.it.next()
            }, 2000)
          }
        })
      }
    },
    requestChartData () {
      const that = this
      // console.log(this.occupyList)
      // 间隔一致，保证开始结束时间都在x轴点上
      const chartData = {
        yData: this.yData,
        listData: this.occupyList
      }
      this.occupyChart = echarts.init(document.getElementById('occupyChart'))
      this.occupyChart.showLoading()
      setTimeout(() => {
        this.occupyChart.setOption(this.getOption(chartData), true)
        window.addEventListener('resize', () => {
          that.occupyChart.resize()
        })
        this.occupyChart.hideLoading()
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.occupy_container {
  width: 100%;
  height: 100%;
}

.charts {
  width: 100%;
  height: 96%;
  margin-top: 4%;
}
</style>
