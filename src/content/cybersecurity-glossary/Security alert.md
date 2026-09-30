---
description: A notification that activity may match a security rule or indicate a possible threat; an alert needs assessment and is not automatically proof of an incident.
---

A notification that something *might* be wrong — activity that matched a detection rule, like a login from an unusual country or a program behaving like [malware](./Malware.md). Alerts come from tools like a [SIEM](./Security%20information%20and%20event%20management%20%28SIEM%29.md), an [IDS](./Intrusion%20detection%20system%20%28IDS%29.md), or [EDR](./Endpoint%20detection%20and%20response%20%28EDR%29.md).

An alert is a question, not a verdict. Many are *false positives* — normal activity that looks suspicious, like an employee logging in from holiday. Others are real. Deciding which is which, and how urgent each is, is [triage](./Triage.md). Only when an alert is confirmed as harmful does it become a [security incident](./Security%20incident.md).

"Alert fatigue" is a real problem: when tools produce thousands of low-value alerts, analysts can miss the one that matters. Good security teams constantly tune rules to keep alerts meaningful.

_Avoid:_ "alert" and "incident" as the same — an alert is a warning to check; an incident is confirmed harm or a real threat.

_Usage:_

"We got 2,000 alerts overnight. Are we under attack?"

"Probably not — most will be noise. Triage them and see if any are real."
