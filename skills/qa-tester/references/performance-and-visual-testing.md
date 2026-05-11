# Performance And Visual Testing

Use this reference for load checks, page performance checks, visual regression, screenshot comparisons, and baseline evidence.

## Performance Checks

- Confirm the test target is authorized and safe for load.
- Define metric: latency, throughput, error rate, resource size, Core Web Vitals, or job duration.
- Define baseline and threshold before running.
- Use existing k6, Gatling, JMeter, Lighthouse, or project scripts first.
- Keep load modest unless the user explicitly authorizes stress testing.
- Report environment, data set, duration, concurrency, and observed variance.

## Visual Regression

- Capture deterministic viewport, auth state, test data, theme, and locale.
- Compare against the approved baseline when one exists.
- Separate rendering defects from content changes.
- Include screenshot paths or artifact names when available.

## Output

```markdown
# Performance And Visual QA

Target:

Baseline:

Thresholds:

Execution:

Results:

Artifacts:

Defects:
```
