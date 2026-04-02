# OpenCode Enhance v0

2026-04-02 OpenCode 工具下載、環境設定、使用優化的完整記錄。

## 什麼是 OpenCode

[OpenCode](https://github.com/sst/opencode) 是開源的 AI coding CLI，類似 Claude Code 但支援多種 LLM provider（Anthropic、Google、Ollama 等）。

- GitHub: https://github.com/sst/opencode
- 版本: v1.3.13
- 安裝方式: WinGet (`SST.opencode`)

## 今日工作目標

1. 下載安裝 OpenCode 並設定本地 Ollama 模型
2. 配置 OpenCode 作為 Claude Code 的輔助工具
3. 在兩個專案中實際使用 OpenCode 並優化設定
   - **Claude_code_leak_v0** — Claude Code 原始碼研究
   - **UR_Program_Analysis_v0** — UR 機器人程式分析工具開發

## Repo 結構

```
├── env-setup/          環境安裝與設定紀錄
├── opencode-config/    OpenCode 設定檔（opencode.json、AGENTS.md、plugins、skills）
├── usage-records/      給 OpenCode 的任務指示紀錄
└── docs/               工作日誌
```
