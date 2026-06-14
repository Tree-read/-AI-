import service from '@/unils/request'

// 定义接口
export const login = (data) => {
  // 登录接口 （POST）
  // 两个参数 
  // 请求路径：/user/login 以及 请求体数据：data
  return service.post('/user/login', data)
}
