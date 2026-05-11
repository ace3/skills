# E2E, Mobile, And CI

Use this reference for E2E test code, browser automation suites, mobile automation, framework migration, and CI test pipelines.

## E2E Test Code

- Prefer the framework already present: Playwright, Cypress, Selenium, WebdriverIO, Nightwatch, or TestCafe.
- Use user-visible selectors and accessibility roles when possible.
- Keep page objects or helpers small and tied to stable flows.
- Cover critical flows first: auth, purchase, checkout, permissions, data creation, destructive confirmation, and recovery.
- Avoid brittle sleeps; use condition-based waits.

## Mobile Automation

- Use Appium or simulator tooling only when the repo already supports mobile automation or the user explicitly asks for it.
- Cover device class, OS version, orientation, permissions, network conditions, and gesture-specific behavior.

## Framework Migration

- Migrate only when the target framework is already chosen or current tooling blocks required coverage.
- Map old assertions, fixtures, selectors, retries, reporters, and CI outputs before proposing edits.
- Keep migration slices small enough to verify.

## CI Test Pipelines

- Use existing CI provider conventions.
- Prefer parallelization and caching only when the current suite cost justifies it.
- Publish useful artifacts: test reports, traces, screenshots, coverage, and logs.
- Fail closed on critical test failures; do not hide flakes with retries unless the root cause is tracked.

## Output

```markdown
# E2E And CI Test Plan

Framework:

Critical Flows:

Selectors And Fixtures:

Mobile Coverage:

CI Jobs:

Artifacts:

Commands:
```
