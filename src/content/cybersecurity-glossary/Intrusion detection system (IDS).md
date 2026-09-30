---
description: A system that monitors activity for signs of suspicious or prohibited behavior and raises alerts; it typically does not block traffic by itself.
---

A system that watches network traffic or computer activity for signs of an attack and raises a [security alert](./Security%20alert.md) when it sees one. It works like a burglar alarm: it detects and warns, but doesn't lock the door itself.

An IDS spots trouble in two main ways: matching known attack patterns ("signatures"), and flagging behavior that's unusual compared with normal activity. Its alerts are usually sent to a [SIEM](./Security%20information%20and%20event%20management%20%28SIEM%29.md), and its records become part of the [security log](./Security%20log.md) trail.

A close relative is the **intrusion prevention system (IPS)**, which does the same monitoring but can also *block* suspicious traffic automatically. The trade-off: an IPS can stop attacks in real time, but a false alarm can block legitimate traffic, so it needs careful tuning. Many modern [firewalls](./Firewall.md) include IPS features.

_Avoid:_ "IDS" and "IPS" as the same — an IDS only alerts; an IPS can also block.

_Usage:_

"The IDS flagged the attack. Why didn't it stop it?"

"An IDS only alerts. We'd need an IPS — or someone watching the alerts — to block it."
