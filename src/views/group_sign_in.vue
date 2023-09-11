<template>
  <div class="group_outer">
    <div class="groupchart" id="groupchart"></div>
    <el-row class="choose_group">
      <el-radio-group v-model="group" class="radio_group" @change="change">
        <el-radio v-for="(item, key) in yData" :key="item.name" :label="key" class="radio_item">{{item.name}}</el-radio>
      </el-radio-group>
    </el-row>
    <el-row class="choose_gragh">
      <el-radio-group v-model="gragh" class="radio_gragh" @change="change">
        <el-radio label="bar" class="gragh_item">人数统计</el-radio>
        <el-radio label="line" class="gragh_item">出勤率统计</el-radio>
      </el-radio-group>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'GroupGraphVue',
  data () {
    return {
      timer: null,
      week: [],
      type: null,
      it: null,
      fresh: null,
      groupChart: {},
      gragh: 'bar',
      group: 'AI',
      xData: [], // 横坐标
      yData: {
        AI: {
          name: 'AI系统工程',
          init: [14, 14, 14, 14, 14],
          actual: []
        },
        cloud_native: {
          name: '云原生组',
          init: [17, 17, 17, 17, 17],
          actual: []
        },
        anthropomorphic: {
          name: '人机物组',
          init: [14, 14, 14, 14, 14],
          actual: []
        },
        atlas: {
          name: '图谱组',
          init: [17, 17, 17, 17, 17],
          actual: []
        },
        robot: {
          name: '机器人组',
          init: [9, 9, 9, 9, 9],
          actual: []
        },
        program_analysis: {
          name: '程序分析组',
          init: [9, 9, 9, 9, 9],
          actual: []
        },
        supply_chain: {
          name: '软件供应链组',
          init: [11, 11, 11, 11, 11],
          actual: []
        }
      }
    }
  },
  methods: {
    getList () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const startTime = new Date(date + ' 00:00:00').getTime()
      const endTime = new Date(date + ' 23:59:59').getTime()
      const oneDay = 86400000
      const day = today.getDay()
      const listLength = Object.keys(that.yData).length
      let count = 0
      switch (day) {
        case 1:
          that.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [3, 4, 5, 6, 7]
          break
        case 2:
          that.xData = ['Tue', 'Wed', 'Thur', 'Fri', 'Mon']
          this.week = [1, 4, 5, 6, 7]
          break
        case 3:
          that.xData = ['Wed', 'Thur', 'Fri', 'Mon', 'Tue']
          this.week = [1, 2, 5, 6, 7]
          break
        case 4:
          that.xData = ['Thur', 'Fri', 'Mon', 'Tue', 'Wed']
          this.week = [1, 2, 3, 6, 7]
          break
        case 5:
          that.xData = ['Fri', 'Mon', 'Tue', 'Wed', 'Thur']
          this.week = [1, 2, 3, 4, 7]
          break
        case 6:
          that.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [1, 2, 3, 4, 5]
          break
        case 0:
          that.xData = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri']
          this.week = [2, 3, 4, 5, 6]
          break
      }
      for (const groupName in that.yData) {
        const groupList = {}
        for (const i in this.week) {
          axios.post('/api/perceptionEvent/signInCount/query',
            {
              timeRange: {
                startTime: (startTime - oneDay * that.week[i]) / 1000,
                endTime: (endTime - oneDay * that.week[i]) / 1000
              },
              groupName: that.yData[groupName].name
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
              groupList[i] = res.data.data
              if (Object.keys(groupList).length === that.week.length) { // 该组查询完毕
                count++
                const list = []
                for (let item = that.week.length - 1; item >= 0; item--) {
                  list.push(groupList[item])
                }
                that.yData[groupName].actual = list
                if (count === listLength) { // 所有组查询完毕
                  that.it.next()
                  if (that.fresh != null) {
                    that.fresh.next()
                  }
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    initEcharts () {
      const option = {
        title: {
          text: this.yData[this.group].name + '打卡统计',
          textStyle: {
            color: '#ededf2',
            fontWeight: '600',
            fontSize: 17
          },
          x: 'center',
          y: 'top'
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
        grid: {
          show: false,
          top: '28%',
          right: '5%',
          bottom: '20%',
          left: '10%'
        },
        series: [
          {
            name: '实到人数',
            type: 'bar',
            data: this.yData[this.group].actual,
            barGap: '20%',
            barCategoryGap: '40%',
            backgroundStyle: {
              color: 'rgb(100, 140, 241)'
            }
          },
          {
            name: '应到人数',
            data: this.yData[this.group].init,
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
      this.groupChart = echarts.init(document.getElementById('groupchart'))
      this.groupChart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        this.groupChart.resize()
      })
      const that = this
      const groups = Object.keys(this.yData)
      const types = ['bar', 'line']
      let index = 0
      let typeIndex = 0
      this.timer = setInterval(() => {
        that.group = groups[index]
        that.gragh = types[typeIndex]
        that.change()
        typeIndex++
        if (typeIndex === types.length) {
          typeIndex = 0
          index++
        }
        if (index === groups.length) {
          index = 0
        }
      }, 7000)
    },
    refreshData () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const time = new Date(date + ' 24:00:00').getTime() - Date.parse(today) + 1000
      setTimeout(function () {
        that.fresh = that.runRefresh()
        that.fresh.next()
        that.refreshData()
      }, time)
    },
    change () {
      const that = this
      const op = this.groupChart.getOption()
      op.xAxis[0].data = that.xData
      if (this.gragh === 'line') {
        if (that.yData[that.group].actual.length === 0) {
          op.yAxis[0].min = 0
          op.yAxis[0].max = 100
        }
        op.title[0].text = this.yData[this.group].name + '出勤率统计'
        op.series = [
          {
            name: '出勤率',
            type: 'line',
            data: that.yData[that.group].actual.map(function (item, index) {
              return (item / that.yData[that.group].init[index]).toFixed(4) * 100
            }),
            color: 'rgb(100, 140, 241)'
          }
        ]
      } else {
        delete op.yAxis[0].min
        delete op.yAxis[0].max
        op.title[0].text = this.yData[this.group].name + '打卡统计'
        op.series = [
          {
            name: '实到人数',
            type: 'bar',
            data: this.yData[this.group].actual,
            barGap: '20%',
            barCategoryGap: '40%',
            backgroundStyle: {
              color: 'rgb(100, 140, 241)'
            }
          },
          {
            name: '应到人数',
            data: this.yData[this.group].init,
            type: 'bar',
            backgroundStyle: {
              color: 'rgb(100, 140, 241)'
            }
          }
        ]
      }
      this.groupChart.setOption(op, true)
    },
    * runMounted () {
      yield this.getList()
      yield this.initEcharts()
    },
    * runRefresh () {
      yield this.getList()
      yield this.change()
    }
  },
  mounted () {
    this.it = this.runMounted()
    this.it.next()
    this.refreshData()
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style>
.group_outer {
  width: 100%;
  height: 100%;
  border: 1px #81b3ec solid;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.groupchart {
  width: 100%;
  height: 60%;
  margin-top: 4%;
}

.choose_group {
  width: 100%;
  height: 27%;
  margin-bottom: 2%;
  margin-top: 1%;
}
.choose_gragh {
  width: 100%;
  height: 7%;
  margin-bottom: 3%;
}

.radio_group,
.radio_gragh {
  height: 100%;
  margin: 0 5%;
  display: flex;
  flex-direction: row;
  align-items: left;
  flex-wrap: wrap;
}

.radio_item {
  height: 10%;
  width: 33.33%;
}

.el-radio {
  margin-right: 0;
}

.gragh_item {
  height: 20%;
  width: 50%;
}

.el-radio__label {
  font-size: 0.9rem;
  color: #cfcfda;
}
</style>
