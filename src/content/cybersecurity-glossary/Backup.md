---
description: A separate, recoverable copy of data or system information, maintained so it can be restored after loss, damage, or an attack.
---

A separate copy of data or systems, kept so it can be restored after loss, damage, or an attack. Backups protect the availability part of the [CIA triad](./CIA%20triad.md) — making sure important [assets](./Asset.md) can come back.

A widely used rule is **3-2-1**: keep 3 copies of important data, on 2 different types of storage, with 1 copy offsite. Against [ransomware](./Ransomware.md), at least one copy should be *offline* or *immutable* (unable to be changed or deleted), because attackers deliberately seek out and destroy backups they can reach.

The most common backup failure is discovering, during [recovery](./Recovery.md), that restores don't work — files missing, backups corrupted, or restoration taking weeks. Regularly testing restores is as important as taking backups. Backups are a cornerstone of [business continuity](./Business%20continuity.md).

_Avoid:_ "syncing" as a backup — cloud sync can copy deletions and ransomware damage too.

_Usage:_

"Our files sync to the cloud, so we're backed up."

"Sync isn't backup — if ransomware encrypts your files, the cloud copies get encrypted too."
