import service from '@/unils/request'

// 请求参数的不同 query body 
// query ：查询参数
// body ：请求体数据
// 请求方式的不同 get set
// get ：查询参数
// set ：请求体数据

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

// 定义新增中上传文件接口
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  // append 就是 往表单数据对象里添加字段 （可以是文件、字符串等），方便通过 multipart/form-data 格式上传给后端服务器
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 定义新增文章接口
export function createArticle(data) {
  return service.post('/knowledge/article', data)
}

// 定义编辑文章接口
export function getArticleDetail(id) {
  return service.get('/knowledge/article/' + id)
}

// 定义更新文章内容接口
export function updateArticle(data) {
  return service.put('/knowledge/article/' + data.id, data)
}

// 定义更新文章状态接口（PUT /knowledge/article/{id}/status）
export function changeArticleStatus(id, params) {
  return service.put(`/knowledge/article/${id}/status`, params)
}

// 定义删除文章接口
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}