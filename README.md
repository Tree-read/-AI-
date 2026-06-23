# 心理健康AI助手管理端

> 基于 Vue3 + Vite 构建的心理健康AI助手后台管理系统

## 🌟 项目介绍

本项目是为心理健康AI助手平台打造的专业后台管理系统，旨在帮助运营人员高效管理心理科普内容、实时监控用户心理健康数据，为心理援助工作提供数据支撑和决策依据。

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 3.x |
| 构建工具 | Vite | 6.x |
| UI组件 | Element Plus | 2.x |
| 图表库 | ECharts | 5.x |
| 路由 | Vue Router | 4.x |
| 网络请求 | Axios | 1.x |
| 语言 | JavaScript | ES6+ |

## ✨ 功能特性

### 📚 文章管理模块
- 知识文章 CRUD 操作
- 内容发布/下线状态管理
- 分类筛选与分页检索
- 支持富文本编辑

### 📊 数据可视化大屏
- 用户注册量统计
- 情绪测评趋势分析
- 咨询会话转化率
- 实时数据监控面板

### 🔐 权限管理
- RBAC 基于角色的权限控制
- 管理员/运营双角色划分
- 路由级别的访问控制
- Token 自动续期机制

### 📈 系统特性
- 统一请求拦截与错误处理
- 请求去重优化性能
- 响应式布局设计
- 现代化 UI 界面

## 📁 项目结构

```
src/
├── components/           # 公共组件
│   ├── ArticleDialog.vue    # 文章编辑弹窗
│   ├── TableSearch.vue      # 表格搜索组件
│   ├── Navbar.vue           # 顶部导航栏
│   └── Sidebar.vue          # 侧边栏菜单
├── views/               # 页面视图
│   ├── login.vue            # 登录页面
│   ├── dashboard.vue        # 数据仪表盘
│   ├── knowledge.vue        # 知识文章管理
│   ├── consultation.vue     # 咨询记录
│   └── emotional.vue        # 情绪日志
├── api/                 # API 接口
│   └── admin.js             # 后端接口封装
├── router/              # 路由配置
│   └── index.js
├── utils/               # 工具函数
│   └── request.js           # Axios 封装
├── assets/              # 静态资源
│   └── images/              # 图片资源
├── App.vue              # 根组件
├── main.js              # 入口文件
└── style.css            # 全局样式
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🔧 开发指南

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 配置说明

代理配置位于 `vite.config.js`，修改目标服务器地址：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://your-server:port',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'feat: 添加xxx功能'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 📄 许可证

MIT License

