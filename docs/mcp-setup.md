# OpenCode MCP 設定經驗

## 什麼是 MCP

MCP（Model Context Protocol）是一個開放協議，讓 AI 工具能與外部服務和系統整合。

## OpenCode MCP 設定結構

```json
{
  "mcp": {
    "<mcp-name>": {
      "enabled": true | false,
      "type": "local" | "stdio",
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

> **注意：** 部分較早的設定可能將 command 設為 Array (例如 `["uvx", "windows-mcp"]`)，或者環境變數鍵值使用 `environment` 而非 `env`。以實際運作成功的參數為準。

## 目前設定的 MCP (狀態：啟用且運作正常)

目前主要設定檔位於 `opencode-config/opencode.json`，以下為最新的穩定設定。

### 1. windows-mcp（已啟用）

提供作業系統層級（檔案、系統管理、PowerShell）的控制權限。

```json
"windows-mcp": {
  "enabled": true,
  "type": "local",
  "command": ["C:\\Users\\benth\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python313\\Scripts\\uvx.exe", "windows-mcp"]
}
```

- 使用 `uvx` 啟動 Windows MCP 伺服器
- 使用絕對路徑指定 `uvx.exe` 的位置以避免路徑問題
- 支援透過 PowerShell 執行命令與系統操作

### 2. google-workspace（已啟用）

整合 Gmail、Google Calendar、Docs、Drive、Sheets 等 Google 工作區服務。

```json
"google-workspace": {
  "enabled": true,
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "google-workspace-mcp", "serve"],
  "env": {
    "GOOGLE_MCP_ACCOUNTS_PATH": "C:\\Users\\benth\\.google-mcp\\accounts.json"
  }
}
```

- 使用 `stdio` 類型，以 `npx` 動態下載並執行
- 使用 `args` 傳遞參數，而非將其併入 `command` 陣列
- 使用 `env` 指定 `GOOGLE_MCP_ACCOUNTS_PATH` 環境變數
- **必要前置作業：**
  - 需要在 Google Cloud 建立憑證 (`credentials.json`)
  - 需放置於 `~/.google-mcp/credentials.json`
  - 使用指令新增帳號：`npx google-workspace-mcp accounts add <帳號名稱>`

## 啟用與驗證流程

1. 在 `opencode.json` 中將 `enabled` 設為 `true`
2. 確保執行檔 (如 `uvx.exe`, `npx`) 的路徑或系統全域環境變數設置正確
3. 重新啟動 OpenCode
4. 驗證方式：
   - 詢問 Agent「MCP 運作正常嗎？」
   - 對於 `windows-mcp`：可要求執行簡單的 PowerShell 測試命令 (例如 `Write-Output 'OK'`)
   - 對於 `google-workspace`：可要求列出當前設定的帳戶

## 常見問題

| 問題 | 解法 |
|------|------|
| MCP 無法啟動 | 檢查 command 路徑是否正確，或嘗試使用絕對路徑 |
| 參數或環境變數不吃 | 確認使用最新的鍵名 (`command`/`args`/`env` 組合) |
| 認證失敗 | 確認 ~/.google-mcp/ 目錄下有正確的 `credentials.json` 與 `accounts.json` |
| 權限不足 | 以系統管理員權限執行 OpenCode，或調整該資料夾的使用者權限 |

## 相關檔案

- 設定檔：`opencode.json` 或 `opencode-config/opencode.json`
- Google Workspace 認證與帳戶：`~/.google-mcp/`
