---
description: A proactive search through available data and systems for signs of malicious activity that automated alerts may have missed.
---

Actively searching for signs of attackers already inside, rather than waiting for a [security alert](./Security%20alert.md). Threat hunters assume something may have slipped past the automated tools and go looking for it.

A hunt usually starts from a hypothesis: "If a group that targets our industry were here, they'd likely use this technique — let's look for traces of it." Hunters then dig through [security logs](./Security%20log.md), [SIEM](./Security%20information%20and%20event%20management%20%28SIEM%29.md) data, and endpoint records for subtle clues, such as a legitimate admin tool run at 3 am from an unusual account.

Hunting relies on understanding how specific [threat actors](./Threat%20actor.md) operate. Findings feed back into better detection rules, so future attacks trigger alerts automatically. It's usually done by experienced defenders; a real finding goes to [triage](./Triage.md) and [incident response](./Incident%20response.md).

_Avoid:_ "threat hunting" as reacting to alerts — hunting is proactive, looking for what alerts missed.

_Usage:_

"Nothing's alerted in months. Are we fine?"

"Maybe — or detections are missing things. A threat hunt would tell us."
