# Agent Guardrails — EdTech-Website

> These rules apply to ALL AI agents and assistants (Antigravity, Claude, Copilot, Cursor, Windsurf, etc.)
> working in this project. They are **non-negotiable** and must be followed at all times.

---

## 🚫 Rule 1 — Do NOT delete files without asking

- Never delete, remove, or unlink any file or directory without **explicitly asking the user first**.
- This includes: `rm`, `del`, `unlink`, `fs.unlink`, `rimraf`, shell redirects that overwrite, etc.
- Propose the deletion with reasoning and **wait for a "yes"** before proceeding.

## 🚫 Rule 2 — Do NOT touch `.env` files

- Never read, write, edit, overwrite, delete, or print the contents of any `.env` file.
- This includes: `.env`, `.env.local`, `.env.development`, `.env.production`, `server/.env`, etc.
- If a `.env` value is needed, ask the user to provide it. Never assume or hard-code secrets.

## 🚫 Rule 3 — Do NOT run destructive Git commands without permission

- **Allowed without asking:** `git status`, `git log`, `git diff`, `git show`, `git branch` (read-only ops).
- **NEVER run without explicit user approval:** `git push`, `git pull`, `git fetch`, `git commit`,
  `git merge`, `git rebase`, `git reset`, `git checkout`, `git stash`, `git tag`, `git rm`.
- Before running any Git write command: state what command you plan to run and **wait for approval**.

## 🚫 Rule 4 — Do NOT touch databases or third-party services

- Do not connect to, query, modify, or delete any data in MongoDB, Cloudinary, Razorpay, Gmail SMTP,
  or any other external service without **explicit user permission**.
- Do not alter DB schemas, seed data, indexes, or cloud storage buckets.
- If a DB operation is needed to debug something, describe it and ask first.

## 🚫 Rule 5 — Do NOT access anything outside this project folder

- Your working scope is strictly `C:\Users\ss\projects\EdTech-Website` (and its subfolders).
- Do not read, write, or execute anything in other directories, system paths, or user home folders
  unless the user explicitly grants access for a specific, one-time operation.

## 🚫 Rule 6 — Do NOT make network calls without permission

- Never make outbound network requests on your own initiative.
- This includes: `curl`, `wget`, `fetch`, `axios`, `http.get`, `Invoke-WebRequest`, `Invoke-RestMethod`, `iwr`, `irm`, etc.
- If you need to test an API endpoint, download a package, or ping an external URL, state the exact URL, HTTP method, and payload, and **wait for user approval**.

## 🚫 Rule 7 — Do NOT create or execute anything without permission

- Do not create new files, run scripts, install packages, or execute shell commands unless:
  1. The user has asked you to do it, **or**
  2. You have described exactly what you will do and received explicit approval.
- Always show a plan first for multi-step operations. Never act first and explain later.

---

## ✅ Allowed without asking

- Reading any non-`.env` file in the project directory
- Running `git status`, `git log`, `git diff`, `git show`
- Running `npm run build` or `npm test` (non-destructive)
- Proposing changes in-chat before writing to disk

---

> **To override a rule for a specific action**, the user must explicitly say so in the current message.
> A previous approval does not carry forward to future sessions or similar actions.
