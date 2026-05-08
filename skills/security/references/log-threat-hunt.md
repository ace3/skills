# Log Threat Hunt

Use for Sigma-rule review, Linux/GCP/Docker/Nginx suspicious activity, and forensic evidence capture.

## Sources

- GCP audit logs, IAM changes, service account activity, and Cloud DNS changes.
- Linux auth logs, sudo logs, package history, process evidence, and file metadata.
- Docker daemon logs, container exec events, image pulls, and unexpected privilege changes.
- Nginx access/error logs and application auth/rate-limit logs.

## Procedure

1. Preserve raw evidence and timestamps before summarizing.
2. Apply Sigma or equivalent detection logic to relevant log classes.
3. Build a timeline of identity, source IP, target, action, result, and affected resource.
4. Separate suspicious behavior from expected deploy or maintenance activity.
5. Recommend containment only when evidence supports it.

## Output

- Timeline.
- Indicators and matched rules.
- Impact assessment.
- Containment, eradication, recovery, and follow-up checks.
