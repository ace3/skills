# Delivery Report

Use this final response shape after feature delivery work.

```markdown
Worktree:
- <worktree path + branch, or "Working directly on <branch> — no worktree", or cleanup result>

Changed:
- <behavior implemented>

Assumptions:
- <material assumptions, or "None">

Verified:
- <command/check/browser/API evidence>

Security And QA:
- <security-sensitive review and QA result>

Blocked:
- <blocked checks or gates, or "None">

Risks:
- <remaining risk, or "None">

Next:
- Ask the user whether to merge and remove the worktree (or push/open PR if no worktree). Wait for explicit yes.
```

Keep the report concise. Lead with what changed and what was verified. Mention files only when they help the user inspect the result. Never claim done with silent gaps — every skipped or blocked check belongs in the **Blocked** section. The `Worktree:` line is required: it records the setup decision made at the start of the run, or — if cleanup ran — its result. The `Next:` line reminds the agent to run the merge/cleanup prompt from `worktree-isolation.md` after the user confirms the feature is OK.
