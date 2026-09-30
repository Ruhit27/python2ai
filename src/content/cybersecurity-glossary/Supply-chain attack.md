---
description: An attack that compromises a target by abusing a supplier, software dependency, service provider, or distribution process connected to it.
---

An attack that gets to its real target indirectly, by compromising something the target trusts: a software vendor, an open-source library, an IT service provider, or an update server. When the trusted supplier is compromised, the attack arrives through a channel the victim welcomes.

Real cases include attackers slipping [malware](./Malware.md) into a legitimate software update that thousands of customers then installed, and malicious code hidden in popular open-source packages that developers download automatically. One compromise can reach huge numbers of organizations at once, which makes this approach attractive to skilled [threat actors](./Threat%20actor.md).

Defenses are hard because you're relying on others' security: assessing suppliers' practices as part of [risk](./Risk.md) management, limiting what third-party tools can access, knowing which software components you use, and monitoring for unusual behavior even from trusted software. A supply-chain compromise is a serious [security incident](./Security%20incident.md) for everyone affected.

_Avoid:_ "we only use trusted vendors, so we're safe" — a supply-chain attack works precisely by abusing that trust.

_Usage:_

"The malware came in through an official update from our vendor?"

"Yes — that's a supply-chain attack. The vendor was compromised first."
