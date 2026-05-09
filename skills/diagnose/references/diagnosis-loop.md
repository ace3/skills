# Diagnosis Loop

Use this reference to turn a symptom into a proven root cause.

## Procedure

1. Capture the symptom, expected behavior, environment, recent change, and available artifacts.
2. Build a feedback loop: failing test, curl script, CLI fixture, browser script, trace replay, minimal harness, fuzz loop, or repeated flake runner.
3. Minimize the case until unrelated setup is removed.
4. List hypotheses with evidence for and against each one.
5. Instrument only what is needed to prove or reject the top hypothesis.
6. Identify root cause and the smallest fix path.
7. Define a regression check before routing to implementation.

## Loop Quality

- Fast beats broad.
- Deterministic beats convenient.
- Specific assertion beats generic crash detection.
- A 50 percent flake is debuggable; keep raising the reproduction rate when possible.
- If a human must click, write exact human-in-the-loop steps and capture the result.

## Handoff

- Backend cause: route to `backend-developer`.
- Frontend cause: route to `frontend-developer`.
- Acceptance or regression validation: route to `qa`.
- Security cause: route to `security-sast` or `security-dast`.
- Runtime, deploy, or infrastructure cause: route to `monitoring` or `deployment-ops`.

## Output

```markdown
# Diagnosis Report

Status:

Signal:

Minimal Repro:

Hypotheses:

Root Cause:

Fix Path:

Regression Check:

Handoff:
```
