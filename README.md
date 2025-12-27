# Resume Builder (简历生成器)

![Electron](https://img.shields.io/badge/Electron-Latest-blue?logo=electron)
![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-38B2AC?logo=tailwindcss)

基于 **Electron** + **Vue 3** + **TypeScript** 打造的现代化桌面端简历制作工具。支持实时预览、多模板切换、模块化编辑，助你轻松打造专业简历。

> **注意**：本项目数据完全存储在本地，保护您的隐私安全。

## ✨ 功能特性 (Features)

- **🎨 多模板支持**: 内置多款专业简历模板（经典、现代、极简、创意等），一键切换风格。
- **📝 实时所见即所得**: 左侧编辑，右侧实时预览，修改立即生效。
- **🧩 模块化管理**:
  - 支持 **拖拽排序**：自由调整各模块（教育、工作、项目等）的顺序。
  - **开关控制**：按需显示或隐藏特定模块（如奖项、科研经历等）。
  - **丰富模块**：包含个人信息、教育经历、工作经历、项目经历、专业技能、奖项荣誉、科研经历、作品集等。
- **💾 工程文件管理**: 支持保存为 `.cvjson` 格式的工程文件，随时重新加载编辑，无需重复输入。
- **📄 高清 PDF 导出**: 一键导出高质量 PDF 文件，完美适配 A4 纸张。
- **🛠️ 高度个性化**:
  - 支持自定义 **主题色**。
  - 自由调节 **字体大小**、**行高**、**页边距**。
  - 内置 Markdown / 富文本编辑器，支持列表、加粗等排版。

## 🚀 快速开始 (Getting Started)

### 安装 (Installation)

1. 前往 [Releases](https://github.com/AsYukiZzz/resume_builder/releases) 页面下载对应系统的安装包（Windows / macOS / Linux）。
2. 安装并启动应用。

### 开发 (Development)

如果您是开发者，想要自行构建或贡献代码：

#### 环境要求
- Node.js (推荐 v16+)
- npm 或 yarn

#### 步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/AsYukiZzz/resume_builder.git
   cd resume_builder
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建应用**
   ```bash
   # Windows
   npm run build:win

   # macOS
   npm run build:mac

   # Linux
   npm run build:linux
   ```

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: [Electron](https://www.electronjs.org/), [Vue 3](https://vuejs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/), [Electron-Vite](https://electron-vite.org/)
- **样式**: [TailwindCSS](https://tailwindcss.com/)
- **打包工具**: [Electron-Builder](https://www.electron.build/)
- **编辑器组件**: [Tiptap](https://tiptap.dev/) (富文本), [vuedraggable](https://github.com/SortableJS/vue.draggable.next) (拖拽)
- **图标**: [Lucide Vue Next](https://lucide.dev/)

## 📝 目录结构 (Directory Structure)

```
resume_builder/
├── src/
│   ├── main/          # Electron 主进程
│   ├── preload/       # 预加载脚本
│   └── renderer/      # Vue 渲染进程 (UI 界面)
│       ├── src/
│       │   ├── components/    # 组件 (编辑器, 模板等)
│       │   ├── composables/   # 组合式函数 (逻辑复用)
│       │   ├── config/        # 配置文件 (Schema)
│       │   └── assets/        # 静态资源
├── electron.vite.config.ts    # Vite 配置
└── package.json
```

## 🤝 贡献 (Contributing)

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证 (License)

[MIT License](LICENSE)
