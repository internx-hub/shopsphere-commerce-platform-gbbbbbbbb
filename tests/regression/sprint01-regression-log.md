# 🧪 Sprint 01 Regression Log

**Sprint Duration:** 1 May 2025 – 12 May 2025  
**Tester:** QA Team  
**Status:** In Progress  

---

## 📊 Summary
- Total Bugs Found: 5
- Critical: 1
- High: 2
- Medium: 2
- Low: 0

---

## 🐛 Bug List

### 🔴 BUG-001: Login fails with valid credentials
- **Severity:** Critical  
- **Status:** Open  
- **Module:** Authentication  

**Steps to Reproduce:**
1. Go to Login Page  
2. Enter valid email & password  
3. Click Login  

**Expected Result:**  
User should be redirected to dashboard  

**Actual Result:**  
Error message: "Invalid credentials"  

---

### 🟠 BUG-002: Cart count not updating
- **Severity:** High  
- **Status:** Open  
- **Module:** Cart  

**Steps to Reproduce:**
1. Go to Products  
2. Click "Add to Cart"  

**Expected Result:**  
Cart count increases  

**Actual Result:**  
Cart count remains same  

---

### 🟡 BUG-003: Checkout button unresponsive
- **Severity:** Medium  
- **Status:** Open  
- **Module:** Checkout  

**Steps to Reproduce:**
1. Add item to cart  
2. Go to Cart  
3. Click Checkout  

**Expected Result:**  
Navigate to checkout page  

**Actual Result:**  
Nothing happens  

---

### 🟡 BUG-004: Logout not clearing session
- **Severity:** Medium  
- **Status:** Open  
- **Module:** Authentication  

**Steps to Reproduce:**
1. Login  
2. Click Logout  
3. Refresh page  

**Expected Result:**  
User should be logged out  

**Actual Result:**  
User still logged in  

---

### 🟠 BUG-005: Order success page missing details
- **Severity:** High  
- **Status:** Open  
- **Module:** Orders  

**Steps to Reproduce:**
1. Complete checkout  
2. Go to success page  

**Expected Result:**  
Order details displayed  

**Actual Result:**  
Blank page  

---