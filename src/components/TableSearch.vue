<template>
  <el-form :model="formData">
    <!-- 使用响应式布局 让表单项在不同屏幕尺寸下都能正常显示和操作 -->
    <template v-for="item in formItem" :key="item.prop">
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

    </template>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-form>
</template>
<script setup>
import {ref,reactive} from 'vue'

const props=defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
const emit=defineEmits(['search'])
// 初始的表单数据
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
const handleReset=()=>{
  // Object.keys(formData).forEach(key=>{
  //   formData[key]=''
  // })
}
</script>
