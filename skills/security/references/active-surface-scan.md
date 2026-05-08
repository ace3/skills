# Active Surface Scan

Use for allowlisted Amass, Naabu, httpx, ffuf, ZAP, Nuclei, and SSLyze workflows.

## Safety Gate

Do not run active probing unless the target scope is explicit and authorized. Prefer staging. Use low concurrency, rate limits, scanner identity headers, and maintenance windows for sensitive systems.

## Procedure

1. Confirm allowed domains, CIDRs, environments, ports, and excluded targets.
2. Start passive inventory from owned DNS, cloud APIs, repo config, or known endpoints.
3. Use active discovery only inside scope: Amass for asset mapping, Naabu for ports, httpx for HTTP probing, ffuf for paths/params, ZAP for API/web scanning, Nuclei for templates, SSLyze for TLS.
4. Normalize tool output before triage.
5. Report only exploitable or operationally relevant findings.

## Output

- Scope and scan controls used.
- Targets tested and tools used.
- Findings with proof, severity, confidence, exploitability, and next action.
