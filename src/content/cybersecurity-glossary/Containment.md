---
description: Actions taken to limit an incident's spread or impact while investigation and remediation continue.
---

Stopping a [security incident](./Security%20incident.md) from spreading or getting worse, while the investigation continues. It's the "stop the bleeding" step of [incident response](./Incident%20response.md).

Typical containment actions: disconnecting an infected laptop from the network, disabling a compromised account, blocking a malicious address at the firewall, or isolating a network zone. Good [network segmentation](./Network%20segmentation.md) makes containment much faster, because barriers already exist.

Containment involves judgment calls. Pulling a critical server offline stops the attacker but also stops the business; acting too visibly can warn an attacker to cover their tracks. After containment comes removing the cause, then [recovery](./Recovery.md).

_Avoid:_ "containment" as solving the incident — it limits the damage; the cause still has to be removed.

_Usage:_

"Should I turn the infected laptop off?"

"Disconnect it from the network instead — that contains it without wiping evidence in memory."
