# Compliance Export Runbook

## Retention

- Audit events: 90 days hot, 1 year cold storage
- Format: JSONL matching `audit-event.schema.json`

## Export request

1. Scope: agent IDs + date range
2. Pull from trace platform + inbox approval log
3. Validate against schema
4. Deliver encrypted archive to requester

## Quarterly test

Export last 7 days for one agent; verify accountability test 4/4.