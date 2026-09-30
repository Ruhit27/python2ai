---
description: Transforming readable data into a protected form using a key so that it cannot be understood without the appropriate decryption capability.
---

Scrambling readable data (*plaintext*) into unreadable form (*ciphertext*) using a key, so only someone with the right key can read it. Turning it back into readable data is **decryption**. Without the key, encrypted data looks like random noise.

Encryption protects data in two main situations. **In transit**: while data travels across networks, via [TLS](./Transport%20Layer%20Security%20%28TLS%29.md) for websites or a [VPN](./Virtual%20private%20network%20%28VPN%29.md). **At rest**: while stored — on a laptop's disk (so a stolen laptop reveals nothing), in databases, or in [backups](./Backup.md).

Encryption is only as strong as its key management: if keys are lost, data is gone; if keys are stolen, encryption doesn't help. It's a core part of [cryptography](./Cryptography.md), alongside [hashing](./Hashing.md), which is one-way and can't be decrypted. Note that [ransomware](./Ransomware.md) uses encryption too — against its victims.

_Avoid:_ "encrypted means safe forever" — it depends on strong algorithms and on keeping the keys safe.

_Usage:_

"The laptop with client files was stolen from the car."

"Was the disk encrypted? If so, the thief sees nothing useful."
