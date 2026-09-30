---
description: A basic security model built around confidentiality, integrity, and availability: keeping information private, correct, and accessible when needed.
---

A simple model that describes the three things security tries to protect:

| Letter | Stands for | Means | Example of it failing |
| --- | --- | --- | --- |
| C | Confidentiality | Only the right people can see it | Customer records leaked online |
| I | Integrity | It hasn't been wrongly changed | An attacker edits bank details on an invoice |
| A | Availability | It's there when needed | [Ransomware](./Ransomware.md) locks every file |

It's a useful checklist when thinking about [risk](./Risk.md): for any [asset](./Asset.md), ask what would happen if it were exposed, altered, or unavailable. Different assets care about different letters — a public website mostly needs availability and integrity; a medical record needs all three.

[Security controls](./Security%20control.md) map onto the triad: [encryption](./Encryption.md) protects confidentiality, [hashing](./Hashing.md) and [digital signatures](./Digital%20signature.md) help check integrity, and [backups](./Backup.md) protect availability. (It has nothing to do with the US intelligence agency.)

_Avoid:_ "security = confidentiality" — keeping data correct and available matters just as much as keeping it secret.

_Usage:_

"Nobody stole anything, so it wasn't a security incident."

"The system was down for a day. That's availability — still part of the CIA triad."
