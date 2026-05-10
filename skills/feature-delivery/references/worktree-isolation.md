# Worktree Isolation

Captures the worktree question that runs at the start of every `feature-delivery` invocation and the merge/cleanup prompt that runs after the delivery report.

## Setup Question (run before any planning)

Ask the user exactly one question before reading the repo for planning:

> Develop this feature on an isolated git worktree, or directly on the current branch?

Wait for the answer. Do not assume. The decision must be recorded in the first plan response either as the worktree path or as an explicit "no worktree" line.

### If the user picks worktree

1. Confirm the parent branch (default: current `HEAD`).
2. Choose a feature branch name from the user's request: `feature/<short-slug>` unless the user supplies one.
3. Choose a worktree path under the repo's sibling directory unless the user supplies one:
   ```
   <repo-root>/../<repo-name>-wt-<short-slug>
   ```
4. Print the exact commands and run them:
   ```bash
   git worktree add -b <branch> <worktree-path> <parent-branch>
   cd <worktree-path>
   ```
5. From this point on, run all reads, edits, tests, and verification inside the worktree. State the worktree path and branch at the top of the plan response.
6. If `git worktree add` fails (existing branch, dirty tree, missing parent), surface the error and ask the user how to resolve before continuing. Do not delete branches or force the operation.

### If the user picks no worktree

State a single line in the plan response: `Working directly on <current branch> — no worktree.` Then proceed with normal `feature-delivery` flow.

## Cleanup Prompt (run after delivery report, only if worktree was used)

After the **Delivery Report** is presented and the user confirms the feature is OK, ask:

> Merge `<branch>` into `<parent-branch>` and remove the worktree at `<worktree-path>`?

Wait for an explicit yes. Treat anything ambiguous as no.

### If the user says yes (merge + remove)

Print the exact commands first; only run them after the user-visible plan is in the response:

```bash
# from the worktree
git status                                 # confirm clean
cd <repo-root>
git checkout <parent-branch>
git pull --ff-only                         # only if a remote exists
git merge --no-ff <branch>                 # or --ff-only if the user prefers
git worktree remove <worktree-path>
git branch -d <branch>                     # safe delete; refuses if unmerged
```

Rules:
- Never use `git branch -D` (force delete) without an explicit user yes referencing force.
- Never `git push` or open a PR as part of cleanup unless the user asked for it. Pushing is a separate, explicit ask covered by the deployment stop gate.
- If `git merge` produces conflicts, stop and report; do not auto-resolve.
- If `git worktree remove` fails (uncommitted changes, locked worktree), surface the error and ask before using `--force`.

### If the user says no (keep worktree)

Record in the final report: `Worktree kept at <worktree-path> on branch <branch>.` Do not run cleanup.

### If no worktree was used

After the user confirms the feature is OK, ask whether to push the branch or open a PR. Same explicit-yes rule. Privileged push, PR creation, or release execution is still gated by `references/feature-delivery-workflow.md` Stop Gates.

## Reporting

Add a `Worktree:` line to the Delivery Report (see `references/delivery-report.md`) recording either the path + branch, the cleanup result, or `none`.
