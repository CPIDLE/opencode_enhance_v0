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
      "command": ["executable", "args"],
      "environment": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

## 目前設定的 MCP

### 1. windows-mcp（目前停用）

Windows 系統管理用的 MCP。

```json
"windows-mcp": {
  "enabled": false,
  "type": "local",
  "command": ["uvx", "windows-mcp"]
}
```

- 使用 `uvx`（Python 工具執行器）啟動
- 路徑需依據本機 Python 安裝位置調整

### 2. google-workspace（目前停用）

Gmail、Google Calendar 整合。

```json
"google-workspace": {
  "enabled": false,
  "type": "local",
  "command": ["npx", "-y", "google-workspace-mcp", "serve"],
  "environment": {
    "GOOGLE_MCP_ACCOUNTS_PATH": "C:\\Users\\benth\\.google-mcp\\accounts.json"
  }
}
```

- 使用 npx 動態下載執行
- 需要預先建立 `accounts.json` 設定檔

## 啟用流程

1. 將 `enabled` 設為 `true`
2. 確認 command 路徑正確
3. 重新啟動 OpenCode

## 常見問題

| 問題 | 解法 |
|------|------|
| MCP 無法啟動 | 檢查 command 路徑是否正確 |
| 認證失敗 | 確認 accounts.json 存在且格式正確 |
| 權限不足 | 以系統管理員權限執行 |

## 相關檔案

- 設定檔：`opencode.json` 或 `opencode-config/opencode.json`
- Google Workspace 設定：`~/.google-mcp/accounts.json`
