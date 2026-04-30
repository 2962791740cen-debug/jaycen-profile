# 树成林 | 终极微光

一个完整的交互式认知探索网站。

## 🚀 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

1. **初始化 Git 仓库并推送代码**

```bash
# 在 shulin-web 目录下执行
git init
git add .
git commit -m "Initial commit: 树成林网站完整版"
git branch -M main
git remote add origin https://github.com/yimeic895/shulin.git
git push -u origin main
```

2. **启用 GitHub Pages**

   - 进入仓库：https://github.com/yimeic895/shulin
   - 点击 `Settings` → `Pages`
   - 在 `Source` 中选择 `GitHub Actions`
   - 保存设置

3. **自动部署**

   - 推送代码后，GitHub Actions 会自动构建并部署
   - 部署完成后，网站地址为：`https://yimeic895.github.io/shulin/`

### 方法二：手动部署

如果 GitHub Actions 不可用，可以手动部署：

```bash
# 1. 构建项目
npm run build

# 2. 进入 dist 目录
cd dist

# 3. 初始化 Git（如果还没有）
git init
git add .
git commit -m "Deploy to GitHub Pages"

# 4. 推送到 gh-pages 分支
git branch -M gh-pages
git remote add origin https://github.com/yimeic895/shulin.git
git push -u origin gh-pages
```

然后在 GitHub 仓库设置中，将 Pages 的 Source 设置为 `gh-pages` 分支。

## 📝 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🌐 访问地址

部署成功后，网站可通过以下地址访问：
- `https://yimeic895.github.io/shulin/`

## 📦 项目结构

```
shulin-web/
├── src/
│   ├── App.jsx          # 主应用组件（所有页面）
│   ├── main.jsx         # 入口文件
│   └── index.css        # 全局样式
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions 部署配置
├── vite.config.js       # Vite 配置（已配置 base: '/shulin/'）
└── package.json
```

## ⚙️ 配置说明

- **base 路径**：已设置为 `/shulin/`，适配 GitHub Pages 部署
- **构建输出**：`dist/` 目录
- **自动部署**：推送到 `main` 分支时自动触发

## 🔧 故障排除

如果网站无法正常访问：

1. 检查 GitHub Pages 设置是否正确
2. 确认 `vite.config.js` 中的 `base` 路径与仓库名匹配
3. 查看 GitHub Actions 的构建日志是否有错误
4. 清除浏览器缓存后重新访问

