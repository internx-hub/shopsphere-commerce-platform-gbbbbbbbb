# 🐞 Sprint 01 Regression Bug Log

**Status:** In Progress  
**Priority:** Medium  
**Tester:** [Your Name]  
**⚠ Overdue · Due:** 12 May 2025  

---

## 📋 Testing Process
Sprint 01 regression testing was performed on core user flows:
- Authentication (sign-up, sign-in, protected route, sign-out)  
- Checkout flow (add-to-cart → checkout → order success)  
- Profile management and settings  

Each bug below was discovered during these regression runs.

---

## 🐛 Bug List

| Bug ID | Title/Short Description | Steps to Reproduce | Expected Result | Actual Result | Severity | Status | Assigned To | Due Date |
|--------|--------------------------|--------------------|-----------------|---------------|----------|--------|-------------|----------|
| BUG-001 | Login button unresponsive | 1. Navigate to `/auth/login` <br> 2. Enter valid credentials <br> 3. Click "Login" | Redirect to dashboard | Button click does nothing, no redirect | High | Open | Dev A | 7 May 2025 |
| BUG-002 | Profile picture not saving | 1. Go to Profile Settings <br> 2. Upload new image <br> 3. Click Save | Profile picture should update | Old picture remains | Medium | In Progress | Dev B | 10 May 2025 |
| BUG-003 | Protected route accessible without login | 1. Open `/protected` directly in browser | Redirect to login page | Page loads without authentication | Critical | Open | Dev C | 7 May 2025 |
| BUG-004 | Checkout flow fails on payment | 1. Add item to cart <br> 2. Proceed to checkout <br> 3. Enter valid payment details <br> 4. Submit order | Order success page displayed | Error message: “Payment failed” despite valid card | High | Open | Dev D | 9 May 2025 |

---

## 📊 Progress Tracking
- **Total Bugs Found:** 4  
- **Fixed:** 0  
- **In Progress:** 1  
- **Open:** 3  
- **Critical Issues:** 1  

---

## 🗒️ Notes
- All bugs listed were discovered during **Sprint 01 regression testing**.  
- Each bug includes reproducible steps and expected vs. actual results.  
- Progress tracking helps ensure resolution before sprint closure.  
