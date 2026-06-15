import service from '@/unils/request'

// 定义登录接口
export function login(data) {
  // 登录接口 （POST）
  // 两个参数 
  // 请求路径：/user/login 以及 请求体数据：data
  return service.post('/user/login', data)
}

// 定义获取文章列表接口
export function categoryTree() {
  // 登录接口 （get）
  // 两个参数 
  // 请求路径：/knowledge/category/tree 以及 请求体数据：无（参数）
  return service.get('/knowledge/category/tree')
}

// 定义获取文章列表接口
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params: params })

}
