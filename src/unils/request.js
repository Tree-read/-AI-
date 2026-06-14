import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  // baseURL 请求前缀（基础URL）
  baseURL: '/api',
  // timeout 请求超时时间
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(
  // 请求发送前做些什么
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  // 对请求错误做些什么
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  // 对响应数据做点什么
  response => {
    // data 是后端返回的数据
    // config 是请求配置
    const { data, config } = response
    // 处理业务状态码
    if (data.code === '200') {
      return data
    } else {
      if (data.code === '-1') {
        // 处理登录超时情况 
        // 1 当不是登录接口时，提示用户重新登录
        if (!config.url?.includes('/login')) {
          ElMessage.error(data.msg || '登录超时，请重新登录')
          // 清除登录信息
          //    1 清除本地存储中的 token和 userInfo
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          // 重定向到登录页面
          window.location.href = '/auth/login'
        } else {
          // 正常的接口异常
          ElMessage.error(data.msg || '接口异常')
          return Promise.reject('网络请求失败...')

        }
      }
    }
    return response
  },
  // 对响应错误做点什么
  error => {

    return Promise.reject(error)
  }
)
// 导出axios实例
export default service