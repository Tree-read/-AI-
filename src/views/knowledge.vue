<template>
  <div>
    <!-- 父传子 通过属性title来传递值 -->
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch">
      <!-- el-table 内部会 自动遍历 tableData 数组，对每一行数据创建一个 scope 对象 -->
      <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
        <el-table-column  width="250" label="文章标题" fixed="left">
          <template #default="scope">
           <div style="display:flex;align-items: center;">
            <el-icon ><timer/></el-icon>
            <span>{{ scope.row.title }}</span>
           </div>
          </template>
        </el-table-column>
         <el-table-column  label="分类" width="200">
          <template #default="scope">
           <div style="display:flex;align-items: center;">
            <el-icon ><timer/></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
           </div>
          </template>
        </el-table-column>
        <!-- - prop="authorName" 是 Element Plus 提供的 语法糖
          表格组件内部会自动遍历 :data 绑定的数组
          对每一行，自动读取 当前行.authorName 并显示
          相当于组件帮你做了 {{ scope.row.authorName }} 的工作 -->
        <el-table-column prop="authorName" label="作者" width="150"/>
        <el-table-column prop="readCount" label="阅读量" width="150"/>
        <el-table-column prop="createdAt" label="发布时间" width="150"/>
        <el-table-column  label="操作" width="240" fixed="right">
          <template #default="scope">
           <el-button  @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
           <el-button @click="handlePublish(scope.row)" v-if="scope.row.status===0||scope.row.status===2" text type="success">发布</el-button>
           <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status===1" text type="warning" >下线</el-button>
           <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination 
       style="margin-top: 20px;"
       :page-size="pagination.size"
       layout="prev, pager, next" 
       :total="pagination.total"
       @change="handleChange"
        />
    </TableSearch>
    <!--v-model:modelValue="dialogVisible" 父传子 通过modelValue属性来传递值 -->

    <!-- v-model:modelValue 会自动完成两件事
      把父组件的 dialogVisible 值传给子组件的 modelValue prop
      监听子组件发出的 update:modelValue 事件，自动更新父组件的 dialogVisible -->

      <!-- 在模板中，这两种写法等价 -->
<!-- <ArticleDialog :categories="categories" />
等价于  because ref的自动解包机制 在template中不需要加.value vue会自动加上
<ArticleDialog :categories="categories.value" /> -->
    <ArticleDialog v-model:modelValue="dialogVisible" :categories="categories" :article="currentArticle" @success="handleSuccess"/>
    <!-- 等价于 -->
     <!-- <ArticleDialog 
     :modelValue="dialogVisible"              
     @update:modelValue="dialogVisible = $event" 
/> -->
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree,articlePage ,getArticleDetail,changeArticleStatus,deleteArticle} from '@/api/admin'
import { onMounted,ref,reactive } from 'vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox,ElMessage } from 'element-plus'

// 新增和编辑文章弹窗
const dialogVisible=ref(false)
const currentArticle=ref(null)
// 新增和编辑文章弹窗成功后 刷新列表
const handleSuccess=()=>{
  // 刷新文章列表
  handleSearch({})
}
// 编辑文章
const handleEdit=(row)=>{
  // 如果没有 id 或者 id 为空，就是新增
  if(!row.id){
    // 新增
    currentArticle.value=null
    dialogVisible.value=true
  }else{
    // 编辑
    getArticleDetail(row.id).then(res=>{
      // console.log(res,'编辑文章')
      currentArticle.value=res.data
      dialogVisible.value=true
    })
  }
}

// 发布文章
const handlePublish=(row)=>{
ElMessageBox.confirm(
  `确认发布文章 ${row.title} 吗？`,
  '确认',{
    confirmButtonText:'确认发布',
    cancelButtonText:'取消',
    type:'info'
  }
).then(() => {
changeArticleStatus(row.id,{status:1}).then(res=>{
    ElMessage.success('文章发布成功')
    // 刷新文章列表
    handleSearch({})
  // 刷新文章列表
})
})
}
// 下线文章
const handleUnpublish=(row)=>{
ElMessageBox.confirm(
  `确认下线文章 ${row.title} 吗？`,
  '确认',{
    confirmButtonText:'确认下线',
    cancelButtonText:'取消',
    type:'warning'
  }
).then(() => {
changeArticleStatus(row.id,{status:2}).then(res=>{
    ElMessage.success('文章下线成功')
    // 刷新文章列表
    handleSearch({})
  // 刷新文章列表
  })
})
}
// 删除文章
const handleDelete=(row)=>{
ElMessageBox.confirm(
  `确认删除文章 ${row.title} 吗？`,
  '确认',{
    confirmButtonText:'确认删除',
    cancelButtonText:'取消',
    type:'danger'
  }
).then(() => {
deleteArticle(row.id).then(res=>{
    ElMessage.success('文章删除成功')
    // 刷新文章列表
    handleSearch({})
})
})
}

const formItem=[
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',placeholder:'请输入文章内容'},
  {comp:'select',prop:'status',label:'状态',placeholder:'请输入状态',options:[
    {label:'草稿',value:'0'},
    {label:'已发布',value:'1'},
    {label:'已下线',value:'2'}

  ]},
]
// 分页参数
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})
 //  列表数据
const tableData=ref([])
const handleSearch=async (formData)=>{
  // console.log(formData,'查询参数')
  //  文章列表渲染
const params={
  ...pagination,
  ...formData
}
// console.log(params)
  const response=await articlePage(params)
  // console.log(response)
  // 后端返回结构是 {code, msg, data: {...}}，真正的数据在 response.data 里面
  const {records,total}=response.data
  // console.log('文章列表数据:', records)
  tableData.value=records
  pagination.total=total
}

const handleChange=(page)=>{
  pagination.currentPage=page
  handleSearch()
}

// 分类映射
 const categoryMap=reactive({})
// 分类列表
 const categories=ref([])

 onMounted(async()=>{
  // categoryTree() 返回的是完整的响应对象 故response是一个对象
  const response=await categoryTree()
  // console.log('后端返回数据:', response)
  // 后端返回的结构是 {code, msg, data: [...]}, 真正的数组数据在 response.data 里面
  const data=response.data
  categories.value=data.map(item=>{
  categoryMap[item.id]=item.categoryName
    return {
      label:item.categoryName,
      value:item.id
    }

  })
  console.log(categories)
 formItem[1].options=categories.value
//  获取列表 调用接口
 handleSearch({

 })
 })



</script>