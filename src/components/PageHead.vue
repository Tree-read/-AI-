<template>
  <div class="page-head">
    <p class="page-title">{{props.title}}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
<script setup>
// 父传子 
// 父组件通过属性 title来传递值
// 子组件通过 props 接收 props.title 来使用

const props=defineProps({
  title: {
    type: String,
    default: '页面标题'
  }
})
</script>
<style lang="scss" scoped>
.page-head{
  display: flex;
  justify-content: space-between;
  align-items: center;
 .page-title{
  font-size: 24px;
  color: #303133;
 }
}
</style>