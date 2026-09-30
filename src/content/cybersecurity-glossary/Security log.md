---
description: A time-stamped record of system or user activity that can help explain what happened and support detection or investigation.
---

A time-stamped record of what happened on a system: who logged in and when, which files were opened, what network connections were made, which settings changed. Almost every system can produce logs — servers, [firewalls](./Firewall.md), cloud services, laptops.

Logs are the raw evidence for security. They're used to detect attacks as they happen (tools like an [IDS](./Intrusion%20detection%20system%20%28IDS%29.md) or [EDR](./Endpoint%20detection%20and%20response%20%28EDR%29.md) generate them), and to investigate afterwards: during a [security incident](./Security%20incident.md), logs show how an attacker got in and what they touched.

Common problems are logs that are switched off, kept too briefly, or scattered across hundreds of systems. That's why organizations collect them centrally, often in a [SIEM](./Security%20information%20and%20event%20management%20%28SIEM%29.md). Logs themselves need protecting too — attackers often try to delete them to cover their tracks.

_Avoid:_ "logs" as only for developers debugging — they are key security evidence.

_Usage:_

"How long was the attacker in our system?"

"The logs only go back 7 days, so we can't tell. We need to keep them longer."
