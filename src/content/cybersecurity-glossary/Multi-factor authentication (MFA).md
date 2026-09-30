---
description: Authentication that requires evidence from at least two different factor categories, such as something you know, have, or are.
---

Logging in with two or more *different kinds* of evidence: something you **know** (a password), something you **have** (a phone app code or a security key), or something you **are** (a fingerprint). Two passwords don't count — they're the same kind. Using exactly two is often called *two-factor authentication* (2FA).

MFA is one of the most effective protections available, because stolen passwords are extremely common — through [phishing](./Phishing.md), data leaks, and reused passwords. With MFA, a stolen password alone usually isn't enough.

Not all methods are equally strong. Text-message codes are better than nothing but can be intercepted or phished; app-based codes are stronger; hardware security keys and passkeys resist phishing best. MFA is a core part of [zero trust](./Zero%20trust.md) and makes [authentication](./Authentication.md) much harder to fake for a stolen [identity](./Identity%20and%20access%20management%20%28IAM%29.md).

_Avoid:_ "MFA makes an account unhackable" — attackers can still trick people into approving prompts or handing over codes.

_Usage:_

"Do I really need MFA on email? It's annoying."

"Email resets every other password you have. It's the account that most needs MFA."
