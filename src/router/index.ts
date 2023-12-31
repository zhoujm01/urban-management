//引入路由对象
import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router'


// 路由类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes: Array<RouteRecordRaw> = [{
  path: '/',
  name: 'index',
  component: () => import('../views/index.vue'),  /* 路由懒加载 */
},


]

/* 路由模式 
  createWebHistory: h5
  createWebHashHistory: HASH
  createMemoryHistory: 服务端渲染时
*/

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

//导出router
export default router
