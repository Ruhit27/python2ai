---
description: Security technology that collects endpoint activity to help detect suspicious behavior, investigate it, and take response actions.
---

Security software that runs on [endpoints](./Endpoint.md) — laptops, servers — and continuously records what happens on them: programs starting, files changing, network connections. It uses that data to spot suspicious behavior and lets defenders investigate and act.

Traditional antivirus mainly checks files against a list of known [malware](./Malware.md). EDR goes further by watching *behavior* — for example, a word processor suddenly launching a command prompt and encrypting files, which suggests [ransomware](./Ransomware.md) even if the program is new.

The "response" part is important: an analyst can isolate an infected laptop from the network with one click, stop a process, or collect evidence, which speeds up [incident response](./Incident%20response.md). EDR data usually feeds into a [SIEM](./Security%20information%20and%20event%20management%20%28SIEM%29.md) alongside other [security logs](./Security%20log.md).

_Avoid:_ "EDR" as just antivirus — it records and analyzes behavior, and lets defenders respond remotely.

_Usage:_

"Can we stop the infected laptop from spreading this?"

"Yes — isolate it through the EDR console. It'll be cut off from the network in seconds."
