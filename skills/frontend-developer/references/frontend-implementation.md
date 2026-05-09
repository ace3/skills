# Frontend Implementation

Use this reference for frontend code changes after the plan gate is satisfied.

## Gate

For broad product or UI work, confirm there is an approved implementation plan from the user or `engineering-manager`.

If the request is a narrow UI fix, execute after inspecting the component and stating assumptions.

## Procedure

1. Inspect routes, components, styling system, data fetching, state management, tests, and existing UI patterns.
2. Identify the minimum user-facing change.
3. Implement complete states and responsive behavior.
4. Preserve accessibility basics: labels, focus, keyboard behavior, semantics, and contrast.
5. Run focused tests and type checks.
6. Start the app and verify the changed surface visually when practical.

## JS/TS/React/Next.js Guidance

- Prefer existing components and hooks.
- Keep server/client boundaries explicit.
- Validate API assumptions at the integration point.
- Avoid layout shifts, text overflow, hidden controls, and inaccessible icon-only actions.
- Do not add new dependencies unless the approved plan requires them.
- Check loading, empty, error, success, disabled, permission, and validation states.
- For Next.js, verify route ownership, middleware, server actions, caching, and environment boundaries before changing behavior.
- Keep internal working notes out of visible UI, HTML comments, seed content, CMS copy, and shared docs.

## Visual Review

- Capture browser evidence when the UI changed and a browser is available.
- Check desktop and mobile breakpoints for text overflow and overlapping controls.
- Prefer real app data or representative fixtures over decorative placeholders.

## Output

```markdown
Changed:

Verified:

Tests:

Visual Check:

Risks:

Blocked:
```
