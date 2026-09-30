---
description: Checking evidence to establish that a user, device, or service is the identity it claims to be.
---

Proving you are who you say you are. When you log in with a password, the system checks that evidence to confirm your *identity* — the account or profile the system knows you by. Devices and software services authenticate too, usually with keys or certificates.

Evidence comes in three categories, called *factors*: something you **know** (a password or PIN), something you **have** (a phone or security key), and something you **are** (a fingerprint or face). Using two or more categories together is [multi-factor authentication](./Multi-factor%20authentication%20%28MFA%29.md), which is far harder to break than a password alone.

Authentication answers "who are you?". The next question — "what are you allowed to do?" — is [authorization](./Authorization.md). [Single sign-on](./Single%20sign-on%20%28SSO%29.md) lets you authenticate once and use many services. Stored passwords should never be kept in plain text; systems store them with password [hashing](./Hashing.md) instead.

_Avoid:_ "authentication" and "authorization" as the same — one proves who you are; the other decides what you may do.

_Usage:_

"She logged in fine, so why can't she open the finance folder?"

"Authentication worked. Authorization says her account doesn't have access to finance."
