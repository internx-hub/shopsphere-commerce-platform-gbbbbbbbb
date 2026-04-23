# Sprint 01 Regression Log

## Bug 1: Signup does not validate weak passwords

- **Severity:** Medium
- **Steps to Reproduce:**
  1. Go to /signup
  2. Enter email
  3. Enter password "123"
  4. Submit form
- **Expected:** Error message for weak password
- **Actual:** Account created successfully

---

## Bug 2: Unauthorized user can access dashboard

- **Severity:** High
- **Steps to Reproduce:**
  1. Open /dashboard without login
- **Expected:** Redirect to /login
- **Actual:** Dashboard loads

---

## Bug 3: Cart not persisting after refresh

- **Severity:** High
- **Steps to Reproduce:**
  1. Add product to cart
  2. Refresh page
- **Expected:** Cart retains items
- **Actual:** Cart is empty

---

## Bug 4: Checkout fails without error message

- **Severity:** Critical
- **Steps to Reproduce:**
  1. Add product to cart
  2. Go to checkout
  3. Click Pay Now
- **Expected:** Payment success or failure message
- **Actual:** No response / blank state