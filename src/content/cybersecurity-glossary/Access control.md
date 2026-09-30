---
description: The rules and mechanisms that decide who or what may access a resource and which actions are allowed.
---

The rules and mechanisms that decide who can use what, and what they can do with it — read, edit, delete, or share. It's the practical enforcement of [authorization](./Authorization.md), and one of the most important [security controls](./Security%20control.md).

Access control exists everywhere: file permissions on a shared drive, a badge reader on a server room door, a setting that only managers can approve refunds. The rules can be based on the person, their role ([RBAC](./Role-based%20access%20control%20%28RBAC%29.md)), or context such as location, device health, and time of day.

Well-designed access control follows [least privilege](./Least%20privilege.md) and is reviewed regularly, because people change jobs and leave. A common failure is the account nobody removed: a former employee who can still log in months later.

_Avoid:_ "access control" as only login screens — it also governs what you can do after logging in.

_Usage:_

"He left three months ago. Why can he still open the shared drive?"

"Nobody updated the access control when he left. We need offboarding to remove access the same day."
