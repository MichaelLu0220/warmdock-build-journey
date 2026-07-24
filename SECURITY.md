# Public-release boundary

This repository is intentionally separated from the production WarmDock
application.

## Included

- original public documentation and diagrams;
- synthetic examples;
- screenshots of public product surfaces;
- standalone utilities recreated for this repository;
- tests for those utilities.

## Excluded

- production source code and commit history;
- database schema, migrations, policies, and stored procedures;
- model prompts, evaluation sets, provider adapters, and private datasets;
- secrets, tokens, project identifiers, hostnames used only for operations, and
  environment values;
- telemetry, logs, backups, support material, and user-derived content;
- detailed security-control configuration or incident records.

## Reporting a problem

If you find private material or a credential in this repository, please do not
open a public issue containing it. Contact the repository owner privately
through the contact method on the GitHub profile.

The code in `src/` is a public educational playground. It is not the code used
to authenticate users, award points, enforce task rules, or store data in the
production service.

