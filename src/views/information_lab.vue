<template>
  <el-card class="room_card" shadow="hover" name="Office">
    <div class="name_title">
      <p class="name">
        实验室
      </p>
    </div>
    <el-row class="row_body">
      <el-col class="inner_col">
        <el-card class="card_left" shadow="hover">
          <div class="Office_container">
            <p class="name_room">
              房间信息
            </p>
            <div class="room_outer">
              <div class="room">
                <p v-for="(item, i) in OfficeList" :key="'list' + i" class="info_room">
                  <a class="title">{{ item.name }}: </a>
                  <a class="value">{{ item.value }}</a>
                </p>
                <div v-for="(lists, j) in Office_Room_device" :key="'outer' + j" class="info_room">
                  <p v-for="(list, k) in lists.State" :key="'inner' + k" class="info_room">
                    <a class="title">{{ list.name }}: </a>
                    <a class="value">{{ list.value }}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col class="inner_col">
        <el-card class="card_right" shadow="hover">
          <div class="Office_container">
            <p class="name_room">
              设备信息
            </p>
            <el-carousel direction="horizontal" :autoplay="true" indicator-position="none" :interval="5000" arrow="never">
              <div v-if="this.Office_card_list.length > 1" class="choose">
                <el-carousel-item v-for="(list, index) in Office_card_list" :key="'list' + index">
                  <div class="device_outer">
                    <el-card v-for="(items,i) in list" :key="'outer' + i" class="room_device" shadow="hover">
                      <div class="device_image">
                        <img :src="img[`${items.type}`]" class="img">
                      </div>
                      <div class="space">
                        <p class="device_type">
                          <a class="title">类型: </a>
                          <a class="value"> {{ items.type }}</a>
                        </p>
                        <div v-for="(item, j) in items.Properties" :key="'inner' + j" class="device_info">
                          <p v-if="item.show" class="device_inner">
                            <a class="title">{{ item.name }}: </a>
                            <a class="value">{{ item.value }}</a>
                          </p>
                        </div>
                        <div v-for="(item, k) in items.State" :key="'inner' + k" class="device_info">
                          <p v-if="item.show" class="device_inner">
                            <a class="title">{{ item.name }}: </a>
                            <a class="value">{{ item.value }}</a>
                          </p>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-carousel-item>
              </div>
              <div v-if="this.Office_card_list.length == 1" class="choose">
                <div class="device_outer">
                  <el-card v-for="(items,i) in Office_card_list[0]" :key="'outer' + i" class="room_device" shadow="hover">
                    <div class="device_image">
                      <img :src="img[`${items.type}`]" class="img">
                    </div>
                    <div class="space">
                      <p class="device_type">
                        <a class="title">类型: </a>
                        <a> {{ items.type }}</a>
                      </p>
                      <div v-for="(item, j) in items.Properties" :key="'inner' + j" class="device_info">
                        <p v-if="item.show" class="device_inner">
                          <a class="title">{{ item.name }}: </a>
                          <a>{{ item.value }}</a>
                        </p>
                      </div>
                      <div v-for="(item, k) in items.State" :key="'inner' + k" class="device_info">
                        <p v-if="item.show" class="device_inner">
                          <a class="title">{{ item.name }}: </a>
                          <a>{{ item.value }}</a>
                        </p>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-carousel>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'labPanel',
  data () {
    return {
      timer_two: null,
      Office_card_list: [],
      Office_Room_device: [],
      Office_device: [],
      Office: this.GLOBAL.message.Room.Office,
      img: {
        空调: require('../static/image/air_conditon.png'),
        电视: require('../static/image/TV.png'),
        咖啡机: require('../static/image/coffee.png'),
        饮水机: require('../static/image/water.png'),
        打印机: require('../static/image/printer.png')
      }
    }
  },
  computed: {
    OfficeList: function () {
      return this.Office.filter((item) => {
        return item.show
      })
    }
  },
  methods: {
    getDevice () {
      this.Office_device = []
      this.Office_Room_device = []
      const that = this
      Object.keys(that.GLOBAL.message.Devices.Office).forEach(function (key) {
        if (that.GLOBAL.message.Devices.Office[`${key}`].show) {
          that.Office_device.push(that.GLOBAL.message.Devices.Office[`${key}`])
        }
      })
      Object.keys(that.GLOBAL.message.Room_devices.Office).forEach(function (key) {
        if (that.GLOBAL.message.Room_devices.Office[`${key}`].show) {
          that.Office_Room_device.push(that.GLOBAL.message.Room_devices.Office[`${key}`])
        }
      })
    },
    getInfo () {
      const that = this
      Object.keys(that.GLOBAL.message.Devices.MeetingRoom02).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            if (that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].State && that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].State.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
                that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
              })
            }
            if (that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].Properties && that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].Properties.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].Properties).forEach(function (keyProperty) {
                that.GLOBAL.message.Devices.MeetingRoom02[`${keyRoom}`].Properties[`${keyProperty}`].value = res.data.data[`${id}`].property[`${keyProperty}`]
              })
            }
          }).catch(err => {
            console.log(err)
          })
      })
      Object.keys(that.GLOBAL.message.Devices.TeaRoom).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            if (that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].Properties && that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].Properties.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].Properties).forEach(function (keyProperty) {
                that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].Properties[`${keyProperty}`].value = res.data.data[`${id}`].property[`${keyProperty}`]
              })
            }
            if (that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].State && that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].State.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
                that.GLOBAL.message.Devices.TeaRoom[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
              })
            }
          }).catch(err => {
            console.log(err)
          })
      })
      Object.keys(that.GLOBAL.message.Devices.Office).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Devices.Office[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            if (that.GLOBAL.message.Devices.Office[`${keyRoom}`].Properties && that.GLOBAL.message.Devices.Office[`${keyRoom}`].Properties.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.Office[`${keyRoom}`].Properties).forEach(function (keyProperty) {
                that.GLOBAL.message.Devices.Office[`${keyRoom}`].Properties[`${keyProperty}`].value = res.data.data[`${id}`].property[`${keyProperty}`]
              })
            }
            if (that.GLOBAL.message.Devices.Office[`${keyRoom}`].State && that.GLOBAL.message.Devices.Office[`${keyRoom}`].State.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.Office[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
                that.GLOBAL.message.Devices.Office[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
              })
            }
          }).catch(err => {
            console.log(err)
          })
      })
      Object.keys(that.GLOBAL.message.Devices.Corridor).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            if (that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].Properties && that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].Properties.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].Properties).forEach(function (keyProperty) {
                that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].Properties[`${keyProperty}`].value = res.data.data[`${id}`].property[`${keyProperty}`]
              })
            }
            if (that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].State && that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].State.length !== 0) {
              Object.keys(that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
                that.GLOBAL.message.Devices.Corridor[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
              })
            }
          }).catch(err => {
            console.log(err)
          })
      })
    },
    getList () {
      this.Office_card_list = []
      for (let i = 0; i < this.Office_device.length; i += 1) {
        this.Office_card_list.push(this.Office_device.slice(i, i + 1))
      }
      if (this.Office_card_list.length === 2) {
        for (let i = 0; i < this.Office_device.length; i += 1) {
          this.Office_card_list.push(this.Office_device.slice(i, i + 1))
        }
      }
    },
    getCatClass () {
      const that = this
      axios
        .post('/api/structure/room/query', 'meetingroom02', {
          headers: {
            'Content-Type': 'application/text'
          }
        })
        .then(res => {
          this.GLOBAL.message.Room.MeetingRoom02[0].value = res.data.data.temperature + ' ℃'
          this.GLOBAL.message.Room.MeetingRoom02[1].value = res.data.data.humidity + ' %rh'
          this.GLOBAL.message.Room.MeetingRoom02[2].value = res.data.data.people_count
        })
        .catch(err => {
          console.log(err)
        })
      Object.keys(that.GLOBAL.message.Room_devices.MeetingRoom02).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Room_devices.MeetingRoom02[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            Object.keys(that.GLOBAL.message.Room_devices.MeetingRoom02[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
              if (keyRoom === 'light' && keyState === 'current_illuminance') {
                that.GLOBAL.message.Room_devices.MeetingRoom02[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`] + ' Lx'
              } else {
                that.GLOBAL.message.Room_devices.MeetingRoom02[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
              }
            })
          }).catch(err => {
            console.log(err)
          })
      })

      axios
        .post('/api/structure/room/query', 'tearoom01', {
          headers: {
            'Content-Type': 'application/text'
          }
        })
        .then(res => {
          this.GLOBAL.message.Room.TeaRoom[0].value = res.data.data.temperature + ' ℃'
        })
        .catch(err => {
          console.log(err)
        })
      Object.keys(that.GLOBAL.message.Room_devices.TeaRoom).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Room_devices.TeaRoom[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            Object.keys(that.GLOBAL.message.Room_devices.TeaRoom[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
              if (keyRoom === 'light' && keyState === 'current_illuminance') {
                that.GLOBAL.message.Room_devices.TeaRoom[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`] + ' Lx'
              } else {
                that.GLOBAL.message.Room_devices.TeaRoom[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
              }
            })
          }).catch(err => {
            console.log(err)
          })
      })

      axios.post('/api/structure/room/query', 'laboratory01',
        {
          headers: {
            'Content-Type': 'application/text'
          }
        })
        .then(res => {
          this.GLOBAL.message.Room.Office[0].value = res.data.data.temperature + ' ℃'
          this.GLOBAL.message.Room.Office[1].value = res.data.data.humidity + ' %rh'
          this.GLOBAL.message.Room.Office[2].value = res.data.data.people_count
        })
        .catch(err => {
          console.log(err)
        })
      Object.keys(that.GLOBAL.message.Room_devices.Office).forEach(function (keyRoom) { // keyRoom = air_condition……
        if (keyRoom === 'window') {
          let stateOne, stateTwo
          const id1 = that.GLOBAL.message.Room_devices.Office.window.id1
          const id2 = that.GLOBAL.message.Room_devices.Office.window.id2
          axios.post('/api/structure/device/query', that.GLOBAL.message.Room_devices.Office.window.id1,
            {
              headers: {
                'Content-Type': 'application/text'
              }
            })
            .then(res => {
              stateOne = res.data.data[`${id1}`].state.current_window_state
            }).catch(err => {
              console.log(err)
            })
          axios.post('/api/structure/device/query', that.GLOBAL.message.Room_devices.Office.window.id2,
            {
              headers: {
                'Content-Type': 'application/text'
              }
            })
            .then(res => {
              stateTwo = res.data.data[`${id2}`].state.current_window_state
            }).catch(err => {
              console.log(err)
            })
          if (stateOne === 'on' || stateTwo === 'on') {
            that.GLOBAL.message.Room_devices.Office.window.State.current_window_state.value = 'on'
          } else {
            that.GLOBAL.message.Room_devices.Office.window.State.current_window_state.value = 'off'
          }
        } else {
          const id = that.GLOBAL.message.Room_devices.Office[`${keyRoom}`].id
          axios.post('/api/structure/device/query', id,
            {
              headers: {
                'Content-Type': 'application/text'
              }
            })
            .then(res => {
              Object.keys(that.GLOBAL.message.Room_devices.Office[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
                if (keyRoom === 'light' && keyState === 'current_illuminance') {
                  that.GLOBAL.message.Room_devices.Office[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`] + ' Lx'
                } else {
                  that.GLOBAL.message.Room_devices.Office[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
                }
              })
            }).catch(err => {
              console.log(err)
            })
        }
      })

      axios.post('/api/structure/room/query', 'corridor01',
        {
          headers: {
            'Content-Type': 'application/text'
          }
        })
        .then(res => {
          this.GLOBAL.message.Room.Corridor[0].value = res.data.data.temperature + ' ℃'
        })
        .catch(err => {
          console.log(err)
        })
      Object.keys(that.GLOBAL.message.Room_devices.Corridor).forEach(function (keyRoom) { // keyRoom = air_condition……
        const id = that.GLOBAL.message.Room_devices.Corridor[`${keyRoom}`].id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            Object.keys(that.GLOBAL.message.Room_devices.Corridor[`${keyRoom}`].State).forEach(function (keyState) { // keyState = current_ac_state……
              that.GLOBAL.message.Room_devices.Corridor[`${keyRoom}`].State[`${keyState}`].value = res.data.data[`${id}`].state[`${keyState}`]
            })
          }).catch(err => {
            console.log(err)
          })
      })
    }
  },
  created () {
    this.getCatClass()
    this.getInfo()
    this.getDevice()
    this.getList()
  },
  mounted () {
    const that = this
    this.timer_two = setInterval(() => {
      that.getCatClass()
      that.getInfo()
      that.getDevice()
      that.getList()
    }, 10000)
  },
  destroyed () {
    clearTimeout(this.timer_two)
  }

}
</script>

<style>
.room_card {
  display: flex;
  flex-direction: column;
  height: 99.5%;
  width: 99.5%;
  background-color: transparent;
}

.el-card__body {
  height: 100%;
  width: 100%;
  padding: 0;
}

.row_body {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - 1.5rem);
  overflow: hidden;
}

.inner_col {
  width: 50%;
  margin: 0;
}

.card_left,
.card_right {
  height: 100%;
  width: 99%;
  margin: 0 0.5%;
  background-color: transparent;
}

.Office_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.room_outer,
.device_outer,
.choose {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-carousel::-webkit-scrollbar {
  display: none;
}

.el-carousel,
.el-carousel__container {
  height: 100%;
}

.room {
  display: inline-block;
  height: 100%;
  margin-left: 15px;
  margin-right: 15px;
}

.info_room {
  margin-top: 0;
  margin-bottom: 3%;
  white-space: nowrap;
}

.room_device {
  height: 100%;
  width: 100%;
  border: 0;
  background-color: transparent;
}

.device_image {
  margin-top: 5px;
  margin: 0 15px;
  height: 28%;
}

.img {
  height: 100%;
}

.device_inner {
  margin-top: 0;
  margin-bottom: 5px;
  white-space: nowrap;
}

.title {
  font-weight: 500;
  font-size: 0.95rem;
  color: #d5d6e4;
}

.value {
  font-weight: 500;
  font-size: 0.95rem;
  color: #74c2e8;
  margin-left: 5px;
}

.space {
  height: 60%;
  margin: 10px 15px 0 15px;
}

.device_info {
  margin-top: 5%;
  white-space: nowrap;
}

.device_type {
  margin: 0;
  white-space: nowrap;
}
</style>
