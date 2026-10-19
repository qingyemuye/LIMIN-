# 日常 · 个人工作台

轻量、无运行时依赖的中文个人工作台。待办、可编辑快捷入口、笔记、日历和专注计时，数据保存在当前浏览器的 localStorage 中。可通过设置导出和导入备份。

首次打开提供可删除的示例待办、笔记和快捷入口。计时器在刷新或关闭页面后重置；其余数据持久保存在浏览器中。

## 启动

```sh
cd /workspace/LIMIN-
python3 -m http.server 3000 --bind 0.0.0.0
```

无需安装依赖或构建。清除浏览器网站数据会删除本地记录，请定期导出备份。

## 检查

```sh
node --check app.js
```

## GitHub Pages 发布

网站文件已放在仓库根目录，`.nojekyll` 用于直接发布静态资源。

在仓库 **Settings → Pages** 中设置：

- Source：**Deploy from a branch**
- Branch：**main**
- Folder：**/ (root)**

点击 **Save**，等待 GitHub 部署结束，再通过 Pages 设置页的 **Visit site** 打开。启用成功后的预期地址为 `https://qingyemuye.github.io/LIMIN-/`。后续推送到 `main` 的修改会自动更新站点。
