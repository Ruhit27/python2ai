---
description: The policies and systems used to create, verify, manage, and remove identities and control their access to resources.
---

The policies and tools used to manage *identities* — the digital representations of people, devices, and software services that a system can recognize — and to control what each one can access. An identity is more than a username: it carries attributes (department, manager, device) and permissions.

IAM covers an identity's whole life: **creating** it when someone joins, **verifying** it at every login ([authentication](./Authentication.md)), **granting** the right access ([authorization](./Authorization.md), often via [RBAC](./Role-based%20access%20control%20%28RBAC%29.md)), **changing** it when they move roles, and **removing** it the day they leave. Features like [SSO](./Single%20sign-on%20%28SSO%29.md) and [MFA](./Multi-factor%20authentication%20%28MFA%29.md) are usually delivered through an IAM system.

Good IAM makes [least privilege](./Least%20privilege.md) practical at scale. Because stolen identities are one of the most common ways attackers get in, IAM has become central to modern security — the foundation of [zero trust](./Zero%20trust.md).

_Avoid:_ "IAM" as just a password system — it manages the whole life of every identity and its access.

_Usage:_

"How do we make sure leavers lose access everywhere?"

"Tie every app to our IAM system. Disable the identity once, and it's gone from all of them."
