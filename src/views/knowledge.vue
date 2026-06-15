<template>
  <div>
    <!-- 父传子 通过属性title来传递值 -->
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">新增</el-button>
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
           <el-button text type="primary">编辑</el-button>
           <el-button v-if="scope.row.status===0||scope.row.status===2" text type="success">发布</el-button>
           <el-button v-if="scope.row.status===1" text type="warning">下线</el-button>
           <el-button text type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination 
       style="margin-top: 20px;"
       :page-size="pagination.size"
       layout="prev, pager, next" 
       :total="pagination.total"
       @change="handleChange" />
    </TableSearch>
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree,articlePage } from '@/api/admin'
import { onMounted,ref,reactive } from 'vue'
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
  console.log(response)
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
 formItem[1].options=categories.value
//  获取列表 调用接口
 handleSearch({

 })
 })



</script>