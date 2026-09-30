---
description: A cryptographic proof, created with a private key and checked with a corresponding public key, that can help verify a message's origin and detect changes.
---

A mathematical proof attached to data that shows who created it and that it hasn't been changed since. It uses a pair of keys: a **private key** kept secret by the signer, and a matching **public key** anyone can use to check the signature.

Signing typically involves [hashing](./Hashing.md) the data and then transforming the hash with the private key. If someone alters even one character, the signature check fails. If the signature checks out with the signer's public key, only the holder of the private key could have made it.

Digital signatures protect software updates (your device checks updates are genuinely from the vendor), secure email, and signed documents and contracts. To trust that a public key really belongs to who it claims, it's usually delivered in a [digital certificate](./Digital%20certificate.md). They're a key tool of [cryptography](./Cryptography.md).

_Avoid:_ "digital signature" as a scanned handwritten signature — a digital signature is a cryptographic proof, not a picture.

_Usage:_

"How does my phone know an update isn't fake?"

"It checks the digital signature against the vendor's public key before installing."
