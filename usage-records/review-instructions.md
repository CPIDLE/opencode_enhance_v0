# 修復指示 — 給 opencode

你把 `ur_script_parser.py` 改壞了，現在整個專案無法執行。以下是你必須完成的修復步驟。

**規則：每完成一個步驟，立刻跑對應的驗證指令。驗證失敗不准繼續下一步。**

---

## Step 0：先讀懂現有 API

在動任何程式碼之前，**完整讀取**以下檔案並理解其 public API：

- `src/ur_script_parser.py` — 注意：原始版本只有 `parse_script()` 函式和 dataclass，沒有 class-based parser
- `src/ur_flow_analyzer.py` — 看它怎麼使用 `URScriptFile`
- `src/ur_project_loader.py` — 看它 import 了哪些 name
- `src/test_core.py` — 29 個測試，這是你的 regression baseline

**不要假設 API 長什麼樣，用 grep 確認。**

---

## Step 1：還原 `ur_script_parser.py`

你目前的版本有 `IndentationError`（L201 空 class body）和 `from itertools import chain` 放在 dataclass 裡面。

做法：用 `git checkout` 或手動還原到 **test_core.py 29 個測試能全過的版本**。那個版本的結構是：

- L1-57：regex patterns
- L59-150：dataclass 定義（URWaypoint, URFunction, URModbusSignal, URAnnotation, MoveCommand, ModbusOperation, RTDEOperation, VisorOperation, ErrorCode）
- L152-189：`URScriptFile` dataclass（所有欄位，沒有 method）
- L209-524：`parse_script()` 函式（不是 class）
- L525+：`parse_all_scripts()` 函式

驗證：
```bash
cd src && python -m pytest test_core.py -q
```
必須看到 `29 passed`。

---

## Step 2：在還原的 parser 上正確新增 `Statement`

在 `ur_script_parser.py` 的 dataclass 區段（`ErrorCode` 之後、`URScriptFile` 之前）加入：

```python
@dataclass
class Statement:
    """通用程式碼語句，用於重複偵測。"""
    command: str
    line_start: int
    line_end: int
```

驗證：
```bash
cd src && python -c "from ur_script_parser import Statement; print('OK')"
cd src && python -m pytest test_core.py -q
```
兩個都要過。

---

## Step 3：在 `URScriptFile` 加 `statements` property

在 `URScriptFile` dataclass 的最後面加一個 property。注意：

- `from itertools import chain` 放在**檔案頂部** import 區，不是 class 裡面
- 只轉換已有的 `move_commands`、`modbus_operations`、`rtde_operations`、`visor_operations`
- 每個操作物件都有 `line_number` 屬性（不是 `line_start`），轉換時用 `line_number` 填 `line_start` 和 `line_end`

```python
@property
def statements(self) -> list['Statement']:
    from itertools import chain
    def _to_stmt(cmd, cmd_attr, line_attr='line_number'):
        return Statement(
            command=getattr(cmd, cmd_attr),
            line_start=getattr(cmd, line_attr),
            line_end=getattr(cmd, line_attr),
        )
    all_ops = chain(
        (_to_stmt(c, 'move_type') for c in self.move_commands),
        (_to_stmt(c, 'op') for c in self.modbus_operations),
        (_to_stmt(c, 'direction') for c in self.rtde_operations),
        (_to_stmt(c, 'op') for c in self.visor_operations),
    )
    return sorted(all_ops, key=lambda s: s.line_start)
```

驗證：
```bash
cd src && python -c "
from ur_script_parser import parse_script, Statement
sf = parse_script('../K11_UR30_Project/programs/EQ2600_port1_load.script')
stmts = sf.statements
print(f'statements: {len(stmts)}, first: {stmts[0] if stmts else None}')
"
cd src && python -m pytest test_core.py -q
```

---

## Step 4：修 `ur_script_simplifier.py` 的 import

把第 9 行改成：
```python
from ur_script_parser import URScriptFile, Statement, parse_script
```

- 刪除 `URScriptParser` — 你不需要它，simplifier 接收的是已經 parse 好的 `URScriptFile`
- `generate_report()` 裡的 `URScriptParser(self.script.path)` 那行刪掉，你不需要重新 parse
- `generate_report()` 裡用 `URScriptEditor` 讀預覽行 — 確認有 import `URScriptEditor`

第 10 行確認有：
```python
from ur_script_editor import URScriptEditor
```

驗證：
```bash
cd src && python -c "from ur_script_simplifier import URScriptSimplifier; print('OK')"
```

---

## Step 5：修 `ur_analyze.py` 的 import

把 top-level 的這幾行刪掉：
```python
from ur_script_parser import URScriptParser          # 刪除
from ur_script_simplifier import URScriptSimplifier, SimplificationPlan  # 刪除
from ur_script_editor import URScriptEditor          # 刪除
```

改成在 `cmd_simplify()` 函式內部 lazy import：
```python
def cmd_simplify(script_path: Path, apply: bool = False):
    from ur_script_parser import parse_script
    from ur_script_simplifier import URScriptSimplifier
    from ur_script_editor import URScriptEditor
    # ... 其餘邏輯
```

這樣 simplifier 壞掉也不會拖垮其他 6 個子命令。

`cmd_simplify()` 裡面原本用 `URScriptParser(path).parse()` 的地方改成 `parse_script(path)`。

驗證：
```bash
cd src && python ur_analyze.py summary
cd src && python ur_analyze.py validate
```
這兩個必須正常輸出，不能有 ImportError。

---

## Step 6：修 `test_refactor.py`

把 `from ur_script_parser import URScriptParser` 改成 `from ur_script_parser import parse_script`。
測試裡 `URScriptParser(path)` 改成用 `parse_script(path)`。

驗證：
```bash
cd src && python -m pytest test_core.py test_refactor.py -q
```
全部測試都要過（29 + test_refactor 的測試數）。

---

## Step 7：最終驗證

跑完整 pipeline：
```bash
cd src && python ur_analyze.py all
```
必須成功產出 82 個 Markdown 檔案，沒有任何 error。

---

## 禁止事項

- **不准用 `# ... (原有內容)` 這種佔位註解取代真實程式碼**
- **不准在沒跑測試的情況下交出修改**
- **不准新增 `URScriptParser` class** — 現有的 `parse_script()` 函式已經夠用，simplifier 不需要 class-based parser
- **不准修改任何現有 dataclass 的欄位定義**（只能新增 `Statement` 和 `statements` property）
