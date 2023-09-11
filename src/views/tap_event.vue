<template>
  <div class="dynamic-container">
    <div class="name_title">
      <p class="name">
        环境TAP规则
      </p>
    </div>
    <ul class="infinite-list" style="list-style:none">
      <li v-for="(item,index) in tapList" :key="index" class="tap_list">
        <el-col class="tap_name">
          {{item.name}}
        </el-col>
        <el-col class="tap_state">
          {{item.state}}
        </el-col>
        <el-col class="tap_time">
          {{item.time}}
        </el-col>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import tapConfig from '../config/tap_config.vue'
export default {
  name: 'tapEvent',
  data () {
    return {
    }
  },
  computed: {
    tapList: function () {
      return tapConfig.tapList
    }
  },
  created () {
  },
  mounted () {
    this.getFirst()
  },
  methods: {
    getFirst () {
      const that = this
      for (const key in that.tapList) {
        const temp = []
        temp.push(key)
        axios
          .post('/api/perceptionEvent/sequence/query',
            {
              eventList: temp,
              objectId: [],
              location: [],
              timeRange: null,
              count: 1
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            })
          .then(res => {
            if (res.data.data.length !== 0) {
              that.getTapTime(res.data.data[0])
            }
          })
      }
    },
    getTapTime (res) {
      const eventName = res.eventIdentify.name
      const date = new Date(res.timestamp * 1000)
      const mo = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) + '/' : (date.getMonth() + 1) + '/'
      const d = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const time = mo + d + h + m
      tapConfig.tapList[eventName].time = time
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
  background-color: transparent;
  border-radius: 10px;
  border: 3px #2d8cf7 solid;
  padding: 1px;
  box-sizing: border-box;
  background-color: transparent;
}

.tap_list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 20%;
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

.tap_name,
.tap_state,
.tap_time {
  font-weight: 500;
  font-size: 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  border: 1px #81b3ec solid;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 0.95rem;
}

.tap_name {
  width: 50%;
  padding-left: 15px;
  justify-content: left;
  color: rgb(213, 214, 228);
}

.tap_state {
  width: 15%;
  justify-content: center;
  color: #74c2e8;
}

.tap_time {
  width: 35%;
  justify-content: center;
  color: #74c2e8;
}
</style>
