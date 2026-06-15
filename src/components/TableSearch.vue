<template>
  <el-form :model="formData" ref="ruleFormRef">
    <!-- 使用响应式布局 让表单项在不同屏幕尺寸下都能正常显示和操作 -->
     <el-row :gutter="24">
       <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
        <component v-model="formData[item.prop]" :is="isComp(item.comp)"
         :placeholder="item.placeholder">
        <template v-if="item.comp==='select'">
          <el-option label="全部" value=""></el-option>
          <el-option 
          v-for="opt in item.options"
          :label="opt.label"
          :value="opt.value"
          :key="opt.value"
          ></el-option>
        </template>
        </component>
    </el-form-item>

        </el-col>
        
    </template>
     </el-row>
   <el-row>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button @click="handleReset(ruleFormRef)">重置</el-button>
   </el-row>
   
   <!-- 插槽：用于渲染表格等内容 -->
   <slot></slot>
  </el-form>
</template>
<script setup>
import {ref,reactive,computed} from 'vue'

const props=defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
const emit=defineEmits(['search'])
// 计算属性 监听props
const formItemAttrs=computed(()=>{
  const {formItem}=props
  formItem.forEach(item=>{
    item.col={xs:24,sm:12,md:8,lg:6,xl:6}
  })
  return formItem
})

// 初始的表单数据
const ruleFormRef=ref()
const formData=reactive({})
const isComp=(comp)=>{
  return {
    input:'el-input',
    select:'el-select',
  }[comp]
}
// 查询
const handleSearch=()=>{
  // console.log(formData)
  emit('search',formData)
}
// 重置
const handleReset=(formEl)=>{
  // 先充值表单
   if (!formEl) return
  formEl.resetFields()
  // 在触发查询
  handleSearch()
}
</script>
