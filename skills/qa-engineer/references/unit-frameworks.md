# Unit Frameworks

Use this reference when selecting or designing unit tests for a specific language or framework.

## Framework Defaults

- JavaScript or TypeScript: prefer the existing Jest, Vitest, Mocha, or Jasmine setup.
- Vite or modern frontend projects: Vitest is acceptable when already present.
- Python: pytest with fixtures, parametrization, and `conftest.py` only when the repo already uses that style.
- Java: JUnit 5 or TestNG according to the existing build.
- Ruby: RSpec when present.
- PHP: PHPUnit when present.
- .NET: xUnit, NUnit, or MSTest according to the existing project.

Do not recommend adding a new framework unless no test framework exists or the current one cannot test the target behavior.

## Design Guidance

- Prefer table-driven or parameterized tests for boundary matrices.
- Use mocks at process, network, clock, filesystem, or provider boundaries.
- Avoid mocking the unit under test.
- Keep fixtures local unless several tests share meaningful domain setup.
- Name tests by behavior and expected outcome.
- Include coverage for invalid inputs, permissions, error paths, idempotency, and edge values when relevant.

## Output

```markdown
# Unit Test Plan

Framework:

Existing Conventions:

Test Files:

Cases:

Mocks Or Fakes:

Commands:
```
