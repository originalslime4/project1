import { createRouter, createWebHistory } from 'vue-router'
import Base from '../App.vue'
import Board from '../views/jjal.vue'
import Home from '../views/home.vue'
// import Gallery from '../views/Gallery.vue'

const routes = [
  { path: '/', name:"App", component: Base },
  { path: '/jjal', name:"jallPage", component: Board },
  { path: '/home', name:"homePage", component: Home },
//   { path: '/gallery', component: Gallery }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
