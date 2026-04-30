# 部署指南

## 快速部署步骤

### 前提条件
- 已安装 Git（如果没有，请从 https://git-scm.com/downloads 下载安装）
- 已安装 Node.js（项目已安装，无需重复安装）

### 步骤 1：初始化 Git 仓库

打开 PowerShell 或命令提示符，进入项目目录：

```powershell
cd "D:\树林\shulin os\shulin-web"
```

### 步骤 2：初始化并提交代码

```powershell
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 树成林网站完整版"

# 重命名分支为 main
git branch -M main
```

### 步骤 3：连接到 GitHub 仓库

```powershell
# 添加远程仓库
git remote add origin https://github.com/yimeic895/shulin.git

# 推送代码到 GitHub
git push -u origin main
```

**注意**：如果这是第一次推送，GitHub 可能会要求你输入用户名和密码（或 Personal Access Token）。

### 步骤 4：启用 GitHub Pages

1. 打开浏览器，访问：https://github.com/yimeic895/shulin
2. 点击仓库右上角的 `Settings`（设置）
3. 在左侧菜单中找到 `Pages`（页面）
4. 在 `Source`（源）下拉菜单中选择 `GitHub Actions`
5. 点击 `Save`（保存）

### 步骤 5：等待自动部署

- GitHub Actions 会自动开始构建和部署
- 你可以在仓库的 `Actions` 标签页查看部署进度
- 部署完成后（通常需要 2-5 分钟），网站就可以访问了

### 步骤 6：访问网站

部署成功后，网站地址为：
**https://yimeic895.github.io/shulin/**

---

## 后续更新

当你修改代码后，只需要：

```powershell
git add .
git commit -m "更新描述"
git push
```

GitHub Actions 会自动重新构建和部署。

---

## 如果遇到问题

### 问题 1：Git 命令不可用
- 下载安装 Git：https://git-scm.com/downloads
- 安装后重启 PowerShell

### 问题 2：推送被拒绝
- 如果仓库不是空的，可能需要先拉取：`git pull origin main --allow-unrelated-histories`

### 问题 3：GitHub Actions 部署失败
- 检查 `.github/workflows/deploy.yml` 文件是否存在
- 查看 Actions 标签页的错误日志
- 确保 `vite.config.js` 中的 `base: '/shulin/'` 配置正确

### 问题 4：网站显示 404
- 等待几分钟，GitHub Pages 需要时间生效
- 检查仓库设置中的 Pages 配置
- 确认 base 路径与仓库名匹配

---

## 需要帮助？

如果遇到任何问题，可以：
1. 查看 GitHub Actions 的构建日志
2. 检查浏览器控制台是否有错误
3. 确认所有文件都已正确提交到仓库

