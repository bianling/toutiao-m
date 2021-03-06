import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/video',
        component: () => import('@/views/Video')
      },
      {
        path: '/qa',
        component: () => import('@/views/QA')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      }
    ]
  },
  // 跳转搜索页面
  {
    path: '/search',
    component: () => import('@/views/Search')
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('@/views/detail')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user')
  }
]

const router = new VueRouter({
  routes
})

export default router
