import Vue from 'vue'
import VueRouter from 'vue-router'
import FirstVue from '../views/firstVue.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FirstVue',
    component: FirstVue
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
