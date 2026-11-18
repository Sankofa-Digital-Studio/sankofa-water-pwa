# Community and repository maintenance

## Where to start

- Read the [README](../README.md) for the prototype scope, setup, and verification commands.
- Follow [CONTRIBUTING.md](../CONTRIBUTING.md) for branches, pull requests, tests, and field/database change guidance.
- Follow [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) for respectful participation.
- Use [SECURITY.md](../SECURITY.md) for private vulnerability reporting; do not post security-sensitive details in public issues.
- Use the issue chooser for routine bugs and feature proposals.

## Suggested labels

Use the existing repository labels where available; avoid creating duplicate names. A compact, maintainable taxonomy would include:

- Type: `bug`, `enhancement`, `documentation`, `question`
- Triage: `needs triage`, `good first issue`, `help wanted`
- Priority: `priority: critical`, `priority: high`, `priority: medium`, `priority: low`
- Area: `area: frontend`, `area: api`, `area: database`, `area: field-operations`, `area: telemetry`, `area: reporting`
- Cross-cutting: `accessibility`, `security`, `offline`, `privacy`

Apply only labels that correspond to the issue's actual scope. Priority should reflect user/service impact and urgency, not implementation convenience.

## Issue quality

Report the affected workflow and expected versus actual behavior. Include reproducible steps, environment/device and connectivity details, sanitized logs or screenshots where useful, and acceptance criteria for proposed work. Never include secrets, personal data, precise sensitive locations, or vulnerability details in a public issue.

For operational or field-work issues, state whether the report uses synthetic data and whether a real deployment is involved. Keep proposals grounded in the verified prototype status described in the README.

## Project board suggestion

A repository project named **Sankofa Water Delivery** can track issues through `Backlog → Ready → In Progress → Review → Done`, with a `Blocked` status if useful. Suggested fields: `Priority`, `Area`, and `Target milestone`. Views: delivery board grouped by status; priority table sorted by priority; and a field-readiness view filtered to telemetry, field operations, offline, security, and privacy work.

This document is a setup recommendation; it does not itself create GitHub labels, issues, or a Projects board.

## Licensing

The README notes that the repository has no published license. Contributors should not assume reuse rights. The maintainers should choose and approve a license before adding one; this guide intentionally does not select a license on their behalf.
