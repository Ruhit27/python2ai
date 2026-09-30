---
description: An access-control approach where permissions are assigned to roles, and users receive permissions through their assigned roles.
---

A way of managing [access](./Access%20control.md) by job role instead of person by person. You define roles — "Sales", "Finance", "Support agent" — give each role a set of permissions, and assign people to roles. When someone joins the sales team, they get the Sales role and every permission that comes with it.

RBAC makes access easier to manage and to check. With 500 employees, reviewing 10 roles is far simpler than reviewing 500 individual permission lists. When someone changes jobs, you change their role; when they leave, you remove it.

The risk is roles that grow too broad — "everyone gets the Staff role, and Staff can see everything" — which undermines [least privilege](./Least%20privilege.md). RBAC is usually managed inside an [IAM](./Identity%20and%20access%20management%20%28IAM%29.md) system and is a common way to implement [authorization](./Authorization.md).

_Avoid:_ "role" as a job title only — in RBAC, a role is a defined bundle of permissions.

_Usage:_

"The new support hire needs access to 14 different tools."

"Just give her the Support role — it already has the right access to all of them."
