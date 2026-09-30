---
description: A safeguard or measure—such as a policy, process, or technical mechanism—used to reduce security risk.
---

Any safeguard used to reduce security [risk](./Risk.md). Controls come in three broad kinds:

| Kind | Examples |
| --- | --- |
| Technical | [Firewalls](./Firewall.md), [encryption](./Encryption.md), [MFA](./Multi-factor%20authentication%20%28MFA%29.md) |
| Administrative | A [security policy](./Security%20policy.md), staff training, background checks |
| Physical | Locked server rooms, badge readers, cameras |

Controls can also be grouped by what they do: **preventive** (stop an attack — a locked door), **detective** (notice one — an alarm or a log), and **corrective** (recover from one — a [backup](./Backup.md)). Good security layers several, so if one fails another catches the problem; this is often called *defense in depth*. [Access control](./Access%20control.md) is one of the most important families of controls.

Controls map to the [CIA triad](./CIA%20triad.md): each one protects confidentiality, integrity, availability, or a mix. Choosing which to apply is guided by a [risk assessment](./Risk%20assessment.md) and often by a [security framework](./Security%20framework.md) that lists recommended controls.

_Avoid:_ "control" as only software — a policy or a locked door is a control too.

_Usage:_

"We have a firewall. Isn't that enough?"

"It's one control. If a phishing email gets through, what's the next layer?"
