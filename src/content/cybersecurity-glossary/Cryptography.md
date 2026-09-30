---
description: The use of mathematical techniques to protect information or verify its origin, including encryption, hashing, and digital signatures.
---

The science of using mathematics to protect information. It's what keeps messages private, proves they haven't been changed, and confirms who sent them. Cryptography runs quietly behind almost everything online: websites, messaging apps, card payments, software updates.

Its main tools:

| Tool | What it does |
| --- | --- |
| [Encryption](./Encryption.md) | Keeps data secret, reversible with the right key |
| [Hashing](./Hashing.md) | Creates a fixed fingerprint of data; one-way |
| [Digital signatures](./Digital%20signature.md) | Prove who created data and that it hasn't changed |

These combine in larger systems — for example, [digital certificates](./Digital%20certificate.md) and the infrastructure behind them let your browser trust a website. A golden rule: never invent your own cryptography. Well-tested, standard algorithms and libraries are safe; homemade schemes almost always have flaws.

_Avoid:_ "cryptography" and "cryptocurrency" as the same — crypto-currencies use cryptography, but cryptography is far broader.

_Usage:_

"Can we write our own encryption to be extra safe?"

"No — use standard, well-tested cryptography. Homemade schemes are nearly always weaker."
