---
description: Dividing a network into smaller, controlled zones so access between them can be limited and a compromise is less likely to spread.
---

Splitting a network into separate zones with controlled connections between them, instead of one big flat network where everything can talk to everything. A hospital might keep medical devices, staff laptops, guest Wi-Fi, and payment systems in different segments.

The main benefit is limiting spread. If an attacker compromises one laptop on a flat network, they can often reach every server. With segmentation, [firewall](./Firewall.md) rules between zones stop them moving sideways, which helps [containment](./Containment.md) during an incident. It also shrinks the [attack surface](./Attack%20surface.md) each system is exposed to.

Segmentation is a building block of [zero trust](./Zero%20trust.md), which takes the idea further by checking every connection, not just those between zones.

_Avoid:_ "segmentation" as a single firewall at the edge — it's about barriers *inside* the network too.

_Usage:_

"How did ransomware get from one laptop to all our servers?"

"The network was flat. With segmentation, that laptop couldn't have reached them."
