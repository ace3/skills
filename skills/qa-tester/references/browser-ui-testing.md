# Browser UI Testing

Use this reference for frontend UI testing, browser automation, screenshots, logs, accessibility spot checks, and user-flow validation.

## Procedure

1. Confirm target URL, environment, auth state, test account, and data safety.
2. Identify critical user journeys and visible acceptance criteria.
3. Prefer existing Playwright, Cypress, Selenium, WebdriverIO, or browser-use tooling already available in the repo or host.
4. Capture page state, console errors, network failures, screenshots, and steps.
5. Verify happy paths, validation errors, permissions, empty states, loading states, and responsive behavior when relevant.
6. Record blocked checks separately from failures.

## Accessibility Spot Checks

- Keyboard reachability for primary flows.
- Visible focus.
- Label and accessible name for controls.
- Error messaging tied to fields.
- Color contrast or layout issues that block use.

## Output

```markdown
# Browser QA

Target:

Flows:

Evidence:

Console Or Network Issues:

Defects:

Blocked:
```
