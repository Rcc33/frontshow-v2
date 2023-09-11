<template>
  <div class="panel_container">
    <el-row class="node_row">
      <div id="mountNode" class="node" />
    </el-row>
    <el-row class="panel_config">
      <el-checkbox :checked="isAll" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="choosed" @change="handleCheckedChange">
        <el-checkbox :label="options[0]" v-model="Light" @change="changeChoose('Light')">{{options[0]}}</el-checkbox>
        <el-checkbox :label="options[1]" v-model="Occupy" @change="changeChoose('Occupy')">{{options[1]}}</el-checkbox>
      </el-checkbox-group>
    </el-row>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import axios from 'axios'
export default {
  name: 'middlePanel',
  data () {
    return {
      checkAll: true,
      timer: null,
      choosed: ['灯光状态', '会议室状态'],
      options: ['灯光状态', '会议室状态'],
      Light: true,
      Occupy: true,
      isAll: true,
      node: null,
      height: window.innerHeight * 0.4,
      width: window.innerWidth * 0.5,
      panelHeight: window.innerHeight * 0.4,
      panelWidth: window.innerHeight * 0.5 / 932 * 1613,
      graph: null,
      basicData: {
        nodes: []
      }
    }
  },
  mounted () {
    const that = this
    this.init()
    this.timer = setInterval(() => {
      that.changeState()
    }, 1000)
    window.onresize = function () {
      that.getData()
      that.graph.changeSize(that.panelWidth, that.panelHeight)
      that.graph.clear()
      that.basicData.nodes = []
      that.addNodes()
    }
  },
  methods: {
    changeState () {
      // 会议室2014-2 占用状态
      if (this.Occupy) {
        axios.post('/api/structure/room/query', 'meetingroom02', {
          headers: {
            'Content-Type': 'application/text'
          }
        }).then(res => {
          const empty = res.data.data.people_count !== '0'
          let nodes = [this.graph.findById('meetingroomOccupy'), this.graph.findById('meetingroomOccupyText')]
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].changeVisibility(empty && this.Occupy)
          }
          nodes = [this.graph.findById('meetingroomEmptyText')]
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].changeVisibility(!empty && this.Occupy)
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        let nodes = [this.graph.findById('meetingroomOccupy'), this.graph.findById('meetingroomOccupyText')]
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].changeVisibility(this.Occupy)
        }
        nodes = [this.graph.findById('meetingroomEmptyText')]
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].changeVisibility(this.Occupy)
        }
      }
      // 会议室2014-2 灯光状态
      if (this.Light) {
        const id = this.GLOBAL.message.Room_devices.MeetingRoom02.light.id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            const show = res.data.data[`${id}`].state.current_light_state === 'off'
            const nodes = [this.graph.findById('meetingroomLight')]
            for (let i = 0; i < nodes.length; i++) {
              nodes[i].changeVisibility(show && this.Light)
            }
          }).catch(err => {
            console.log(err)
          })
      } else {
        const nodes = [this.graph.findById('meetingroomLight')]
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].changeVisibility(this.Light)
        }
      }
      // 实验室 灯光状态
      // show = this.GLOBAL.message.Room_devices.Office.light.State.current_light_state.value === 'off'
      // nodes = [this.graph.findById('officeLight')]
      // for (let i = 0; i < nodes.length; i++) {
      //   nodes[i].changeVisibility(show && this.Light)
      // }
    },
    changeChoose (res) {
      this[res] = !this[res]
      const that = this
      if (res === 'Occupy') {
        // 会议室2014-2 占用状态
        axios.post('/api/structure/room/query', 'meetingroom02', {
          headers: {
            'Content-Type': 'application/text'
          }
        }).then(res => {
          const occupy = res.data.data.people_count !== '0'
          let nodes = [that.graph.findById('meetingroomOccupy'), that.graph.findById('meetingroomOccupyText')]
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].changeVisibility(occupy && that.Occupy)
          }
          nodes = [that.graph.findById('meetingroomEmptyText')]
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].changeVisibility(!occupy && that.Occupy)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (res === 'Light') {
        // 会议室2014-2 灯光状态
        const id = this.GLOBAL.message.Room_devices.MeetingRoom02.light.id
        axios.post('/api/structure/device/query', id,
          {
            headers: {
              'Content-Type': 'application/text'
            }
          })
          .then(res => {
            const show = res.data.data[`${id}`].state.current_light_state === 'off'
            const nodes = [this.graph.findById('meetingroomLight')]
            for (let i = 0; i < nodes.length; i++) {
              nodes[i].changeVisibility(show && that.Light)
            }
          }).catch(err => {
            console.log(err)
          })
        // 实验室 灯光状态
        // show = this.GLOBAL.message.Room_devices.Office.light.State.current_light_state.value === 'off'
        // nodes = [this.graph.findById('officeLight')]
        // for (let i = 0; i < nodes.length; i++) {
        //   nodes[i].changeVisibility(show && this[res])
        // }
      }
    },
    handleCheckAllChange (val) {
      this.choosed = val ? this.options : []
      this.isAll = val
      this.Light = val
      this.Occupy = val
      this.changeState()
    },
    handleCheckedChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.options.length
      this.isAll = checkedCount > 0 && checkedCount < this.options.length
    },
    init () {
      this.initG6()
      this.addNodes()
    },
    initG6 () {
      this.getData()
      this.graph = new G6.Graph({
        container: 'mountNode',
        autoPaint: true,
        width: this.panelWidth,
        height: this.panelHeight,
        defaultNode: {
          visible: false,
          labelCfg: {
            position: 'center',
            style: {
              fontSize: this.panelWidth / 40,
              fontWeight: 600
            }
          }
        },
        modes: ['drag-canvas', 'zoom-canvas']
      })
      this.graph.data(this.basicData)
      this.graph.render()
    },
    addNodes () {
      const meetingroomLight = {
        id: 'meetingroomLight',
        type: 'rect',
        x: this.panelWidth / 100 * 76,
        y: this.panelHeight / 100 * 20.1,
        size: [this.panelWidth / 100 * 43.5, this.panelHeight / 100 * 36.2],
        label: '灯-关闭',
        style: {
          fill: '#000',
          fillOpacity: 0.5,
          lineWidth: 0,
          stroke: 'red'
        },
        labelCfg: {
          style: {
            fill: '#E3E2DC'
          }
        }
      }
      // const officeLight = {
      //   id: 'officeLight',
      //   type: 'rect',
      //   x: this.panelWidth / 100 * 27.4,
      //   y: this.panelHeight / 100 * 29.3,
      //   size: [this.panelWidth / 100 * 51.5, this.panelHeight / 100 * 54.5],
      //   label: '灯-关闭',
      //   style: {
      //     fill: '#000',
      //     fillOpacity: 0.5,
      //     lineWidth: 0,
      //     stroke: 'red'
      //   },
      //   labelCfg: {
      //     style: {
      //       fill: '#E3E2DC'
      //     }
      //   }
      // }
      const meetingroomOccupyText = {
        id: 'meetingroomOccupyText',
        type: 'rect',
        visible: false,
        x: this.panelWidth / 100 * 76,
        y: this.panelHeight / 100 * 35,
        size: [this.panelWidth / 100 * 15, this.panelHeight / 100 * 10],
        label: '会议室2014-2：占用',
        style: {
          fillOpacity: 0,
          lineWidth: 0
        },
        labelCfg: {
          style: {
            fill: '#9696C8'
          }
        }
      }
      const meetingroomEmptyText = {
        id: 'meetingroomEmptyText',
        type: 'rect',
        visible: false,
        x: this.panelWidth / 100 * 76,
        y: this.panelHeight / 100 * 35,
        size: [this.panelWidth / 100 * 15, this.panelHeight / 100 * 10],
        label: '会议室2014-2：空闲',
        style: {
          fillOpacity: 0,
          lineWidth: 0
        },
        labelCfg: {
          style: {
            fill: '#9696C8'
          }
        }
      }
      const meetingroomOccupy = {
        id: 'meetingroomOccupy',
        type: 'image',
        x: this.panelWidth / 100 * 76.2,
        y: this.panelHeight / 100 * 20,
        size: [this.panelWidth / 100 * 43.4, this.panelHeight / 100 * 36.5],
        img: require('@/static/image/occupy.png')
      }
      this.basicData.nodes.push(meetingroomOccupy)
      this.basicData.nodes.push(meetingroomLight)
      // this.basicData.nodes.push(officeLight)
      this.basicData.nodes.push(meetingroomOccupyText)
      this.basicData.nodes.push(meetingroomEmptyText)
      this.graph.data(this.basicData)
      this.graph.render()
    },
    getData () {
      this.height = window.innerHeight * 0.52 * 0.85
      this.width = window.innerWidth * 0.5
      if (this.height / this.width < 932 / 1613) {
        this.panelHeight = this.height
        this.panelWidth = this.height / 932 * 1613
      } else {
        this.panelHeight = this.width / 1613 * 932
        this.panelWidth = this.width
      }
    }
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

.panel_container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.panel_config {
  width: 100%;
  height: 15%;
  padding: 1% 5%;
  border-radius: 10px;
  border: 2px #81b3ec solid;
  box-sizing: border-box;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #9cb3f7;
  font-weight: 600;
}

.el-checkbox__label {
  font-size: 1rem;
}

.el-checkbox {
  color: rgb(228, 230, 237);
  font-weight: 500;
}

.node_row {
  width: 100%;
  height: 85%;
  background: url("../static/image/gragh.png") no-repeat center center;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
