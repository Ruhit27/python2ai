---
description: Restoring affected systems and services to normal operation in a controlled way and checking that they remain secure.
---

Getting affected systems and services back to normal after an incident — carefully, and checking that the problem doesn't come back. In [incident response](./Incident%20response.md), recovery follows [containment](./Containment.md) and removing the cause.

Recovery might mean restoring data from a [backup](./Backup.md), rebuilding servers from clean images, resetting passwords, and gradually reconnecting systems while watching closely for signs the attacker is still there. Rushing it can reinfect the network if the cause wasn't fully removed.

How fast an organization can recover depends on preparation: tested backups, clear priorities for which systems come back first, and [business continuity](./Business%20continuity.md) plans to keep working in the meantime. Recovery ends a specific [security incident](./Security%20incident.md); the "lessons learned" review that follows helps prevent the next one.

_Avoid:_ "recovery" as restoring from backup and moving on — you must also confirm the attacker is gone.

_Usage:_

"The backups are restored. Can we reconnect everything?"

"Not until we've confirmed how they got in is closed. Otherwise we'll be recovering again next week."
