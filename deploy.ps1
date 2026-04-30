# 树成林网站 - 快速部署脚本
# 使用方法：在 PowerShell 中运行 .\deploy.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "树成林网站 - GitHub Pages 部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否安装
try {
    $gitVersion = git --version
    Write-Host "✓ Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git 未安装！" -ForegroundColor Red
    Write-Host "请先安装 Git: https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""

# 检查是否已初始化 Git
if (Test-Path .git) {
    Write-Host "✓ Git 仓库已初始化" -ForegroundColor Green
} else {
    Write-Host "正在初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git 仓库初始化完成" -ForegroundColor Green
}

Write-Host ""

# 添加所有文件
Write-Host "正在添加文件到 Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ 文件已添加" -ForegroundColor Green

Write-Host ""

# 检查是否有远程仓库
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "✓ 远程仓库已配置: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "正在配置远程仓库..." -ForegroundColor Yellow
    git remote add origin https://github.com/yimeic895/shulin.git
    Write-Host "✓ 远程仓库配置完成" -ForegroundColor Green
}

Write-Host ""

# 提交代码
Write-Host "正在提交代码..." -ForegroundColor Yellow
$commitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage
Write-Host "✓ 代码已提交" -ForegroundColor Green

Write-Host ""

# 设置分支为 main
Write-Host "正在设置分支..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ 分支已设置为 main" -ForegroundColor Green

Write-Host ""

# 推送代码
Write-Host "正在推送到 GitHub..." -ForegroundColor Yellow
Write-Host "（如果提示输入用户名和密码，请输入你的 GitHub 凭据）" -ForegroundColor Cyan
Write-Host ""
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ 部署成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步操作：" -ForegroundColor Cyan
    Write-Host "1. 访问 https://github.com/yimeic895/shulin" -ForegroundColor White
    Write-Host "2. 点击 Settings → Pages" -ForegroundColor White
    Write-Host "3. 在 Source 中选择 'GitHub Actions'" -ForegroundColor White
    Write-Host "4. 等待 2-5 分钟后，访问网站：" -ForegroundColor White
    Write-Host "   https://yimeic895.github.io/shulin/" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ 推送失败" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. 需要先拉取远程代码: git pull origin main --allow-unrelated-histories" -ForegroundColor White
    Write-Host "2. 需要配置 GitHub 凭据" -ForegroundColor White
    Write-Host "3. 仓库权限问题" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Read-Host "按 Enter 键退出"

