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

    console.log('=== 请求拦截器 ===')
    console.log('请求URL:', config.url)
    console.log('localStorage.token:', token ? '存在(' + token.length + '字符)' : '不存在')

    // 如果没有 token 且不是登录/注册接口，直接跳转到登录页
    if (!token && !config.url?.includes('/login') && !config.url?.includes('/register')) {
      console.log('没有token，跳转到登录页')
      window.location.href = '/auth/login'
      return Promise.reject('请先登录')
    }

    if (token) {
      // 同时设置 token 和 Authorization 头，确保后端能正确识别
      config.headers['token'] = token
      config.headers['Authorization'] = 'Bearer ' + token
      console.log('已添加token到请求头:', token.substring(0, 20) + '...')
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

    console.log('=== 响应拦截器 ===')
    console.log('请求URL:', config.url)
    console.log('响应数据:', JSON.stringify(data))
    console.log('状态码code:', data?.code)

    // 如果 data 不存在，直接返回原始响应
    if (!data) {
      return response
    }

    // 处理业务状态码（同时支持字符串和数字）
    const code = data.code

    // 成功状态
    if (code === '200' || code === 200) {
      console.log('请求成功')
      return data
    }
    // 登录超时状态
    else if (code === '-1' || code === -1) {
      console.log('后端返回code=-1，登录超时')
      if (!config.url?.includes('/login') && !config.url?.includes('/register')) {
        ElMessage.error(data.msg || '登录超时，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 1500)
      }
      return Promise.reject(data.msg || '登录超时')
    }
    // 其他错误状态
    else {
      console.log('后端返回其他状态码:', code)
      ElMessage.error(data.msg || '接口异常')
      return Promise.reject(data.msg || '接口异常')
    }
  },
  // 对响应错误做点什么
  error => {

    return Promise.reject(error)
  }
)
// 导出axios实例
export default service