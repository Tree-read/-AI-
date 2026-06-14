import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '../components/BackendLayout.vue'
import AuthLayout from '../components/AuthLayout.vue'

// import { Children } from 'react'

// 路由配置
//Vue Router 的核心功能： 定义「URL → 组件」的映射关系
const routes = [
  // 一个{} 定义一个路由规则
  //  第一个路由规则（重定向） 当访问根路径 / 时，重定向到 /back
  {
    path: '/',
    redirect: '/back'
  },
  // 第二个路由规则（实际页面）
  {
    path: '/back', // 当 URL 匹配到 /back 时
    component: BackendLayout,// 自动渲染 BackendLayout 组件
    // 子路由 用于实现 嵌套路由 ，让组件可以层层嵌套显示。
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  // 第三个路由规则 登录注册页面（嵌套路由）
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: () => import('@/views/login.vue'), meta: { title: '登录' } },
      { path: 'register', component: () => import('@/views/register.vue'), meta: { title: '注册' } }
    ]
  }

]
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
export default router