import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IndexView from '../views/indexView.vue'

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
