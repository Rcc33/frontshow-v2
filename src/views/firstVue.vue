<template>
  <div class="body">
    <el-col class="left">
      <el-row class="date_title">
        <p class="date">
          {{date}}
        </p>
      </el-row>
      <el-row>
        <div class="introduce">
          <div class="name_title">
            <p class="name">
              实验室介绍
            </p>
          </div>
          <div class="content_introduce">
            {{ introduce }}
          </div>
        </div>
      </el-row>
      <el-row class="reserve">
        <Occupy class="meetingroom_occupy" />
      </el-row>
      <el-row class="CheckIn">
        <signAndCheck class="meetingroom_state_panel" />
      </el-row>
    </el-col>

    <el-col class="middle">
      <el-row class="total_title">
        <p class="content_title">
          SELab 智慧办公
        </p>
      </el-row>
      <el-row class="map">
        <Panel class="panel-container" />
      </el-row>
      <el-row class="SignIn">
        <div class="panel_outer">
          <graph class="graph_panel"></graph>
          <groupGraph class="group_graph_panel"></groupGraph>
        </div>
      </el-row>
    </el-col>

    <el-col class="right">
      <el-row class="email">
        <img class="email_button" src="../static/image/email.png" @click="emailForm = true">
        <el-dialog :append-to-body="true" :destroy-on-close="true" :before-close="check" title="意见收集" :visible.sync="emailForm" top="25vh">
          <el-form :model="form_check" :append-to-body="true" label-position="left">
            <el-form-item label="请提交您的建议：" label-width="9.6rem">
              <el-input v-model="form_check.suggest" :autofocus="true" resize="none" type="textarea" :autosize="true" :clearable="true" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <div slot="footer" append-to-body="true">
            <el-button @click="cancel">
              取 消
            </el-button>
            <el-button type="primary" @click="certain('form_check')">
              确 定
            </el-button>
          </div>
        </el-dialog>
      </el-row>
      <el-row class="lab">
        <labPanel class="lab_panel" />
      </el-row>
      <el-row class="tap">
        <tapEvent class="tap_event_panel" />
      </el-row>
      <el-row class="environment_event">
        <environmentEvent class="environment_event_panel" />
      </el-row>
    </el-col>
  </div>
</template>

<script>
import axios from 'axios'
import labPanel from './information_lab'
import environmentEvent from './environment_event'
import signAndCheck from './check_in_event'
import tapEvent from './tap_event'
import graph from './graph'
import groupGraph from './group_sign_in'
import Panel from '../components/panel'
import Occupy from './meetingroom_occupy'

export default {
  name: 'firstVue',
  components: {
    labPanel,
    environmentEvent,
    signAndCheck,
    tapEvent,
    graph,
    groupGraph,
    Panel,
    Occupy
  },
  data () {
    return {
      form_check: {
        suggest: ''
      },
      emailForm: false,
      timer: null,
      date: '',
      introduce: '复旦大学软件工程实验室长期从事软件工程方法、系统软件技术以及软件技术产业化应用等方面的研究和实践工作,主要围绕智能化软件开发、软件开发大数据分析、微服务与智能化运维、泛在计算系统软件四个方面开展。'
    }
  },
  computed: {
  },
  methods: {
    check (done) {
      this.$confirm('确定退出？', {
        showClose: true
      })
        .then(() => {
          done()
        })
        .catch(() => { })
    },
    certain: function () {
      const that = this
      // 提交表单
      if (this.form_check.suggest !== '') {
        axios.post('/suggest/add', { feedback: that.form_check.suggest }).then(() => { // 请求成功处理
          that.form_check.suggest = ''
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          that.emailForm = false
        }).catch(() => { // 请求失败处理
          this.$message.error('提交失败！！')
        })
      } else {
        this.$message({
          message: '请填写建议',
          type: 'warning'
        })
        return false
      }
    },
    cancel: function () {
      this.emailForm = false
      this.form_check.suggest = ''
    },
    getDate () {
      const time = new Date()
      const nowTime = time.getFullYear() + '年' + time.getMonth() + '月' + time.getDate() + '日' + time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒'
      this.date = nowTime
    }
  },
  created () {
    this.getDate()
  },
  mounted () {
    const that = this
    this.timer = setInterval(() => {
      that.getDate()
    }, 1000)
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style>
.body {
  width: 100%;
  height: 100%;
  background-image: url(../static/image/background.png);
  background-size: 100% 100%;
  position: absolute;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.left,
.right {
  width: 25vw;
  height: 100%;
  padding-left: 0.4vw;
  padding-right: 0.4vw;
}

.middle {
  width: 50vw;
  height: 100%;
}

.date_title {
  width: 100%;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: end;
}

.email {
  width: 100%;
  height: 8vh;
  display: flex;
  justify-content: right;
  align-items: end;
}

.date {
  font-size: 1.1rem;
  color: white;
  letter-spacing: 5px;
  opacity: 0.85;
  text-shadow: 0 6px 8px #00225b;
  margin: 0;
  margin-bottom: 10px;
}

.content_introduce {
  font-size: 0.9rem;
  color: #ededf2;
  height: calc(25vh - 0.9rem);
  letter-spacing: 5px;
  text-shadow: 0 6px 8px #00225b;
  text-align: justify;
  padding: 15px;
  padding-bottom: 0;
  border-radius: 10px;
  border: 2px #81b3ec solid;
  box-sizing: border-box;
}

.name_title {
  background-color: rgba(60, 132, 165, 0.8);
  height: calc(1rem + 10px);
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 5px 5px 0 0;
}

.name,
.name_room {
  display: block;
  width: 100%;
  white-space: nowrap;
  text-align: center;
  color: #ededf2;
  font-weight: 600;
}

.name {
  font-size: 1rem;
  margin-top: 5px;
  margin-bottom: 5px;
  text-shadow: 2px 1.5px 1px #9a9acb;
}

.name_room {
  font-size: 0.9rem;
  margin-top: 8px;
  margin-bottom: 8px;
}

.total_title {
  width: 100%;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 6vh solid rgba(43, 79, 146, 0.95);
  border-left: 4.5vw solid transparent;
  border-right: 4.5vw solid transparent;
  margin-bottom: 1.5vh;
  margin-top: 0.5vh;
}

.total_title::after {
  content: "";
  position: absolute;
  width: 102%;
  height: 100px;
  margin-bottom: 100px;
  box-shadow: 0 15px 15px -15px rgba(255, 255, 255, 0.9);
}

.content_title {
  font-size: 1.8rem;
  color: white;
  letter-spacing: 5px;
  opacity: 0.9;
  text-shadow: 0 6px 8px #00225b;
  margin: 0;
  margin-bottom: 5vh;
}

.lab_panel,
.environment_event_panel,
.meetingroom_state_panel,
.tap_event_panel,
.check_in_panel,
.meetingroom_occupy {
  height: 100%;
  width: 100%;
}

.graph_panel,
.group_graph_panel {
  height: 100%;
  width: 49.8%;
  margin-left: 0.05%;
  margin-right: 0.05%;
}

.panel_outer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 2px #2d8cf7 solid;
  box-sizing: border-box;
}

.lab,
.environment_event,
.introduce,
.reserve,
.CheckIn,
.map,
.SignIn,
.tap {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px #2d8cf7 solid;
  padding: 2px;
  box-sizing: border-box;
  background-color: rgba(31, 41, 79, 0.6);
  margin-top: 0.8vh;
  box-shadow: 2px 2px 6px black;
}

.introduce {
  height: 19.2vh;
  flex-direction: column;
  justify-content: left;
}

.reserve {
  height: 33vh;
}

.CheckIn {
  height: 37vh;
}

.map {
  height: 53vh;
  margin-top: 2.3vh;
}

.SignIn {
  height: 37vh;
}

.lab {
  height: 24vh;
}

.tap {
  height: 28.2vh;
}

.environment_event {
  height: 37vh;
}

.email_button {
  height: 75%;
  cursor: pointer;
  margin-right: 15px;
}

.el-dialog {
  width: 30%;
  border-radius: 5px;
  padding-right: 30px;
  background: rgba(164, 179, 202, 0.98);
}

.el-dialog__title {
  font-size: 1.3rem;
  font-weight: 600;
  color: rgb(15, 18, 58);
}

.el-dialog__body {
  padding: 20px;
}

.el-form-item {
  margin: 0;
}

.el-form-item__label {
  text-align: left;
  font-size: 1.1rem;
  padding-left: 10px;
  padding-right: 0;
}

.el-form-item__content {
  font-size: 1.1rem;
}

.el-textarea {
  vertical-align: middle;
  font-size: 16px;
}

.el-button--primary {
  background-color: rgba(122, 145, 187, 0.8);
  border-color: rgba(250, 250, 250, 0.8);
  color: rgb(250, 250, 250);
  border-radius: 7px;
}

.el-button--primary:hover {
  background-color: rgba(105, 127, 168, 0.8);
  border-color: rgb(122, 145, 187);
  color: rgb(250, 250, 250);
  border-radius: 7px;
}

.el-button--default {
  background-color: rgba(250, 250, 250, 0.8);
  border-color: rgb(122, 145, 187);
  color: rgb(122, 145, 187);
  border-radius: 7px;
}

.el-button--default:hover {
  background-color: rgb(230, 230, 230, 0.8);
  border-color: rgba(250, 250, 250, 0.8);
  color: rgb(122, 145, 187);
  border-radius: 7px;
}

.el-textarea__inner {
  background-color: rgba(235, 240, 240, 0.95);
}

.panel-container {
  width: 100%;
  height: 100%;
}
</style>
