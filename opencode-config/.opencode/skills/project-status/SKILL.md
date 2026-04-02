---
name: project-status
description: 唯讀查看專案進度狀態（讀取 Claude Code 的 progress.md + git log）
---

## 專案狀態查看（唯讀）

這個 skill 用來查看目前專案的進度狀態。**絕對不修改任何檔案。**

### 步驟

1. 搜尋 `~/.claude/projects/` 下與目前工作目錄對應的 `memory/progress.md`
2. 如果找到，讀取並顯示：
   - ✅ 已完成項目
   - 🔄 進行中項目
   - ⚠️ 已知問題
   - 📌 下次建議
3. 執行 `git status --short` 和 `git log --oneline -5` 顯示 Git 狀態
4. 顯示未 push 的 commits 數量

### 重要限制

- **僅讀取，不寫入**任何檔案
- **不修改** progress.md（屬於 Claude Code）
- **不修改** pm-last.txt
- 用繁體中文回覆
