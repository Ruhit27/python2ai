---
description: Giving each user, device, or service only the permissions it needs, for only as long as it needs them.
---

Giving each person, device, or program only the access it needs to do its job — nothing more, and for no longer than needed. A marketing intern needs the social media account, not the payroll system. A backup program needs to read files, not delete them.

The point is to limit damage. If an account is stolen or a program is compromised, it can only do what its permissions allow. Many serious incidents became serious because a compromised account turned out to be an administrator of everything.

Least privilege is applied through [authorization](./Authorization.md) and [access control](./Access%20control.md) rules, often managed with [IAM](./Identity%20and%20access%20management%20%28IAM%29.md) tools. Permissions tend to pile up over time as people change roles ("privilege creep"), so regular access reviews matter. It's a core principle of [zero trust](./Zero%20trust.md).

_Avoid:_ "give admin to save time" — it saves minutes today and can cost everything if that account is stolen.

_Usage:_

"Can I just get admin rights so I don't have to keep asking?"

"Let's give you exactly the two permissions you need. Least privilege protects you too."
