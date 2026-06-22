<template>
  <div>
    <PageHead title="情绪日志"></PageHead>
    <!-- 3 父组件通过 @事件名="处理函数" 监听并接收数据 -->
      <!-- :formItem="formItem"        发送
           @search="handleSearch"      监听 -->
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="用户ID" width="80"/>
      <el-table-column  label="会话ID" width="80">
        <template #default="scope">
         <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="moodScore" label="记录日期" width="120"/>
      <el-table-column  label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled></el-rate>
        </template>
      </el-table-column>
       <el-table-column  label="生活指标" width="120">
        <template #default="scope">
         <div>
          <p>睡眠：{{ scope.row.sleepQuality }}/5</p>
          <p>运动：{{ scope.row.stressLevel }}/5</p>
         </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪出发因素" width="120"/>
      <el-table-column prop="diaryContent" label="日记内容" width="250"/>
       <el-table-column  label="操作" width="240" fixed="right">
          <template #default="scope">
           <el-button @click="viewSessionDetail(scope.row)"  text type="primary">详情</el-button>
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
        <!-- v-model="detailDialogVisible" 控制弹窗显示显示隐藏
         close-on-click-modal 点击弹窗外部是否关闭弹窗 -->
        <el-dialog
        v-model="detailDialogVisible"
        title="情绪日志详情"
        width="800px">
        <div v-if="currentDeatil.id" class="detail-content">
          <div class="detail-section">
            <h4>用户信息</h4>
            <el-descriptions  :column="2" border>
              <el-descriptions-item label="用户名">{{ currentDeatil.username }}</el-descriptions-item>
              <el-descriptions-item label="昵称">{{ currentDeatil.nickname }}</el-descriptions-item>
              <el-descriptions-item label="用户ID">{{ currentDeatil.userId }}</el-descriptions-item>
              <el-descriptions-item label="记录日期">{{ currentDeatil.diaryDate }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="detail-section">
            <h4>情绪状态</h4>
             <el-descriptions  :column="2" border>
              <el-descriptions-item label="情绪评分">
                <el-rate :model-value="currentDeatil.moodScore" :max="10" disabled></el-rate>
              </el-descriptions-item>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getEmotionTagType(currentDeatil.dominantEmotion)">{{ currentDeatil.dominantEmotion|| '-' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="睡眠质量">{{ currentDeatil.sleepQuality || '-' }}/5</el-descriptions-item>
              <el-descriptions-item label="压力水平">{{ currentDeatil.stressLevel || '-' }}/5</el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="detail-section">
            <h4>日记内容</h4>
            <el-descriptions  :column="1" border>
              <el-descriptions-item label="情绪触发因素">{{ currentDeatil.emotionTriggers || '无' }}</el-descriptions-item>
              <el-descriptions-item label="日记内容">{{ currentDeatil.diaryContent || '无' }}</el-descriptions-item>
            </el-descriptions>
          </div>
           <div class="detail-section">
            <h4>AI情绪分析结果</h4>
            <div class="ai-analysis-result">
               <el-descriptions  :column="2" border>
                <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(aiData.primaryEmotion)">{{ aiData.primaryEmotion }}</el-tag>
               </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                <el-progress :percentage="aiData.emotionScore" color="getEmotionScoreColor(aiData.emotionScore)" :stroke-width="8"></el-progress>
              </el-descriptions-item>
              <el-descriptions-item label="风险等级">
                <el-tag :type="getRiskLevelTagType(aiData.riskLevel)">{{ aiData.riskLevel }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiData.isNegative?'danger':'success'">{{ aiData.isNegative?'负面情绪':'正面情绪' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="ai-suggestion-section">
              <h5>专业建议</h5>
              <div class="suggestion-content">{{ aiData.suggestion|| '无' }}</div>
            </div>
            <div class="ai-risk-section">
              <h5>风险描述</h5>
              <div class="risk-content">{{ aiData.riskDescription|| '无' }}</div>
            </div>
            <div class="ai-improvements-section">
              <h5>改善建议</h5>
              <ul class="improvements-content">
                <li v-for="item in aiData.improvementSuggestions" :key="item">{{ item }}</li>
              </ul>
            </div>
            </div>
          </div>
           <div class="detail-section">
            <h4>时间信息</h4>
            <el-descriptions  :column="2" border>
              <el-descriptions-item label="创建时间">{{ currentDeatil.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ currentDeatil.updatedAt }}</el-descriptions-item>  
            </el-descriptions>
           </div>
        </div>
        <template #footer>
          <el-button  @click="detailDialogVisible=false">关闭</el-button>
        </template>
        </el-dialog>
  </div>
</template>
<script setup>
import PageHead from '../components/PageHead.vue'
import TableSearch from '../components/TableSearch.vue'
import {onMounted, ref, reactive} from 'vue'
import {getEmotionalPage,deleteEmotional} from '@/api/admin'
import {ElMessageBox} from 'element-plus'

//情绪的映射 将情绪、分数、风险等级等数据 映射 到 Element Plus 的视觉样式（标签类型、颜色等）
// 1 用户情绪标签类型
// 将情绪文本（如"快乐"、"愤怒"）转换为 Element Plus el-tag 组件的 type 属性值。
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}
// 2 AI 分析情绪标签类型
const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}
// 3 情绪评分颜色
const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}
//4 风险等级标签类型
// 将风险等级数字（0-3）映射到标签类型。
const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}
// 5 风险等级文本
// 将风险等级数字（0-3）映射到文本描述。
const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
} 


// 父组件通过 formItem 来传递表单数据
const formItem=[
  {comp:'input',prop:'userId',label:'用户ID', placeholder:'请输入用户ID'
  },
  {
    comp:'select', prop:'moodScoreRange',label:'情绪评分',placeholder:'请选择情绪评分范围',
    options:[
      {label:'低分(1-3分)',value:'1-3'},
      {label:'中分(4-6分)',value:'4-6'},
      {label:'高分(7-10分)',value:'7-10'},
    ]
  },
]


// 列表数据
const tableData=ref([])
// 分页参数
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})
// 子组件通过 emit 触发 search 事件
const handleSearch=async (formData)=>{
  const params={
  ...pagination,
  ...formData
}
  const response=await getEmotionalPage(params)
  const {records,total}=response.data
  tableData.value=records
  pagination.total=total
}
onMounted(()=>{
  handleSearch({})
})


const handleChange=(page)=>{
  pagination.currentPage=page
  handleSearch()
}

// 详情
const detailDialogVisible=ref(false)
const currentDeatil=ref(null)
const aiData=ref(null)
// 查看详情
const viewSessionDetail=(row)=>{
  currentDeatil.value=row
  if(row.aiEmotionAnalysis){
    // JSON.parse() 是将 JSON 字符串 转换为 JavaScript 对象  ----解析
    // JSON.stringify() 是将 JavaScript 对象 转换为 JSON 字符串  ----序列化
    aiData.value=JSON.parse(row.aiEmotionAnalysis)
    console.log(aiData.value)
  }else{
    aiData.value={}
  }
  detailDialogVisible.value=true
}
// 删除
const handleDelete=async (row)=>{
  const confirm=await ElMessageBox.confirm('确认删除吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async ()=>{
    // 确认删除
    deleteEmotional(row.id).then(()=>{
      // 刷新列表
    handleSearch({})
    })
   
  })
}
</script>

<style  lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}
// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>