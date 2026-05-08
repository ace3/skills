# Finding Normalization

Use when combining scanner, code review, log, cloud, or manual findings.

## Schema

- `target`: service, host, repo, file, image, domain, route, or resource.
- `source`: tool, command, log source, code review, or human report.
- `severity`: Critical, High, Medium, Low, Info.
- `proof`: short evidence with file, line, command output, request, log event, or screenshot reference.
- `timestamp`: when the evidence was observed.
- `confidence`: High, Medium, Low.
- `exploitability`: realistic preconditions and impact path.
- `next_action`: remediation, validation, owner, and deadline when known.

## Rules

- Do not merge unrelated vulnerabilities into one finding.
- Deduplicate the same root cause across tools.
- Mark unverified scanner output as unconfirmed.
- Prefer concise operator-ready summaries over raw scanner dumps.
