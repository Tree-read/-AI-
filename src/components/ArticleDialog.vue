<template>
  <el-dialog 
    :title="isEdit?'编辑文章':'新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
    >
    <!-- 表单内容 -->
     <!-- :model="formData" 告诉表单整体的数据来源
          :rules="rules" 告诉表单验证规则 只要在el-form-item组件中添加了prop属性都要在script中添加对应的验证规则项 
          ref="formRef" 告诉表单实例对象
          label-width="120px" 标签宽度
     -->
     <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <!-- maxLength 最大长度 200 -->
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="formData.summary" 
        placeholder="请输入文章摘要（可选）" 
        type="textarea" :rows="4"
        maxlength="1000"
        show-word-limit 
        ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <!-- -why 用 formData.tagArray 而不是 formData.tags ?
         多选框返回数组 ： el-select 的 multiple 属性会让它返回一个数组
         后端期望字符串 ：后端 API 可能期望 tags 是逗号分隔的字符串（如 "标签1,标签2" ） -->
        <el-select v-model="formData.tagArray" placeholder="请选择文章标签（可选）" multiple filterable allow-create style="width: 100%;">
          <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <!-- class="avatar-uploader" 上传组件的类名，用于自定义上传组件的样式和行为 
           action="#" 上传接口地址 
           :before-upload="beforeUpload" 上传前的回调函数 用来校验文件类型和大小等
          -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            accept="image/*"
            
            >
           <div class="cover-placeholder" v-if="!image">
            <p>点击上传封面</p>
           </div>
            <img :src="image" alt="封面图片" class="cover-image" v-else />
          </el-upload>
          <div v-if="image" class="cover-remove" >
          <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
        </div>
        </div>  
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
        v-model="formData.content" 
        placeholder="请输入文章内容,支持富文本格式"
        :maxCharCount="5000"
        @change="handleContentChange"
        @create="handleEditorCreated"
        min-height="400px"
        />
      </el-form-item>
    </el-form>
    <!-- 预览效果 -->
    <div v-if="btnPreview" class="preview-container">
      <h3>内容预览</h3>    
        <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button  @click="btnPreview=!btnPreview">{{ btnPreview?'隐藏预览':'预览效果' }}</el-button>
      <el-button  @click="handleClose">取消</el-button>
      <el-button  @click="handleSubmit" :loading="loading" type="primary">{{ isEdit?'编辑文章':'新增文章' }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { ref ,reactive,computed,nextTick,watch} from 'vue'
import { uploadFile,createArticle,updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 接收父组件传递过来的值通过props接收
const props=defineProps({
  modelValue:{
    type:Boolean,
    default:false
  },
  categories:{
    type:Array,
    default:()=>[]
  },
  article:{
    type:Object,
    default:null
  }
})
// 子组件不可以修改父组件（props.modelValue）的值 
// 通过计算属性来实现
// emit 是一个函数，用于触发父组件的事件
const emit=defineEmits(['update:modelValue','success'])
const dialogVisible=computed(
 {
  // 当子组件需要获取父组件的值时，会触发get方法
   get(){
    return props.modelValue
  },
  // 当子组件修改了dialogVisible的值时，会触发set方法 通过emit来修改父组件的值
  set(val){
//  场景1：用户点击弹窗外部（遮罩层）
//     ↓
// el-dialog 内部触发 v-model 修改
//     ↓
// computed 的 set(val) 被调用
//     ↓
// emit('update:modelValue', false)
//     ↓
// 父组件 dialogVisible = false
// - 点击遮罩关闭是 Element Plus 的默认行为 ，由 close-on-click-modal 属性控制
// - 默认值是 true ，所以点击遮罩会关闭弹窗
// - 你可以通过设置 :close-on-click-modal="false" 来禁用这个功能
    emit('update:modelValue',val)
  }
 }
)

// !!把数据类型转换为布尔值
const isEdit=computed(()=>!!props.article?.id)
// 监听编辑数据
// 第一个参数：通过回调函数返回监听的响应式数据
// 第二个参数：回调函数 当监听的响应式数据发生变化时，会触发回调函数
watch(()=>props.article,async(newVal)=>{
  if(newVal){
    nextTick(()=>{
      Object.assign(formData,newVal)
    // 使用现有的id
    businessId.value=newVal.id
    // 封面url
    image.value=fileBaseUrl+newVal.coverImage
    })
    
  }
})

const handleClose=()=>{
  // props 是只读的 ，Vue 不允许子组件直接修改 props。
  //   props.modelValue=false（报错！）
// handleClose() 被调用
//     ↓
// emit('update:modelValue', false)
//     ↓
// 父组件 dialogVisible = false
// 重置调单 
formRef.value.resetFields()
// 重置 businessId
businessId.value=null
// 重置封面图片
handleRemove()
// 清除标签
formData.tagArray=[]
  
  emit('update:modelValue', false)
}

// 表单数据
const formData=reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "tagArray": [],
    "id": ""
})

// 表单验证规则
const rules=reactive({
  // prop="title" 的验证规则项
  title:[
    {required:true,message:'请输入文章标题',trigger:'blur'},
    {max:200,message:'文章标题最多200个字符',trigger:'blur'}
  ],
  categoryId:[
    {required:true,message:'请选择分类',trigger:'change'}
  ],
  content:[
    {required:true,message:'请输入文章内容',trigger:'blur'},
    {max:5000,message:'文章内容最多5000个字符',trigger:'blur'}
  ],
})
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
// 上传前的回调函数 用来校验文件类型和大小等
// 判断图片是否上传成功
const image=ref('')
const businessId=ref('')
const beforeUpload=(file)=>{
// 针对上传的文件进行校验
// console.log(file)
// 类型判断
const isimage=file.type.startsWith('image/')
// 大小判断
const  isLt5M=file.size/1024/1024<5
if(!isimage){
  ElMessage.error('请上传图片文件')
  return false
}
if(!isLt5M){
  ElMessage.error('图片大小不能超过5MB')
  return false
}
return true
}
// 调用上传文件接口 async await
const handleUploadRequest=async({file})=>{
  // 如果是编辑模式，使用现有的 businessId；否则生成新的 UUID
  if(!businessId.value){
    businessId.value=crypto.randomUUID()
  }
  
  const fileRes = await uploadFile(file,{
   businessId:businessId.value,
 })
 console.log('完整响应:', fileRes)
 console.log('filePath:', fileRes.filePath)
 console.log('data:', fileRes.data)

// 获取文件路径（兼容两种格式）
const filePath = fileRes.filePath || (fileRes.data && fileRes.data.filePath)
console.log('最终文件路径:', filePath)

//  拼接完整的图片地址
image.value = filePath ? fileBaseUrl + filePath : ''
 console.log(image.value)
//  赋值给表单数据
formData.coverImage=image.value
}

// 移除封面按钮
const handleRemove=()=>{
  image.value=''
  formData.coverImage=''
}
// 富文本编辑器内容改变时的回调函数
const handleContentChange=(data)=>{
  // formData.content=content
  console.log(data,'富文本内容')
  formData.content=data.html
}
// 富文本编辑器创建时的回调函数
const editorInstance=ref(null)
const handleEditorCreated=(editor)=>{
  editorInstance.value=editor
  // 编辑
  // nextTick 是 Vue 提供的一个 异步方法 ，用于在 DOM 更新完成后 执行回调函数。
  if(formData.content&&editor){
    nextTick(()=>{
      editor.setHtml(formData.content)
    })
  }
}
const btnPreview=ref(false)

// 提交新增表单
// 提交表单
const formRef=ref(null)
const loading=ref(false)
const handleSubmit=()=>{
  formRef.value.validate((valid,fields)=>{
    if(valid){
      loading.value=true
      console.log(formData,'FormData')
      const submitData={
        ...formData,
        tags:formData.tagArray.join(',')
      }
      delete submitData.tagArray
      
      // 根据是否是编辑模式调用不同的接口
      const apiPromise = isEdit.value 
        ? updateArticle(submitData) 
        : createArticle(submitData)
      apiPromise.then(res=>{
        loading.value=false
        ElMessage.success(isEdit.value ? '文章更新成功' : '文章创建成功')
        emit('success')
        handleClose()
      })
    }
  })
}
// 提交新增表单
</script>

<style lang="scss" scoped>
.cover-placeholder{
 width: 200px;
 height: 120px;
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 color: #8b949e;
 background: #f6f8fa;
}
.cover-image{
  width: 200px;
  height: 120px;
  display:block;
}
</style>