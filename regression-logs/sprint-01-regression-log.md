# 🐞 Sprint 01 Regression Bug Log

**Status:** In Progress  
**Priority:** Medium  
**Tester:** [Your Name]  
**⚠ Overdue · Due:** 12 May 2025  

---

## 📋 Bug List

| Bug ID | Title/Short Description | Steps to Reproduce | Expected Result | Actual Result | Severity | Status | Assigned To |
|--------|--------------------------|--------------------|-----------------|---------------|----------|--------|-------------|
| BUG-001 | Login button unresponsive | 1. Navigate to `/auth/login` <br> 2. Enter valid credentials <br> 3. Click "Login" | User should be redirected to dashboard | Button click does nothing, no redirect | High | Open | Dev A |
| BUG-002 | Profile picture not saving | 1. Go to Profile Settings <br> 2. Upload new image <br> 3. Click Save | Profile picture should update | Old picture remains | Medium | In Progress | Dev B |
| BUG-003 | Protected route accessible without login | 1. Open `/protected` directly in browser | Redirect to login page | Page loads without authentication | Critical | Open | Dev C |

---

## 🗒️ Notes
- Update this log daily during regression testing.  
- Ensure **Steps to Reproduce** are detailed enough for anyone to follow.  
- Severity levels: Critical, High, Medium, Low.  
- Status options: Open, In Progress, Fixed, Retested, Closed.  

