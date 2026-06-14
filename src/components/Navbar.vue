<script setup>
import { Expand } from '@element-plus/icons-vue';
import {ref} from 'vue'
import {useAdminStore} from '@/stores/admin'
const handleCommand=(command)=>{
  console.log(command)
}

// 点击顶部导航栏侧边导航栏收起或者展开
const handleCollapse=()=>{
  useAdminStore().toggleCollapse()
}

</script>

<template>

  <div class="navbar">
      <!-- 1 导航栏左边 -->
    <div class="flex-box">
      <el-button @click="handleCollapse">
      <el-icon><Expand /></el-icon>
    </el-button>
      <p class="page-title">数据分析</p>
  </div>
<!-- 2 导航栏右边 -->
  <div class="flex-box">
    <el-dropdown @command="handleCommand">
      <div class="flex-box">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        <p class="user-name">admin</p>
        <el-icon><ArrowDown /></el-icon>
      </div>
      <!-- 插槽 -->
    <template #dropdown>
      <!-- 下拉菜单 -->
      <el-dropdown-menu>
        <el-dropdown-item command="user">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
    </el-dropdown>
  </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content:space-between;
  padding:0 15px;
  background-color: #fff;
  box-shadow:0 1px 4px rgba(0,21,41,0.08);
  border-bottom: 1px solid #e4e7ed;
  .flex-box{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-title{
    margin-left:20px;
    font-size:26px;
    font-weight: bold;
    color:#1f2937
  }
}
</style>