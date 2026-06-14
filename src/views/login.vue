<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back/></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <!-- 校验的效果数据搜集的效果 都是通过form的组件 -->
       <!--
         ref="ruleFormRef" 表单实例引用 触发校验规则
         :model="formData" 表单数据绑定到formData对象上
         :rules="rules" 校验规则绑定到rules对象上
         label-position="top" 标签位置设置为顶部
         -->
       <el-form
       ref="ruleFormRef"
       :model="formData"
       :rules="rules"
       label-position="top"
       >
       <!-- 用户名表单域 
        label="用户名或邮箱" 表单域的标签：组件内部会自动创建 <label> 标签并显示文本
        prop="username"  - 关联表单数据字段
                          表示这个表单项对应 formData.username 字段
-                         绑定校验规则 ：配合 <el-form> 的 rules 属性，自动进行表单验证
        -->
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" size="large"></el-input>
        </el-form-item>
        <!-- 密码表单域 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
         <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
       </el-form>
       <!-- 没有账户去注册 -->
       <div class="footer">
        <p>还没有账户?
                    <!-- 用 router-link 实现页面跳转-->
          <router-link to="/register">去注册</router-link></p>
         </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'
const router = useRouter()

const ruleFormRef = ref(null)
const formData = ref({
  username: '',
  password: ''
})
const rules = ref({
  // 用户名校验规则 
  // required: true 表示必填项
  // message: '请输入用户名' 表示校验失败时的提示信息
  // trigger: 'blur' 表示校验触发时机，blur 表示失去焦点时触发校验规则
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  // 密码校验规则
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
// 登录按钮点击事件
const submitForm = async (formEl) => {
  if(!formEl) return
  await formEl.validate((vaild,fields)=>{
    if(vaild){
      // 校验通过 调接口
      console.log(formData.value)
      login(formData.value).then(response=>{
          console.log('后端返回数据:', response)
          // 后端返回的结构是 {code, msg, data: {...}}，真正的用户数据在 response.data 里面
          const data = response.data
          console.log('用户数据:', data)
        // 判断token是否存在
        if(!data.token){
          return console.log('登录失败,请检查用户名或密码是否正确')
        }else{
          // 登录成功 保存token的用户信息
          localStorage.setItem('token',data.token)
          localStorage.setItem('userInfo',JSON.stringify(data))
          // 根据roleType判断跳转路径（roleType在data根级别，且是字符串类型）
          if(data.roleType === '2'){
            router.push('/back/dashboard')
          }else{
            // router.push('/user/dashboard')
          }
        }
      })
    }
    else{
      console.log('校验失败')
    }
  })
}
</script>

<style lang="scss" scoped>
.container{
  width: 384px;
  .title{
    .back-home{
      margin-bottom:60px;
    }
    .title-text{
      text-align: center;
      h2{
        margin-bottom: 10px;
        font-size: 36px;
      }
      p{
        font-size: 18px;
        color: #666;
      }
    }
  }
  .form-container{
    margin-top: 30px;
    .btn{
      margin-top: 20px;
      width: 100%;
    }
    .footer{
      text-align: center;
      padding:30px;
    }
   }
}
</style>