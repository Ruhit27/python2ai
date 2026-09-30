---
description: The initial assessment and prioritization of alerts or incidents to determine what needs investigation first and what response is appropriate.
---

The first quick assessment of [security alerts](./Security%20alert.md) or incidents to decide what matters most and what to do next — borrowed from hospital emergency rooms, where patients are sorted by urgency.

For each alert, triage asks: Is this real or a false alarm? How serious could it be? What's affected — one test laptop or the payment system? Is it still happening? The answers decide whether to close it, investigate further, or escalate it as a [security incident](./Security%20incident.md) and start [incident response](./Incident%20response.md).

Good triage depends on context: knowing which assets are critical, what normal activity looks like, and what attackers typically do. It's where analysts spend much of their time, and where proactive [threat hunting](./Threat%20hunting.md) findings are also assessed.

_Avoid:_ "triage" as fixing the problem — triage only decides priority and next steps.

_Usage:_

"There are three alerts. Which one first?"

"Triage them: the one on the finance server with outbound data transfer goes first."
