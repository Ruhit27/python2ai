---
description: Determining what an authenticated identity is permitted to see or do.
---

Deciding what someone is allowed to see or do once the system knows who they are. [Authentication](./Authentication.md) happens first ("you are Priya"); authorization follows ("Priya can read the sales reports but not change payroll").

Authorization is enforced by [access control](./Access%20control.md) rules. In a company, those rules are often organized by job — everyone in the finance role gets finance permissions — which is [role-based access control](./Role-based%20access%20control%20%28RBAC%29.md).

Good authorization follows [least privilege](./Least%20privilege.md): give each person only the access they need. Many serious breaches happen not because an attacker broke authentication, but because a stolen account had far more permissions than its owner ever needed. Broken authorization — like a website that shows your invoice if you change a number in the web address to someone else's — is one of the most common web [vulnerabilities](./Vulnerability.md).

_Avoid:_ "authorized" to mean "logged in" — logging in is authentication; authorization is what you can do afterwards.

_Usage:_

"If I change the order number in the URL I can see other people's orders."

"That's an authorization bug — the site checks you're logged in, but not that the order is yours."
