<template>
  <div class="dynamic-container">
    <div class="name_title">
      <p class="name">
        环境事件
      </p>
    </div>
    <ul class="infinite-list" style="list-style:none">
      <li v-for="(item,index) in items" :key="index" class="event_list">
        <div class="dynamic_card">
          <div class="infor_container">
            <p class="first-infor">
              <a class="event_body">{{ item.time }} {{ item.event_type }}</a>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'environmentEvent',
  data () {
    return {
      timer: null,
      items: [],
      count: 5
    }
  },
  created () {
    this.getMethod()
  },
  mounted () {
    this.timer = setInterval(() => {
      this.getMethod()
    }, 5000)
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    getMethod () {
      const that = this
      const temp = that.TRANFORM.transform.eventType
      delete temp.Sign_In
      axios.post('/api/perceptionEvent/sequence/query', {
        eventList: Object.keys(temp),
        objectId: [],
        location: [],
        timeRange: null,
        count: that.count
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        that.items = []
        for (let i = 0; i < that.count; i++) {
          const temp = {
            event_type: null,
            time: null
            // location: null,
          }
          const date = new Date(res.data.data[i].timestamp * 1000)
          const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
          const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
          const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
          temp.time = h + m + s
          const location = that.TRANFORM.transform.location[res.data.data[i].eventData.location]
          const objectId = res.data.data[i].eventData.objectId
          const name = that.TRANFORM.transform.eventType[res.data.data[i].eventIdentify.name]
          const data = res.data.data[i].eventData.data[`${(Object.keys(res.data.data[i].eventData.data))[0]}`]
          if (res.data.data[i].eventIdentify.name === 'Person_Entry' || res.data.data[i].eventIdentify.name === 'Person_Leave') {
            temp.event_type = '有人' + name + location
          } else if (res.data.data[i].eventIdentify.name === 'Sign_In') {
            temp.event_type = objectId + name
          } else if (res.data.data[i].eventIdentify.name === 'Light_State') {
            temp.event_type = location + name + '：' + data + ' Lx'
          } else if (res.data.data[i].eventIdentify.name === 'Temperature_Change') {
            temp.event_type = location + name + '：' + data + ' ℃'
          } else if (res.data.data[i].eventIdentify.name === 'Humidity_Change') {
            temp.event_type = location + name + '：' + data + ' %rh'
          } else if (res.data.data[i].eventIdentify.name === 'People_Count') {
            temp.event_type = location + name + '：' + data + '人'
          } else {
            temp.event_type = location + name + '：' + data
          }
          that.items.push(temp)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
.dynamic-container {
  display: flex;
  flex-direction: column;
  height: 99.5%;
  width: 99.5%;
  overflow: hidden;
  border-radius: 10px;
  border: 3px #2d8cf7 solid;
  padding: 1px;
  box-sizing: border-box;
  background-color: transparent;
}

.event_list {
  height: 20%;
  margin: 1px 0;
  border-radius: 5px;
  border: 2px #81b3ec solid;
  box-sizing: border-box;
  background-color: transparent;
}

.infinite-list {
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
  width: 100%;
  margin-top: 0;
  padding-left: 30px;
  padding-left: 0;
  margin-bottom: 0;
}

.event_body {
  word-wrap: break-word;
  white-space: normal;
  font-weight: 500;
  font-size: 1rem;
  color: rgb(213, 214, 228);
}

.infor_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin: 0 15px;
}

.last-infor {
  margin-top: 3.5%;
  margin-bottom: 0;
  white-space: nowrap;
}

.dynamic_card {
  margin-left: 1px;
  margin-right: 1px;
  border: 0 solid rgb(252, 252, 249);
  border-radius: 4px;
  height: 98%;
  background-color: transparent;
}

.first-infor {
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  height: 100%;
}
</style>
