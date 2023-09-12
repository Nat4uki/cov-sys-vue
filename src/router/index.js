// 导入vue-router路由模块
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IndexView from '../views/indexView.vue'

// 共五个页面:
// / 主页 平台启动初始页面
// /home 人员数据管理页面
// /about 轨迹数据展示页面
// /data 疫情数据展示页面
// /mapDetailSet 疫情发展预测与展示页面
const routes = [
  {
    path: '/',
    name: 'index',
    component: IndexView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('../views/TotalDataVue.vue')
  },
  {
    path: '/mapDetailSet',
    name: 'mapDetailSet',
    component: ()=> import('../views/MapAttribute.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
