import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import appConfig from '../public/config/index'
import transform from '../public/config/transform'
import {
  Button,
  Row,
  Col,
  Card,
  Carousel,
  CarouselItem,
  Form,
  FormItem,
  Dialog,
  Input,
  MessageBox,
  Message,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxButton,
  CheckboxGroup
} from 'element-ui'

Vue.prototype.GLOBAL = appConfig
Vue.prototype.TRANFORM = transform
Vue.prototype.$api = 'api' // 本地开发，开启反向代理
Vue.prototype.$suggest = 'suggest' // 本地开发，开启反向代理
Vue.prototype.$video = 'video' // 本地开发，开启反向代理

Vue.config.productionTip = false
axios.defaults.baseURL = '' // axios请求的初始路径

Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Button)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)

Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
