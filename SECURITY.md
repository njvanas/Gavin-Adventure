# Security Policy – *\[Game Name]*

*Last updated: 2025-08-12*

We take the security and fair play of *\[Game Name]* seriously. This document explains how to report vulnerabilities, what’s in and out of scope for testing, and how we handle disclosures.

---

## Reporting a Vulnerability

**Preferred methods (choose one):**

* **GitHub Private Vulnerability Report:** Go to **Security → Advisories → Report a vulnerability** on this repository.
* **Email:** **security@\[yourstudio].com** (PGP: \[optional key ID / fingerprint])

**Please include (as applicable):**

* A clear description and impact
* Steps to reproduce / proof-of-concept
* Affected URLs/files/commit SHAs
* Your environment (OS, browser + version)
* Any logs, screenshots, or short videos

We welcome reports from everyone, including researchers and players. You do **not** need to exploit data or disrupt other users to demonstrate impact—minimal, targeted proof is enough.

---

## Our Disclosure Commitments

* **Acknowledgement:** within **24 hours**
* **Triage & initial assessment:** within **3 business days**
* **Status updates:** at least **weekly** until resolution
* **Fix ETA:** shared after triage (varies with severity/complexity)
* **Credit:** optional (“Security acknowledgements”) after a fix ships, unless you request otherwise

We prefer **coordinated disclosure**. Please avoid public disclosure or social posts until a fix is available and we’ve agreed a timeline with you.

We do **not** operate a bounty program at this time; responsible disclosures may receive thanks and recognition.

---

## Scope

### In scope

* This GitHub repository: source code, assets, build scripts, GitHub Actions workflows
* The client-side game running on **GitHub Pages** at **https\://\[your-username].github.io/\[repo]/**
* Project configuration for GitHub Pages and its CDN paths
* Any first-party subdomains explicitly linked from the game (if owned by us)

### Out of scope

* Third-party services we don’t control (analytics, ad networks, payment processors)
* Denial of service (DoS), volumetric attacks, or spam against players/servers
* Social engineering of our team or contributors
* Physical attacks or lost/stolen devices
* Vulnerabilities requiring a compromised user device or non-default browser flags

If you’re unsure whether something is in scope, ask us first.

---

## Safe Harbor

We support good-faith security research:

* Don’t access, modify, or exfiltrate data that isn’t yours. Use dummy/test accounts only.
* Don’t degrade other players’ experience (no DoS/stress tests).
* Don’t pivot beyond what you need to demonstrate the issue.
* If you accidentally access sensitive data, **stop**, **don’t store it**, and **report immediately**.

If you follow these guidelines, we won’t pursue legal action for your research.

---

## Severity & Triage

We prioritize using CVSS v3.1+ as guidance:

* **Critical/High:** XSS with credential theft, auth bypass, supply chain compromise, remote code execution in build/CI
* **Medium:** CSRF with meaningful state change, SOP/CSP bypass without theft, clickjacking on sensitive actions
* **Low/Informational:** Missing security headers without practical exploit, best-practice hardening gaps

We may adjust severity based on real-world exploitability in a GitHub Pages environment.

---

## What to Test (Examples)

* **Client security:** DOM-XSS, DOM clobbering, prototype pollution, insecure use of `postMessage`, storage abuse (LocalStorage/IndexedDB)
* **Auth/session (if used):** token leakage via referrers, weak token storage, origin checks on messages/requests
* **Supply chain:** tampered third-party scripts, missing Subresource Integrity (SRI), unsafe CDNs, compromised Actions
* **Build/CI:** secrets exposure in logs, insecure Actions permissions (`GITHUB_TOKEN` over-privilege), artifact poisoning
* **Content isolation:** missing or weak CSP, COOP/COEP/CORP issues, clickjacking on sensitive UI
* **Game fairness (client-side):** tampering that enables cheating when server checks are present (e.g., bypassing anti-tamper or integrity checks)

---

## What Not to Do

* No automated scanning that floods our site or GitHub
* No testing on real players’ accounts
* No brute-force credential guessing
* No phishing or social engineering of team members
* No posting exploits publicly before coordinated disclosure is complete

---

## Hardening We Use (and Aim to Maintain)

These are the controls we strive to keep enabled; please tell us if you find gaps or regressions:

* **Content Security Policy (CSP)** with script whitelisting and `object-src 'none'`
* **Subresource Integrity (SRI)** for third-party scripts/styles
* **Clickjacking protection** on sensitive pages (e.g., `X-Frame-Options: DENY` via meta or equivalent)
* **Dependency & Actions hygiene:** Dependabot/Renovate, locked Actions (`@vX` with commit SHA pinning where possible), least-privileged `GITHUB_TOKEN`
* **No secrets committed**; build uses repo/environment secrets with minimal permissions
* **Integrity checks** on critical game data and code paths (anti-tamper)
* **Read-only storage by default**; local saves use namespaced keys and input validation

> **Note for GitHub Pages:** Native HTTP response headers are limited. Where possible we use meta-tags or a CDN/proxy to enforce CSP/COOP/COEP and other headers. If you find bypasses unique to the Pages environment, that’s in scope.

---

## Responsible Use of Findings

If your finding involves player data risk:

1. Report privately immediately.
2. Don’t access more data than necessary.
3. Don’t retain, share, or transmit data beyond the report.

We will notify affected users if required by law or risk severity.

---

## Coordinated Disclosure Timeline (Typical)

1. Report received → **ack within 24h**
2. Triage → **≤ 3 business days**
3. Fix plan + target date shared
4. Fix developed, tested, and deployed
5. Public advisory & credit (if desired) after fix

If we cannot meet the timeline for a high-severity issue, we’ll propose a reasonable coordinated disclosure date with you.

---

## Contact

* Security team: **security@\[yourstudio].com**
* Public PGP key: **\[paste ASCII-armored key block or link]**
* Emergency (24/7, critical only): **\[on-call email or PagerDuty alias]**

---

## Acknowledgements

We gratefully credit researchers in our **SECURITY-THANKS.md** (opt-in).

---

## Versioning

* **v1.0:** Initial publication

---

### Appendix: Quick Hardening Checklist (for Devs)

* [ ] Enforce CSP (script/style whitelists, `object-src 'none'`, `base-uri 'none'`)
* [ ] Use SRI on all third-party scripts/styles
* [ ] Pin GitHub Actions by version **and** commit SHA when possible
* [ ] Set `permissions:` for Actions to least privilege; disable `contents: write` unless needed
* [ ] Validate and sanitize all untrusted inputs (including URL params, storage, `postMessage`)
* [ ] Avoid `innerHTML` / use safe DOM APIs; if unavoidable, sanitize with a vetted library
* [ ] Namespaced LocalStorage/IndexedDB; handle corrupted or tampered saves gracefully
* [ ] Feature-flag sensitive code; don’t ship debug secrets or endpoints
* [ ] Review PRs for security, not just functionality
