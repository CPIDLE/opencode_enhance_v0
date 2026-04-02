# Project Instructions for AI Agents

## 必讀規則

### 修改前
1. **完整讀取**要修改的檔案 — 不准假設 API，用 grep 確認 class/function 是否存在
2. **完整讀取**所有 import 該檔案的模組 — 確認 public API 不被破壞
3. **讀取** `src/test_core.py` — 這是 regression baseline

### 修改中
4. **禁止使用 `# ...` 佔位註解取代真實程式碼** — 每一行都必須是真實的、可執行的程式碼
5. **禁止在 edit 時省略未修改的部分** — 如果 edit 工具會截斷周圍程式碼，改用 write 完整輸出
6. **新增 import 使用 lazy import**（放在函式內部）— 避免新模組壞掉時拖垮整個 CLI

### 修改後
7. **每次修改後立刻跑測試**：`cd src && python -m pytest test_core.py -q`
8. 必須看到 `29 passed` 才能繼續下一步
9. 如果測試失敗，**立刻停下修復**，不要繼續往下改

### 禁止事項
- 不准重構已經能跑的程式碼（除非使用者明確要求）
- 不准把函式改成 class（除非使用者明確要求）
- 不准修改 dataclass 的欄位定義（只能新增）
- 不准在 dataclass body 裡面放 import 語句

## 專案結構

核心模組（有 29 個測試保護）：
- `src/ur_script_parser.py` — URScript 解析器（函式式 API：`parse_script()`, `parse_all_scripts()`）
- `src/ur_tree_parser.py` — 程式樹解析器
- `src/ur_project_loader.py` — 專案載入器
- `src/ur_flow_analyzer.py` — 分析器
- `src/ur_doc_generator.py` — 文件產生器
- `src/ur_analyze.py` — CLI 入口

Phase 2 模組（新增，測試較少）：
- `src/ur_script_editor.py` — 程式碼編輯器
- `src/ur_script_simplifier.py` — 重複偵測
