# AGENTS.md — OpenCode Enhance v0

此 repo 記錄 OpenCode 工具的安裝、設定與使用優化。

---

## Build / Lint / Test

| 語言 | 測試 | Lint | Format |
|------|------|------|--------|
| TypeScript | `cd .opencode && bun test` | `bun run lint` | `bun run format` |
| Python | `pytest -q` | `ruff check .` | `ruff format .` |

單一測試：`bun test <檔名>`（路徑相對於 .opencode/）

---

## Response Style

- 回應精簡，直接給結果，不複述問題、不加開場白
- 改完檔案不逐行解釋 — 使用者看 diff 就懂
- 不重複輸出檔案完整內容，除非使用者要求
- 使用繁體中文回覆

---

## Code Style

### 命名
- 精確命名：`getUserById` 不叫 `fetchData`
- 避免模糊命名（`data2`、`result2`）

### 註解與類型
- 不加不必要的註解 — 程式碼本身應該自解釋
- 不加不必要的 type annotation — 能推導的就不寫

### 其他
- 不加 feature flags、backwards-compatibility shims
- 不做 speculative abstraction — 三行重複比過早抽象好
- 不 hardcode secrets — 用環境變數

---

## 文件品質

產生任何文件時：
- **具體**：用精確的技術術語，不用模糊詞
- **結構化**：用標題、列表、表格組織
- **可操作**：步驟可直接複製執行
- **程式碼範例**：必須是可執行的完整片段

### Markdown 規範

- 標題層級遞增（`#` → `##` → `###`），不跳層
- 程式碼區塊指定語言：`` ```typescript ``、`` ```python ``
- 表格要有表頭；路徑用反引號包起來

---

## Session 銜接

每次新 session 主動檢查：
1. `.opencode/session-notes.md`（如果存在）
2. `git log --oneline -5`
3. `git diff --stat`

完成工作後寫入 `.opencode/session-notes.md`：

```markdown
## 最後工作：YYYY-MM-DD HH:MM

### 完成
- ...

### 進行中
- ...

### 下一步
- ...
```

---

## 思考模式

收到指令不要直接執行，先思考：
1. **理解意圖**：使用者真正想達成什麼？
2. **補完指令**：有沒有隱含的前置條件或邊界情況？
3. **優化方案**：有沒有更好的做法？
4. **預判問題**：這樣做可能會碰到什麼問題？

指令模糊或多義時，**主動問清楚**，不要猜。

---

## Plan-Execute Workflow

### Phase 1: Plan（等使用者核准）
計畫須列出：Goal、Steps（含檔案路徑）、Scope boundary。

### Phase 2: Permission Reminder
核准後印 `--- Permission Summary ---`，僅通知不等確認。

### Phase 3: Autonomous Execution
在核准範圍內自主執行。**STOP only when**：超出 scope、步驟失敗、需大幅修改計畫。

---

## Coding Discipline

- 禁止 `# ...` 或 `// ...` 佔位語法
- 禁止 edit 時省略未修改部分導致截斷
- 發現測試失敗立刻停下修復，不繼續往後改
- 每完成一個步驟就跑相關 test

---

## Git Attribution

所有 OpenCode 產生的 commit 在 message 尾部加上：

```
Tool: OpenCode (Ollama local)
```

---

## 檔案產生規則

- 預設放在目前工作目錄（$CWD）下
- 不要在家目錄、桌面、下載資料夾建立檔案

---

## Google Workspace MCP

- 讀取郵件：`listGmailMessages`、`searchGmail`、`readGmailMessage`
- 傳送郵件：建立草稿 → 人類審核 → 發送（安全流程）
- **主旨含中文必須用 Base64 編碼**：`<subject>` 改為 `=?UTF-8?B?<base64>?=`
- 日曆：`listCalendarEvents`、`createCalendarEvent`、`deleteCalendarEvent`

---

## 邊界（嚴格遵守）

- **禁止**修改 `~/.claude/` 下的任何檔案
- **禁止**修改 `pm-last.txt`、`progress.md`
- OpenCode 狀態寫入 `.opencode/` 目錄
- **禁止**呼叫 Google Chat Webhook 或 Apps Script