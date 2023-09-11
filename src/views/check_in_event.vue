<template>
  <div class="check_in_outer">
    <div class="check_in_title">
      <p class="name">
        今日打卡事件
      </p>
    </div>
    <div class="total_count">
      <a class="title">今日打卡总人数：</a>
      <a class="value">{{ num }}</a>
    </div>
    <ul class="infinite-list" style="list-style:none" v-if="num!=0">
      <li v-for="(item,index) in items" :key="index" class="check_in_list">
        <div class="dynamic_card">
          <div class="infor_container">
            <p class="first-infor">
              <a class="person_name">{{ item.name }}</a>
              <a class="time">{{ item.time }}</a>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import tapConfig from '../config/tap_config.vue'
import tapEvent from './tap_event.vue'
import axios from 'axios'
export default {
  name: 'checkInEvent',
  data () {
    return {
      tapList: tapConfig.tapList,
      webSocket: null,
      count: 6,
      num: 0,
      items: []
    }
  },
  methods: {
    getMessage () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const startTime = new Date(date + ' 00:00:00').getTime()
      const endTime = new Date(date + ' 23:59:59').getTime()
      axios.post('/api/structure/room/query', 'selab01', {
        headers: {
          'Content-Type': 'application/text'
        }
      }).then(res => {
        that.num = res.data.data.signed_in_count
      }).catch(err => {
        console.log(err)
      })
      axios.post('/api/perceptionEvent/sequence/query',
        {
          eventList: ['Sign_In'],
          objectId: [],
          location: [],
          timeRange: {
            startTime: startTime / 1000,
            endTime: endTime / 1000
          },
          count: that.count
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          this.items = []
          for (let i = 0; i < that.count; i++) {
            const temp = {
              name: null,
              time: null
            }
            const date = new Date(res.data.data[i].timestamp * 1000)
            const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            temp.time = h + m + s
            temp.name = res.data.data[i].eventData.objectId
            that.items.push(temp)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshData () {
      const that = this
      const today = new Date()
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
      const time = new Date(date + ' 24:00:00').getTime() - Date.parse(today) + 1000
      setTimeout(function () {
        that.getMessage()
        that.refreshData()
      }, time)
    },
    check_webSocket () {
      if ('WebSocket' in window) {
        // 连接WebSocket节点
        this.webSocket = new WebSocket('ws://10.176.34.91:9310/connectWebSocket/001')
      } else {
        alert('Not support websocket')
      }
    },
    setSocket () {
      const that = this
      // 连接发生错误的回调方法
      this.webSocket.onerror = function () {
        console.log('error')
      }
      // 连接成功建立的回调方法
      this.webSocket.onopen = function () {
        console.log('open')
        that.getMessage()
      }
      // 接收到消息的回调方法
      this.webSocket.onmessage = function (event) {
        const appData = JSON.parse(event.data)
        if (appData.eventIdentify.name === 'Sign_In') {
          const date = new Date(appData.timestamp * 1000)
          const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
          const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
          const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
          that.num = parseInt(that.num) + 1
          const temp = {
            name: appData.eventData.objectId,
            time: h + m + s
          }
          if (that.items.length >= that.count) {
            that.items.shift()
          }
          that.items.push(temp)
        } else if (Object.prototype.hasOwnProperty.call(that.tapList, appData.eventIdentify.name)) {
          tapEvent.methods.getTapTime(appData)
        }
      }
      // 连接关闭的回调方法
      this.webSocket.onclose = function () {
        console.log('connect close')
      }
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        console.log('window close')
        that.webSocket.close()
      }
    }
  },
  mounted () {
    this.getMessage()
    this.refreshData()
    this.check_webSocket()
    this.setSocket()
  },
  created () { }
}
</script>

<style>
.check_in_outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.check_in_title {
  height: calc(1rem + 10px);
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 5px;
}

.person_name,
.time {
  word-wrap: break-word;
  white-space: normal;
  font-weight: 500;
  font-size: 1rem;
  color: #d3d4e3;
}

.time {
  margin-left: auto;
}

.check_in_list {
  height: 20%;
  border-radius: 5px;
  border: 1px #81b3ec solid;
  box-sizing: border-box;
  background-color: transparent;
}

.total_count {
  font-weight: 500;
  font-size: 1rem;
  margin-left: auto;
  margin-right: 15px;
  height: 10%;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
