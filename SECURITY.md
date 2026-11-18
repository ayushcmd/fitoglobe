# Security Policy

Thank you for helping keep FitoGlobe and its users safe.

## Supported versions

Security fixes are prioritized for the code on the repository's current `main` branch and the currently deployed application. Older commits, abandoned branches, and unofficial forks are not guaranteed to receive security updates.

## Reporting a vulnerability

**Please report suspected security vulnerabilities privately.** Do not open a public GitHub issue, discussion, or pull request containing exploit details, tokens, personal information, or steps that could put users at risk.

The intended reporting channel is **GitHub Private Vulnerability Reporting**:

1. Open [FitoGlobe security advisories](https://github.com/ayushcmd/fitoglobe/security/advisories).
2. Select **Report a vulnerability** if that option is available.
3. Provide a clear description, affected component, potential impact, and reproduction steps. Use test data and redact credentials or personal information.

**Setup prerequisite:** Maintainers must enable GitHub Private Vulnerability Reporting in the repository's security settings. Its enabled status has **not yet been verified**. If the **Report a vulnerability** option is absent, do **not** put sensitive details in a public issue. Instead, open a public issue containing **only a request for a private security contact channel**, without any vulnerability details, and wait for the maintainer to arrange private communication.

## What to include

- A concise summary of the issue and its impact
- Affected routes, pages, components, or versions
- Steps to reproduce using accounts and data you own
- Relevant sanitized logs or screenshots
- A suggested mitigation, if known

Never include production secrets, third-party credentials, or other users' private information.

## Proposed response targets (maintainer review required)

**These are proposed service targets, not yet an approved or guaranteed commitment.** The repository owner should review and accept or modify them before merging this policy.

| Stage | Proposed target |
| --- | --- |
| Initial acknowledgment | Within 3 business days of receiving a private report |
| Initial triage and severity assessment | Within 7 calendar days of acknowledgment |
| Progress update for confirmed issues | At least every 14 calendar days, where practical |
| Coordinated disclosure | Aim to agree on a disclosure plan, with 90 days as a starting discussion point; timelines may vary with impact and remediation complexity |

A fix or release date cannot be guaranteed in advance. Critical vulnerabilities may require faster action.

## Responsible research and disclosure

- Test only accounts, systems, and data you own or have explicit permission to use.
- Avoid service disruption, destructive testing, social engineering, and unnecessary access to personal information.
- Stop testing and report privately if you encounter sensitive data.
- Allow maintainers time to investigate and coordinate a fix before publishing technical details.
- Maintainers may use GitHub security advisories to coordinate fixes and credit researchers, subject to the reporter's preferences.

For ordinary bugs and feature requests that do not pose a security risk, use the repository's [public issues](https://github.com/ayushcmd/fitoglobe/issues).
