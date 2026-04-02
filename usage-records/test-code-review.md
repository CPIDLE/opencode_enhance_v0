# Test Code Review

請 review 以下 Python 程式碼，找出所有 bug 和改進建議。
**修改時必須保留所有原始程式碼，不可以用 `# ...` 省略任何部分。**

## calculator.py

```python
import math
import ast
import operator
from typing import Union

class Calculator:
    """A simple calculator with history tracking."""

    def __init__(self):
        self.history = []
        self.last_result = None

    def add(self, a: float, b: float) -> float:
        result = a + b
        self._record("add", a, b, result)
        return result

    def subtract(self, a: float, b: float) -> float:
        result = a - b
        self._record("subtract", a, b, result)
        return result

    def multiply(self, a: float, b: float) -> float:
        result = a * b
        self._record("multiply", a, b, result)
        return result

    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Cannot divide by zero")
        result = a / b
        self._record("divide", a, b, result)
        return result

    def power(self, base: float, exp: float) -> float:
        result = base ** exp
        self._record("power", base, exp, result)
        return result

    def sqrt(self, a: float) -> float:
        if a < 0:
            raise ValueError("Cannot calculate square root of a negative number")
        result = math.sqrt(a)
        self._record("sqrt", a, None, result)
        return result

    def factorial(self, n: int) -> int:
        if not isinstance(n, int):
            raise TypeError("Factorial is only defined for integers")
        if n < 0:
            raise ValueError("Cannot calculate factorial of a negative number")
        result = math.factorial(n)
        self._record("factorial", n, None, result)
        return result

    def log(self, a: float, base: float = 10) -> float:
        if a <= 0:
            raise ValueError("Logarithm argument must be greater than zero")
        if base <= 0 or base == 1:
            raise ValueError("Logarithm base must be greater than zero and not equal to one")
        result = math.log(a, base)
        self._record("log", a, base, result)
        return result

    def _record(self, op: str, a, b, result):
        entry = {
            "operation": op,
            "operand_a": a,
            "operand_b": b,
            "result": result,
        }
        self.history.append(entry)
        self.last_result = result

    def get_history(self) -> list:
        return self.history

    def clear_history(self):
        self.history = []
        self.last_result = None

    def undo(self):
        """Remove last operation and restore previous result."""
        if self.history:
            self.history.pop()
            if self.history:
                self.last_result = self.history[-1]["result"]
            else:
                self.last_result = None

    def chain(self, operations: list) -> float:
        """Execute a chain of operations sequentially.
        
        Each operation is a tuple: (method_name, *args)
        The result of each operation is passed as the first arg to the next.
        """
        result = None
        for i, op in enumerate(operations):
            method_name = op[0]
            args = list(op[1:])

            if result is not None and i > 0:
                args[0] = result

            method = getattr(self, method_name)
            result = method(*args)

        return result

    def statistics(self, numbers: list) -> dict:
        """Calculate basic statistics for a list of numbers."""
        if not numbers:
            return {}

        n = len(numbers)
        total_sum = sum(numbers)
        mean = total_sum / n
        sorted_nums = sorted(numbers)

        # Median
        if n % 2 == 0:
            median = (sorted_nums[n // 2 - 1] + sorted_nums[n // 2]) / 2
        else:
            median = sorted_nums[n // 2]

        # Variance and std dev
        variance = sum((x - mean) ** 2 for x in numbers) / n
        std_dev = math.sqrt(variance)

        # Mode
        freq = {}
        for num in numbers:
            freq[num] = freq.get(num, 0) + 1
        max_freq = max(freq.values())
        modes = [num for num, count in freq.items() if count == max_freq]
        mode = modes[0] if len(modes) == 1 else modes

        return {
            "count": n,
            "sum": total_sum,
            "mean": mean,
            "median": median,
            "mode": mode,
            "variance": variance,
            "std_dev": std_dev,
            "min": sorted_nums[0],
            "max": sorted_nums[-1],
        }


def parse_expression(expr: str) -> Union[float, str]:
    """Parse and evaluate a simple math expression safely."""
    ops = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Pow: operator.pow,
        ast.USub: operator.neg
    }

    def eval_node(node):
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        elif isinstance(node, ast.BinOp):
            left = eval_node(node.left)
            right = eval_node(node.right)
            if type(node.op) in ops:
                if type(node.op) == ast.Div and right == 0:
                    raise ValueError("Division by zero")
                return ops[type(node.op)](left, right)
            else:
                raise ValueError(f"Unsupported operator: {type(node.op)}")
        elif isinstance(node, ast.UnaryOp):
            operand = eval_node(node.operand)
            if type(node.op) in ops:
                return ops[type(node.op)](operand)
            else:
                raise ValueError(f"Unsupported operator: {type(node.op)}")
        else:
            raise ValueError(f"Unsupported expression type: {type(node)}")

    try:
        parsed_ast = ast.parse(expr, mode='eval')
        result = eval_node(parsed_ast.body)
        return float(result)
    except Exception as e:
        return f"Error: {e}"


def batch_calculate(calc: Calculator, expressions: list) -> list:
    """Process multiple expressions and return results."""
    results = []
    for expr in expressions:
        parts = expr.split()
        if len(parts) != 3:
            results.append({"expr": expr, "error": "Invalid format"})
            continue

        a_str, op, b_str = parts
        try:
            a = float(a_str)
            b = float(b_str)
        except ValueError:
            results.append({"expr": expr, "error": "Invalid numbers"})
            continue

        try:
            if op == "+":
                result = calc.add(a, b)
            elif op == "-":
                result = calc.subtract(a, b)
            elif op == "*":
                result = calc.multiply(a, b)
            elif op == "/":
                result = calc.divide(a, b)
            elif op in ("**", "^"):
                result = calc.power(a, b)
            else:
                results.append({"expr": expr, "error": f"Unknown operator: {op}"})
                continue
            
            results.append({"expr": expr, "result": result})
        except Exception as e:
            results.append({"expr": expr, "error": str(e)})

    return results


if __name__ == "__main__":
    calc = Calculator()

    print("=== Basic Operations ===")
    print(f"2 + 3 = {calc.add(2, 3)}")
    print(f"10 - 4 = {calc.subtract(10, 4)}")
    print(f"5 * 6 = {calc.multiply(5, 6)}")
    print(f"15 / 3 = {calc.divide(15, 3)}")
    print(f"2 ^ 8 = {calc.power(2, 8)}")
    print(f"sqrt(144) = {calc.sqrt(144)}")

    print("\n=== Chain ===")
    result = calc.chain([
        ("add", 10, 5),
        ("multiply", 0, 3),
        ("subtract", 0, 7),
    ])
    print(f"(10 + 5) * 3 - 7 = {result}")

    print("\n=== Statistics ===")
    nums = [4, 8, 15, 16, 23, 42, 4, 8, 15]
    stats = calc.statistics(nums)
    for key, val in stats.items():
        print(f"  {key}: {val}")

    print(f"\n=== History ({len(calc.get_history())} entries) ===")
    for entry in calc.get_history()[-5:]:
        print(f"  {entry['operation']}({entry['operand_a']}, {entry['operand_b']}) = {entry['result']}")
```
