# Day End Report — Code Review

**Project:** Single Shop POS (Electron/Quasar)
**Date:** 23 February 2026
**Prepared By:** Development Team

---

## Objective

Conducted a comprehensive code review of the Single Shop POS desktop application to identify bugs, security vulnerabilities, and code quality issues across the entire codebase.

## Scope

Reviewed **40+ source files** spanning the database layer, UI components, page views, utility scripts, Electron preload, and boot configuration.

---

## Summary of Findings

| Severity    | Count  | Description                                                           |
| ----------- | :----: | --------------------------------------------------------------------- |
| 🔴 Critical |   6    | Security vulnerabilities, data-destructive bugs, broken core features |
| 🟠 Major    |   6    | Application crashes, incorrect calculations, broken shortcuts         |
| 🟡 Medium   |   6    | Stale UI, type mismatches, date formatting errors                     |
| 🔵 Minor    |   6    | Typos, anti-patterns, wrong file extensions                           |
| **Total**   | **24** |                                                                       |

---

## Critical Issues (Immediate Action Required)

1. **Hardcoded SMTP Credentials** — Gmail app password is exposed in plain text in `mailer.js`. Must be moved to secure storage.

2. **Data-Destructive API Functions** — `findGenProduct`, `findService`, and `findProduct` in `electron-preload.js` mistakenly call `remove()` instead of find methods due to a copy-paste error. Calling these will **delete records**.

3. **Product Search Broken** — `SearchProduct.vue` calls `window.posApi.findProducts()` which does not exist in the API. The search bar is non-functional.

4. **Report Filtering Broken** — `Report.getSales()` uses `Array.includes()` with a callback instead of `.some()`. Payment method filtering never matches, returning unfiltered data.

5. **Wrong File Path in Cleanup** — Report cleanup routine reads file names from the `./reports` directory but deletes from `./databases`, risking database file corruption.

6. **Email Failure Hangs Application** — `SendReports()` promise never resolves on email error, causing the "Close Day" operation to hang indefinitely.

## Major Issues

7. **Till Close Crash** — `closeTill()` crashes with `TypeError` if no till record exists.
8. **Purchase Keyboard Shortcuts Broken** — `PurchaseTill.vue` Ctrl+1..9 handler passes arguments to a zero-parameter function.
9. **NaN in Purchase List** — `Purchase.getAllPurchases()` references non-existent `purchase.price` field.
10. **Potential Duplicate IDs** — `getLatestOrderId()` uses MongoDB-style sort options unsupported by `db-local`.
11. **Purchase Filter Logic Inverted** — `getPurchasesTotal()` checks the record's type existence instead of the parameter.
12. **Loose Equality in VAT Logic** — Uses `!=` / `==` instead of `!==` / `===`, risking unexpected behavior with null/undefined.

## Medium & Minor Issues

- Till counter summary never refreshes after transactions
- Opening amount stored as string instead of number
- POS slip has redundant triple-fallback on same property
- Component name collision between `OrderSlip` and `OpenTillData`
- Excel reports saved with `.xlxs` instead of `.xlsx`
- Multiple typos ("Quatity", "Dayhseet")
- `ref()` misused inside Options API `data()` (anti-pattern)
- Scoped CSS targeting `<body>` has no effect

---

## Recommendations

1. **Immediate:** Fix all 6 critical issues before any production deployment.
2. **Short-term:** Address major bugs (crashes, broken shortcuts, incorrect calculations).
3. **Ongoing:** Implement input validation, add error boundaries, and introduce automated testing.
4. **Security:** Remove hardcoded credentials and adopt environment variable or secure storage patterns.

---

## Status
