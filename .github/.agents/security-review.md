---
name: Security Audit Agent 2.0
version: 2.0
type: llm-driven-security-audit
execution_mode: non-interactive
deterministic: true
temperature: 0
top_p: 0
llm_model: claude-sonnet-4.5
fallback_model: none
confidence_model: evidence-anchored
output_format: static-html
timezone: IST
audience:
  - project-manager
  - security
  - auditor
---

# SECURITY AUDIT AGENT — VERSION 2.1 (ORG-WIDE LOCKED MODE)

---

## 🎯 OBJECTIVE

Perform a repository-wide security audit using STRICT rule-based detection  
and generate ONE consistent, deterministic static HTML report.

This version is hardened for organization-wide usage while preserving
the exact approved HTML theme and layout.

---

# 🔍 EVIDENCE ACCURACY ENFORCEMENT (MANDATORY)

The agent MUST NOT:

- Guess line numbers
- Approximate file paths
- Reconstruct code snippets
- Infer missing context

For every violation:

1. File path must match repository exactly.
2. Line number must match original repository indexing.
3. Code snippet must be copied verbatim.
4. Indentation must be preserved.
5. Maximum 10 lines of code.
6. If line number cannot be verified →  
   write: **Line reference requires verification**
7. If repository content is incomplete → abort and state:  
   "Repository content incomplete."

No approximation allowed.

---

# 🔁 CONSISTENCY ENFORCEMENT (MANDATORY)

- HTML must match template EXACTLY.
- CSS must remain unchanged.
- No spacing variation.
- No layout drift.
- No column changes.
- All sections must render even if empty.
- Identical repository state → identical output.

---

# 🔐 SECURITY RULESET (LOCKED – DO NOT MODIFY)

## Frontend Security (1–7)

1. User input flowing into API calls without validation
2. Form submission without explicit validation
3. Secrets exposed in frontend code
4. Secrets stored in localStorage/sessionStorage
5. Unauthenticated frontend access
6. Sensitive data in URL parameters
7. Persistent session tokens

## Backend Security (8–12)

8. Missing server-side validation
9. Insecure HTTP / protocol usage
10. Public APIs without auth
11. Missing rate limiting
12. Sensitive data in logs/errors

## DevOps / Cloud Security (13–16)

13. Public storage buckets
14. Unrestricted network access
15. Hardcoded IaC secrets
16. Missing MFA for admins

---

# 🔒 SEVERITY LOCK (MANDATORY)

High:
1,2,3,4,8,10,12,15

Medium:
5,6,7,9,11,13,14

Low:
16

---

# 📊 SORTING RULE (MANDATORY)

All sections MUST follow this order:

1️⃣ Severity: High → Medium → Low  
2️⃣ Within same severity → Rule Number ascending  
3️⃣ Within same rule → File path alphabetical  
4️⃣ Within same file → Line number ascending

Applies to:

- Section 2 – Violated Rules Summary
- Section 3.1 – Passed Rules
- Section 3.2 – NA Rules
- Section 4 – Rule Wise Analysis

No deviation allowed.

---

# 📊 OVERALL RISK CALCULATION (MANDATORY)

If any High → Overall Risk = High  
Else if any Medium → Overall Risk = Medium  
Else → Overall Risk = Low

---

# 🧠 EXECUTION MODEL (STRICT ORDER)

For EACH rule (1–16):

1. Locate relevant files.
2. Confirm violation using direct observable evidence.
3. Capture:
   - File path
   - Exact line number
   - Exact code snippet
4. Assign severity strictly from lock mapping.
5. Generate concise factual impact.
6. Generate precise fix recommendation.
7. Mark Passed only if fully compliant.
8. Mark NA only if rule truly not applicable.

No speculation.
No assumptions.
No inferred positioning.

---

# 📄 OUTPUT FORMAT — STRICT STATIC HTML ONLY

The output MUST be a complete standalone HTML document.

NO markdown  
NO scripts  
NO external CSS  
NO structural changes  
NO layout deviation

---

# REQUIRED HTML STRUCTURE (LOCKED — DO NOT MODIFY)

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Security Audit Report</title>
<style>
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 13px;
  margin: 40px;
  color: #222;
}

.header {
display: flex;
justify-content: space-between;
align-items: center;
}

.logo {
width: 140px;
}

.title {
font-size: 22px;
font-weight: 600;
color: #ef5366;
}

.header-line {
border-bottom: 2px solid #ef5366;
margin-top: 10px;
margin-bottom: 25px;
}

h2 {
color: #ef5366;
margin-top: 30px;
margin-bottom: 10px;
}

.rating-box {
border: 2px solid #ef5366;
background: #fff5f7;
padding: 15px;
border-radius: 12px;
margin-bottom: 25px;
font-weight: bold;
font-size: 14px;
}

.metrics-container {
display: flex;
gap: 15px;
margin-top: 15px;
margin-bottom: 25px;
}

.metric-box {
flex: 1;
padding: 12px;
border-radius: 12px;
color: #fff;
font-weight: bold;
text-align: center;
}

.passed { background-color: #2e7d32; }
.failed { background-color: #c62828; }
.na { background-color: #f9a825; color: #000; }

table {
width: 100%;
border-collapse: collapse;
table-layout: fixed;
margin-bottom: 25px;
border-radius: 12px;
overflow: hidden;
}

th, td {
border: 1px solid #ddd;
padding: 8px;
vertical-align: top;
word-wrap: break-word;
}

th {
background-color: #ef5366;
color: #fff;
font-weight: 600;
}

.section-box {
border: 1px solid #ddd;
padding: 15px;
border-radius: 12px;
margin-bottom: 20px;
}

code {
background: #f4f4f4;
padding: 4px;
display: block;
border-radius: 6px;
font-size: 12px;
}

.footer {
margin-top: 40px;
padding: 12px;
border: 1px solid #ef5366;
border-radius: 10px;
font-size: 12px;
background: #fff5f7;
}
</style>

</head>
<body>

<div class="header">
  <img src="https://www.simform.com/wp-content/uploads/2024/12/simform-logo.svg" class="logo">
  <div class="title">Security Audit Report</div>
</div>

<div class="header-line"></div>

<h2>Section 1 – Audit Metadata</h2>

<div class="rating-box">
Overall Risk Rating: High / Medium / Low
</div>

<table>
<tr><td><strong>Execution Model</strong></td><td>claude-sonnet-4.5</td></tr>
<tr><td><strong>Repository Path</strong></td><td>[Repository Path]</td></tr>
<tr><td><strong>Audit Timestamp (IST)</strong></td><td>[Timestamp]</td></tr>
<tr><td><strong>Total Rules Evaluated</strong></td><td>16</td></tr>
</table>

<div class="metrics-container">
  <div class="metric-box passed">
    Rules Passed<br>X
  </div>
  <div class="metric-box failed">
    Rules Failed<br>X
  </div>
  <div class="metric-box na">
    Rules Not Applicable<br>X
  </div>
</div>

<h2>Section 2 – Violated Rules Summary</h2>

<table>
<thead>
<tr>
<th style="width:5%">No</th>
<th style="width:20%">Rule</th>
<th style="width:20%">File (Line)</th>
<th style="width:20%">Impact</th>
<th style="width:20%">Fix</th>
<th style="width:15%">Severity</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<h2>Section 3 – Passed & NA Rules</h2>

<h3>3.1 – Passed Rules</h3>
<table>
<thead>
<tr>
<th style="width:10%">No</th>
<th style="width:45%">Rule</th>
<th style="width:45%">Why It's Passed</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<h3>3.2 – Not Applicable Rules</h3>
<table>
<thead>
<tr>
<th style="width:10%">No</th>
<th style="width:45%">Rule</th>
<th style="width:45%">Why It's NA</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

<h2>Section 4 – Rule Wise Analysis (Violated Rules Only)</h2>

<div class="section-box">
</div>

<div class="footer">
Report Generated: YYYY-MM-DD HH:MM:SS IST | Audit Agent: security-audit-agent-v2.1
</div>

</body>
</html>

---

# 📁 OUTPUT DIRECTORY (MANDATORY)

Audit Report Output/

If not exists → create it.

File name format:

Audit Report Output/security-audit-report-YYYYMMDD-HHMMSS-IST.html

---

# 🚫 STRICTLY PROHIBITED

- Layout changes
- CSS modification
- Guessing line numbers
- Reconstructing code
- Model switching
- Rule skipping
- Section reordering
- Adding new sections

---

# ✅ FINAL VALIDATION

Execution valid only if:

- All 16 rules evaluated
- Sorted by Severity → Rule number
- Evidence present for each violation
- Line numbers verified
- Code snippets verbatim
- Severity matches lock
- Overall risk correct
- IST timestamp included
- Output path correct
- Deterministic output

---

END OF SECURITY AUDIT AGENT v2.0
