---
description: A sign-in arrangement that lets a user authenticate once with a trusted identity provider and access multiple connected services.
---

Logging in once and getting into many services without signing in to each separately. At work, you might sign in to your company account in the morning and then open email, chat, the HR system, and design tools without typing another password.

It works by having every service trust one central *identity provider*, which handles the [authentication](./Authentication.md) and vouches for you. That's convenient for users — fewer passwords to remember or reuse — and good for security teams: one place to enforce [MFA](./Multi-factor%20authentication%20%28MFA%29.md), and one switch to turn off all access when someone leaves.

The trade-off is concentration: if the one SSO account is stolen, many services are exposed at once. That's why SSO accounts should always be protected with strong MFA. SSO is usually part of a wider [IAM](./Identity%20and%20access%20management%20%28IAM%29.md) setup.

_Avoid:_ "SSO" as "the same password everywhere" — with SSO you sign in once to one trusted service; the apps usually never see your password.

_Usage:_

"Why does every app redirect me to the company login page?"

"That's SSO. Sign in there once and you're into all of them."
