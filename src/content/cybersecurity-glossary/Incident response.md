---
description: The coordinated process for preparing for, identifying, analyzing, containing, and recovering from security incidents, then improving from what was learned.
---

The planned, coordinated way an organization handles a [security incident](./Security%20incident.md). Doing it well depends on preparation: knowing who to call, who decides, and what to do before anything goes wrong.

A common model has these phases:

| Phase | What happens |
| --- | --- |
| Preparation | Plans, contacts, tools, and practice drills |
| Detection & analysis | Spot the incident, [triage](./Triage.md) it, understand its scope |
| [Containment](./Containment.md) | Stop it spreading |
| Eradication | Remove the cause — delete malware, close the hole, reset stolen passwords |
| [Recovery](./Recovery.md) | Restore systems safely and watch for a return |
| Lessons learned | Review what happened and improve |

Eradication matters because recovering without removing the cause invites the attacker straight back in. Tools like [EDR](./Endpoint%20detection%20and%20response%20%28EDR%29.md) and a [SIEM](./Security%20information%20and%20event%20management%20%28SIEM%29.md) support the work, and [business continuity](./Business%20continuity.md) plans keep the organization running meanwhile.

_Avoid:_ "incident response" as only the technical fix — it also covers communication, legal duties, and decisions.

_Usage:_

"Who do we call when ransomware hits at 2 am?"

"It should be in the incident response plan. If we don't have one, that's our first job this week."
