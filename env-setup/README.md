# 環境設定紀錄

2026-04-02 完整環境配置。

## OS

- Windows 11 Home 10.0.26200

## OpenCode

- 版本: v1.3.12
- 安裝方式: WinGet
  ```powershell
  winget install SST.opencode
  ```
- 安裝路徑: `C:\Users\benth\AppData\Local\Microsoft\WinGet\Packages\SST.opencode_Microsoft.Winget.Source_8wekyb3d8bbwe\opencode`

## Ollama

- 版本: v0.15.2（client v0.19.0）
- 安裝的模型:

| 模型 | ID | 大小 | 用途 |
|---|---|---|---|
| qwen2.5-coder:14b-instruct-q4_K_M | 9ec8897f747e | 9.0 GB | 主力 coding model |
| qwen25-coder-16k | 1445cd2b1b4d | 9.0 GB | 16K context 版本 |
| deepseek-r1:8b | 6995872bfe4c | 5.2 GB | 推理模型 |
| bge-m3 | 790764642607 | 1.2 GB | embedding model |

模型設定（在 `opencode.json` 的 `provider.ollama` 中）:
- baseURL: `http://localhost:11434/v1`
- 使用 `@ai-sdk/openai-compatible` npm 套件作為 provider bridge

## Node.js / npm

- Node.js: v24.13.0
- npm: 11.6.2
- 關鍵 npm 依賴:
  - `@ai-sdk/openai-compatible`: ^2.0.37（Ollama 的 OpenAI-compatible provider）
  - `@opencode-ai/plugin`: 1.3.12（OpenCode plugin SDK）

## Python

- Python: 3.13.12（Microsoft Store）
- pip: 25.3
- 用於 UR_Program_Analysis_v0 工作區
- 依賴: `numpy>=1.24,<3`

## API Keys

- Gemini API Key（用於 `google/gemini-2.5-pro` 和 `google/gemini-2.5-flash`）
- 存放在各工作目錄的 `.env`，格式：
  ```
  GEMINI_API_KEY=...
  GOOGLE_GENERATIVE_AI_API_KEY=...
  ```

## 快速安裝指令

```bash
# 1. 安裝 OpenCode
winget install SST.opencode

# 2. 安裝 Ollama 模型
ollama pull qwen2.5-coder:14b-instruct-q4_K_M
ollama pull deepseek-r1:8b
ollama pull bge-m3:latest

# 3. 建立 16K context 自訂模型（可選）
# 建立 Modelfile 內容: FROM qwen2.5-coder:14b-instruct-q4_K_M\nPARAMETER num_ctx 16384
ollama create qwen25-coder-16k -f Modelfile

# 4. 安裝 npm 依賴（在專案目錄）
npm install @ai-sdk/openai-compatible

# 5. 設定 API Key
cp .env.example .env
# 編輯 .env 填入 Gemini API Key
```

## OpenCode 設定架構

```
專案根目錄/
├── opencode.json          # 主設定檔（provider、model、agent、permission、mcp）
├── AGENTS.md              # Agent 系統指示（OpenCode 版的 CLAUDE.md）
├── package.json           # npm 依賴
└── .opencode/             # OpenCode 客製化目錄
    ├── plugins/           # 自訂 plugin
    └── skills/            # 自訂 skill
```
