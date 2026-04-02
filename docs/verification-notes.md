# 驗證紀錄

2026-04-02 針對已知問題的驗證結果。

---

## 1. git-attribution plugin

- **檔案**：`.opencode/plugins/git-attribution.ts`
- **機制**：hook `tool.execute.after`，檢查 bash 的 git commit 指令是否包含 `Tool: OpenCode`
- **結果**：設計正確
- **限制**：僅 console.warn 提醒，無法阻止缺少 attribution 的 commit
- **建議**：如需強制，可改為 throw error 阻斷 commit

## 2. windows-mcp

- **設定**：`opencode.json` 中 `"command": ["uvx", "windows-mcp"]`
- **結果**：無法使用
- **原因**：`uvx`（uv）未安裝
- **修復**：需先安裝 `winget install astral-sh.uv`，之後 `uvx windows-mcp` 即可啟動
- **備註**：Claude Code 透過自己的 MCP 設定已能使用 windows-mcp，OpenCode 端僅差此前置依賴

## 3. bge-m3 配置

- **狀態**：已新增至 opencode.json
- **設定**：context 8192、output 8192
- **用途**：embedding model，用於語意搜尋（OpenCode 是否支援 embedding 功能待確認）
