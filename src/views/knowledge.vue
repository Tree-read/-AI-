<template>
  <div>
    <!-- 父传子 通过属性title来传递值 -->
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
const formItem=[
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',options:[{
    label:'全部',
    value:'1'  
  },{
    label:'知识',
    value:'2'
  }],placeholder:'请输入文章内容'},
]
const handleSearch=(formData)=>{
  console.log(formData,'查询参数')
}
</script>