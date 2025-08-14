# Token Pool Frontend

这是一个基于 React + TypeScript + Vite 的单页面应用，用于 Token Pool 项目的用户界面。

## 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速构建工具
- **CSS3** - 样式和动画

## 项目结构

```
frontend/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── App.css          # 应用样式
│   ├── main.tsx         # 应用入口点
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── README.md            # 项目说明
```

## 功能特性

- 🎨 深色主题设计
- 📱 响应式布局
- 🔥 自动挖矿功能
- 📊 数据统计面板
- 💰 钱包连接功能
- ✨ 平滑动画效果

## 快速开始

### 安装依赖

```bash
cd frontend
npm install
# 或者使用 yarn
yarn install
```

### 开发模式

```bash
npm run dev
# 或者使用 yarn
yarn dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
# 或者使用 yarn
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或者使用 yarn
yarn preview
```

## 开发说明

- 项目使用函数式组件和 React Hooks
- 样式采用 CSS 模块化设计
- 支持 TypeScript 类型检查
- 包含 ESLint 代码规范检查

## 自定义配置

可以在以下文件中修改配置：

- `vite.config.ts` - 构建和开发服务器配置
- `tsconfig.json` - TypeScript 编译选项
- `.eslintrc.cjs` - 代码规范规则 