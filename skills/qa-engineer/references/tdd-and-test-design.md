# TDD And Test Design

Use this reference for test-first methodology, bug-fix test design, and automated test quality review.

## TDD Loop

1. Red: define one failing test for one behavior.
2. Verify red: confirm the test fails for the expected reason, not a typo or setup error.
3. Green: identify the minimal production change needed to pass.
4. Verify green: run the narrow test and relevant neighboring tests.
5. Refactor: clean only after tests pass, keeping behavior unchanged.

This borrows the Superpowers-style rule that a test you never watched fail does not prove it catches the missing behavior.

## Good Test Properties

- Tests real behavior instead of mock behavior.
- Has a clear name that describes the expected outcome.
- Covers one behavior per test.
- Uses deterministic setup and teardown.
- Keeps test data visible enough for reviewers to understand intent.
- Adds regression coverage for the defect that actually failed.

## Red Flags

- Test passes immediately for new behavior.
- Test only verifies mocks were called.
- Test depends on execution order or shared state.
- Snapshot hides the meaningful assertion.
- Test is harder to understand than the behavior.
- Test needs broad production changes before any assertion can run.

## Output

```markdown
# Test Design

Behavior:

Red Test:

Expected Failure:

Minimal Green Owner:

Regression Scope:

Anti-Patterns To Avoid:
```
