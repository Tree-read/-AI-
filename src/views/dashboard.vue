<!-- Dashboard（仪表盘/控制台） 通常是后台管理系统的 首页/概览页 -->
<template>
  <div class="dashboard-container">
    <!-- gutter 和 span 是 Element Plus 布局组件的属性，用于实现网格布局 
     gutter 属性：定义列之间的 间距 （单位：像素），作用在 el-row 上
     span 属性：定义列的宽度，作用在 el-col 上（Element Plus 的栅格系统将一行分为 24 等份）
     :gutter="20" 表示列之间的间距为 20px
     :span="6" 表示列的宽度为 6 等份 
     -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card v-if="aiData.systemOverview">
          <div class="card-content">
            <div class="avatar users"> 
            <el-image :src="iconUrl1" style="width:40px;height: 40px;"/>
          </div>
          <div class="info">
            <p class="title">总用户数</p>
            <p class="number">{{aiData.systemOverview.totalUsers || 0 }}</p>
            <p class="subtitle-title">活跃用户：{{ aiData.systemOverview.activeUsers || 0 }}</p>
          </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card  v-if="aiData.systemOverview">
            <div class="card-content">
              <div class="avatar like"> 
            <el-image :src="iconUrl2" style="width:40px;height: 40px;"/>
          </div>
          <div class="info">
            <p class="title">情绪日志</p>
            <p class="number">{{aiData.systemOverview.totalDiaries || 0 }}</p>
            <p class="subtitle-title">今日新增：{{ aiData.systemOverview.todayNewDiaries || 0 }}</p>
          </div>
            </div>   
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card  v-if="aiData.systemOverview">
          <div class="card-content">
            <div class="avatar comments"> 
            <el-image :src="iconUrl3" style="width:40px;height: 40px;"/>
          </div>
          <div class="info">
            <p class="title">咨询会话</p>
            <p class="number">{{aiData.systemOverview.totalSessions || 0 }}</p>
            <p class="subtitle-title">今日新增：{{ aiData.systemOverview.todayNewSessions || 0 }}</p>
          </div>
          </div>
          
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card  v-if="aiData.systemOverview">
          <div class="card-content"> 
            <div class="avatar smile"> 
            <el-image :src="iconUrl4" style="width:40px;height: 40px;"/>
          </div>
          <div class="info">
            <p class="title">平均情绪</p>
            <p class="number">{{aiData.systemOverview.avgMoodScore || 0 }}/10</p>
            <p class="subtitle-title">情绪健康指数</p>
          </div>
        </div>      
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card style="width:100%">
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
          <div class="chart-content">
            <!-- ref="emotionChartRef" 用于获取图表元素的引用，后续可以在代码中使用该引用进行图表操作 -->
            <div ref="emotionChartRef" style="width: 100%;height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="width:100%" >
          <template #header>
            <div class="card-header">咨询会话统计</div>
          </template>
          <div class="chart-content">
            <div class="consultation-stats" v-if="aiData.consultationStats">
              <div class="stat-item">
                <div class="stat-label">总会话数</div>
                <div class="stat-value">{{aiData.consultationStats.totalSessions }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">平均时长</div>
                <div class="stat-value">{{aiData.consultationStats.avgDurationMinutes}}s</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">活跃用户</div>
                <div class="stat-value">{{aiData.systemOverview.activeUsers}}</div>
              </div>
            </div>
            <div ref="consultationChartRef" style="width: 100%;height: 260px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
        <el-card style="width:100%">
          <template #header>
            <div class="card-header">用户活跃度趋势</div>
          </template>
          <div class="chart-content">
            <div ref="userActivtyChartRef" style="width: 100%;height: 300px;"></div>
          </div>
        </el-card>
    </el-row>
  </div>
</template>
<script setup>
import { getAnalysisData } from '@/api/admin'
import { onMounted,ref } from 'vue'
import * as echarts from 'echarts'
// 统计图片引入
const iconUrl1=new URL('@/assets/images/users.png',import.meta.url).href
const iconUrl2=new URL('@/assets/images/like.png',import.meta.url).href
const iconUrl3=new URL('@/assets/images/comments.png',import.meta.url).href
const iconUrl4=new URL('@/assets/images/smile.png',import.meta.url).href

const aiData=ref({})

// 初始化图表
const initCharts=()=>{
initEmotionChart()
initConsultationChart()
initUserActivtyChart()
}
// 1 初始化情绪趋势分析图表
// 情绪趋势分析图表
let emotionChart=null
const emotionChartRef=ref(null)
const initEmotionChart=()=>{
  if(!emotionChartRef.value)return
  //销毁现有的图表
  if(emotionChart){
    emotionChart.dispose()
  }
  // 初始化图表
  emotionChart=echarts.init(emotionChartRef.value)
  //1 获取情绪趋势的数据
  const TrendDat=aiData.value.emotionTrend
  // 配置项
  const option={
    // 图表标题
    title: {
      text: '情绪趋势分析',
      textStyle: {
        color: '#2d3436',
        fontSize: 16,
        fontWeight: 'bold'
      },
      left: 'center',
      top: 10,
      },
      // 提示框
    tooltip:{
      trigger: 'axis',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle:{
        color: '#2d3436'
      },
      padding: 10,
      backgroundColor: '#fff',
    },
    // 控制容器图表的间距
    grid:{
      top: 80,
      bottom: '3%',
      left: '3%',
      right: '4%',
    },
    // 图例
    legend:{
      data: ['平均情绪评分','记录数量'],
      top:40,
    },
    // x轴
    xAxis:{
      type: 'category',
      data: TrendDat.map(item=>item.date),
      axisLine:{
        lineStyle:{
          color: '#2d3436'
        }
      }
    },
    // y轴
    yAxis:[
      {
        type: 'value',
        name: '情绪评分',
        position: 'left',
        axisLine:{
          lineStyle:{
            color: '#2d3436'
          }
        } 
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLine:{
          lineStyle:{
            color: '#2d3436'
          }
        } 
      }
    ],
    // 数据系列
    series:[
      {
        name: '平均情绪评分',
        type: 'line',
        data: TrendDat.map(item=>item.avgMoodScore),
        smooth: true,
        lineStyle:{
          color: '#faebaf',
          width: 3,
        },
        itemStyle:{
          color: '#faebaf',
        }
      },
      {
        name: '记录数量',
        type: 'line',
        data: TrendDat.map(item=>item.recordCount),
        smooth: true,
        lineStyle:{
          color: '#eeb5a3',
          width: 3,
        },
        itemStyle:{
          color: '#eeb5a3',
        }
      }
    ]
    }
    // 渲染图表
    emotionChart.setOption(option)
  }
// 2 初始化咨询会话统计图表
// 咨询会话统计图表
let consultationChart=null //接收echarts实例
const consultationChartRef=ref(null)//接受dom实例
const initConsultationChart=()=>{
   if(!consultationChartRef.value)return
  //销毁现有的图表
  if(consultationChart){
    consultationChart.dispose()
  }
  // 初始化图表
  consultationChart=echarts.init(consultationChartRef.value)
  // 获取数据
  const dailyTrend=aiData.value.consultationStats.dailyTrend
  const option = {
  title: {
    text: '咨询活动统计',
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#2d3436'
    },
    left: 'center',
    top: 10
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#fab1a0',
    borderWidth: 1,
    textStyle: {
      color: '#2d3436'
    }
  },
  legend: {
    data: ['会话数量', '参与用户数'],
    top: 40,
    textStyle: {
      color: '#636e72'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: 80,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: dailyTrend.map(item => item.date),
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    axisLabel: {
      color: '#636e72'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#636e72'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.1)'
      }
    }
  },
  series: [
    {
      name: '会话数量',
      type: 'bar',
      data: dailyTrend.map(item => item.sessionCount),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#74b9ff' },
            { offset: 1, color: '#0984e3' }
          ]
        }
      },
      barWidth: '40%'
    },
    {
      name: '参与用户数',
      type: 'bar',
      data: dailyTrend.map(item => item.userCount),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#fdcb6e' },
            { offset: 1, color: '#f39c12' }
          ]
        }
      },
      barWidth: '40%'
    }
  ]
}
// 渲染图表
consultationChart.setOption(option)
}
// 3 初始化用户活跃度趋势图表
// 用户活跃度趋势图表
let userActivtyChart=null //接收echarts实例
const userActivtyChartRef=ref(null)//接受dom实例
const initUserActivtyChart=()=>{
   if(!userActivtyChartRef.value)return
  //销毁现有的图表
  if(userActivtyChart){
    userActivtyChart.dispose()
  }
  // 初始化图表
  userActivtyChart=echarts.init(userActivtyChartRef.value)
  // 获取数据
  const activityData=aiData.value.userActivity
  const option = {
  title: {
    text: '用户活跃度趋势',
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#2d3436'
    },
    left: 'center',
    top: 10
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#fab1a0',
    borderWidth: 1,
    textStyle: {
      color: '#2d3436'
    }
  },
  legend: {
    data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
    top: 40,
    textStyle: {
      color: '#636e72'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: 80,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: activityData.map(item => item.date),
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    axisLabel: {
      color: '#636e72'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#636e72'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(244, 162, 97, 0.1)'
      }
    }
  },
  series: [
    {
      name: '活跃用户',
      type: 'line',
      data: activityData.map(item => item.activeUsers),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#a29bfe'
      },
      itemStyle: {
        color: '#a29bfe'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
            { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
          ]
        }
      }
    },
    {
      name: '新增用户',
      type: 'line',
      data: activityData.map(item => item.newUsers),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#fdcb6e'
      },
      itemStyle: {
        color: '#fdcb6e'
      }
    },
    {
      name: '日记用户',
      type: 'line',
      data: activityData.map(item => item.diaryUsers),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#00b894'
      },
      itemStyle: {
        color: '#00b894'
      }
    },
    {
      name: '咨询用户',
      type: 'line',
      data: activityData.map(item => item.consultationUsers),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#fab1a0'
      },
      itemStyle: {
        color: '#fab1a0'
      }
    }
  ]
}
// 渲染图表
userActivtyChart.setOption(option)
}



// 初始化时获取数据分析
// 1. 调用 getAnalysisData 函数获取数据分析
// 2. 将获取到的数据赋值给 aiData
onMounted(()=>{
  getAnalysisData().then(res=>{
    aiData.value=res.data
    // 初始化图表
    initCharts()
    // console.log(res)
  })
})

</script>

<style scoped lang="scss">
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-content {
      padding: 20px;
      height: 300px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }
</style>