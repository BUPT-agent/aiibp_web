# AI 智能面试系统 - 交互式演示项目 (Interactive BP)

这是一个基于 **React** 和 **Tailwind CSS** 构建的交互式商业计划书演示系统。该项目旨在通过动态图表、算法可视化和交互式组件，直观地展示 AI 智能面试系统的核心价值、技术架构与商业潜力。

## 📁 推荐项目结构

建议使用标准 Vite React 项目结构：

```text
ai-interview-system/
├── public/                 # 静态资源目录
├── src/
│   ├── assets/             # 图片、SVG 等资源
│   ├── components/         # 组件目录
│   │   └── AI_Interview_Interactive_BP.jsx  # 核心演示组件
│   ├── App.jsx             # 主入口组件
│   ├── main.jsx            # 渲染入口
│   └── index.css           # 全局样式 (包含 Tailwind 指令)
├── index.html              # HTML 模板
├── package.json            # 项目依赖配置
├── tailwind.config.js      # Tailwind 配置文件
├── postcss.config.js       # PostCSS 配置
└── vite.config.js          # Vite 构建配置
```

## 🚀 快速开始 (本地开发)

### 1. 环境准备

确保您的电脑上已安装 **Node.js** (推荐 `v20.17.0+` 或 `v22.9.0+` LTS 版本)。

### 2. 初始化项目

打开终端，执行以下命令初始化 Vite 项目：

```bash
# 创建项目
npm create vite@latest ai-interview-bp -- --template react

# 进入目录
cd ai-interview-bp

# 安装基础依赖
npm install
```

### 3. 安装样式与图标库

本项目依赖 Tailwind CSS v3 和 Lucide React。

> ⚠️ **注意**：请务必指定安装 **Tailwind CSS v3** 版本，以避免兼容性问题。

```bash
# 安装依赖
npm install -D tailwindcss@3 postcss autoprefixer
npm install lucide-react

# 初始化 Tailwind 配置
npx tailwindcss init -p
```

### 4. 项目配置

#### 配置 `tailwind.config.js`

修改 `content` 数组以匹配您的文件路径：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 配置 `src/index.css`

清空原有内容，添加以下 Tailwind 指令：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. 导入核心代码

1.  将 `AI_Interview_Interactive_BP.jsx` 文件放入 `src/components/` 目录。
2.  修改 `src/App.jsx`，引入组件：

```jsx
import AI_Interview_Interactive_BP from './components/AI_Interview_Interactive_BP'

function App() {
  return (
    <div className="w-full h-screen">
      <AI_Interview_Interactive_BP />
    </div>
  )
}

export default App
```

### 6. 启动项目

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果。

## 📦 部署上线

### 构建生产版本

```bash
npm run build
```

构建完成后，生成的静态文件位于 `dist/` 目录。

### 部署平台推荐

*   **Vercel**: 推荐使用，直接连接 GitHub 仓库或使用 CLI 部署。
*   **GitHub Pages**: 修改 `vite.config.js` 添加 `base` 路径配置后部署。

## 🛠️ 技术栈

*   **核心框架**: React 18
*   **构建工具**: Vite
*   **样式方案**: Tailwind CSS (Utility-first)
*   **图标库**: Lucide React
*   **动画**: CSS3 Keyframes & Transitions

## ❓ 常见问题 (FAQ)

**Q: 为什么报错 `could not determine executable to run`？**

A: 这是因为安装了 Tailwind CSS v4。请运行 `npm install -D tailwindcss@3 postcss autoprefixer` 强制安装 v3 版本。

**Q: 页面显示默认的 Vite + React 欢迎页？**

A: 您可能忘记修改 `src/App.jsx` 了。请确保将 `App.jsx` 的内容替换为引入 `AI_Interview_Interactive_BP` 组件的代码。