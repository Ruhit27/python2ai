---
description: Applying a one-way function to data to produce a fixed-size digest, often used to check integrity or safely verify stored passwords when done with a suitable password-hashing method.
---

Running data through a one-way function that produces a short, fixed-size "fingerprint" called a *hash* or *digest*. The same input always gives the same hash, but even a tiny change produces a completely different one — and you can't reverse a hash to recover the original.

Two main uses. **Integrity checks**: if a downloaded file's hash matches the one the publisher lists, it hasn't been altered. **Password storage**: systems should store a hash of your password, not the password. At login, they hash what you type and compare.

For passwords, systems also add a **salt** — a unique random value mixed into each password before hashing — so two people with the same password get different hashes, and precomputed tables of common password hashes become useless. They also use deliberately slow password-hashing methods, making mass guessing expensive. Hashing is part of [cryptography](./Cryptography.md) and underpins [digital signatures](./Digital%20signature.md). It supports [authentication](./Authentication.md) and the integrity of [security logs](./Security%20log.md).

_Avoid:_ "hashing" and "encryption" as the same — encryption can be reversed with a key; hashing cannot be reversed.

_Usage:_

"Can you email me my password? I forgot it."

"We can't — we only store a salted hash. You'll need to reset it."
