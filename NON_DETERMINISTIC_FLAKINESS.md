# Analysis of Non-Deterministic Flaky Test Behavior

This analysis outlines the root cause of the intermittent CI failures in the repository, specifically focusing on the category:
> **Root Cause Category:** Non-deterministic input caused by random value generation without mocking or stabilization.

---

## 1. Flaky Test in `tests/cart.test.js`

### Exact Test Code
The flaky behavior is defined in the test file [tests/cart.test.js](file:///Users/sriman/developer/projects/internship/devops%20solution%20/flaky-tests-lab/tests/cart.test.js#L17-L20):

```javascript
// Test Name:
test('flaky: cart total is computed correctly (intentionally non-deterministic)', () => {
  
  // Math.random() usage (Problematic Line):
  // >>> CRITICAL LINE: Generates a non-deterministic value dynamically on every run <<<
  const simulatedTotal = Math.random() > 0.5 ? 100 : 999;
  
  // Assertion Condition:
  expect(simulatedTotal).toBe(100);
});
```

### Why It Behaves Inconsistently
* **When it PASSES:** `Math.random()` returns a value greater than `0.5`, setting `simulatedTotal` to `100`. The assertion `expect(100).toBe(100)` succeeds.
* **When it FAILS:** `Math.random()` returns a value less than or equal to `0.5`, setting `simulatedTotal` to `999`. The assertion `expect(999).toBe(100)` fails with:
  ```
  Expected: 100
  Received: 999
  ```

---

## 2. Flaky Test in `tests/pricing.test.js`

### Exact Test Code and Source Logic
The flaky behavior stems from the source file [src/pricing.js](file:///Users/sriman/developer/projects/internship/devops%20solution%20/flaky-tests-lab/src/pricing.js#L1-L3):

```javascript
function calculateDiscount() {
  // Math.random() usage (Problematic Line):
  // >>> CRITICAL LINE: Generates a random value between 0.00 and 0.50 dynamically <<<
  return Math.round(Math.random() * 50) / 100;
}
```

This function is assertively verified in the test suite [tests/pricing.test.js](file:///Users/sriman/developer/projects/internship/devops%20solution%20/flaky-tests-lab/tests/pricing.test.js#L7-L10):

```javascript
// Test Name:
test('discount is above minimum threshold', () => {
  const discount = calculateDiscount();
  
  // Assertion Condition:
  expect(discount).toBeGreaterThan(0.05);
});
```

### Why It Behaves Inconsistently
* **When it PASSES:** `Math.random()` generates a value that rounds to any discount higher than `0.05` (e.g., `0.06` to `0.50`). The assertion passes.
* **When it FAILS:** `Math.random()` generates a small value such that `Math.round(Math.random() * 50)` evaluates to `0, 1, 2, 3, 4, or 5`. The resulting discount is $\le 0.05$ (e.g., `0`, `0.01`, `0.02`, `0.03`, `0.04`, `0.05`), causing `toBeGreaterThan(0.05)` to fail. This has a statistical probability of `11.8%` ($\frac{6}{51}$).

---

## How to Resolve this Flakiness
To stabilize these tests, random values must either be **mocked/stubbed** using Jest spies or **stabilized** using a deterministic seeding seed library:
1. **Mocking `Math.random`:**
   ```javascript
   jest.spyOn(Math, 'random').mockReturnValue(0.8); // Always resolves to > 0.5
   ```
2. **Explicit Unit Control:** Avoid random value generation in core business logic inside testing environments.
