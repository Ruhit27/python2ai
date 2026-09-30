---
description: A system that collects and correlates security events from multiple sources to help analysts find suspicious patterns and investigate alerts.
---

A system that gathers [security logs](./Security%20log.md) and events from across an organization — laptops, servers, [firewalls](./Firewall.md), cloud services, [IDS](./Intrusion%20detection%20system%20%28IDS%29.md) alerts — into one place, and looks for patterns that suggest an attack.

The key word is *correlate*. One failed login means little; 500 failed logins across many accounts from one location, followed by one success, suggests a password-guessing attack. A SIEM connects events that look harmless on their own and raises a [security alert](./Security%20alert.md) when a rule matches. Analysts also use it to search and investigate during [incident response](./Incident%20response.md).

SIEMs are powerful but demanding: they need the right data sources, well-tuned rules, and people to watch them. A SIEM nobody monitors, or one flooding analysts with false alarms, gives a false sense of security. It's usually run by a security operations center (SOC).

_Avoid:_ "SIEM" as a tool that stops attacks — it detects and helps investigate; people and other tools respond.

_Usage:_

"Why did no one notice the attack for three weeks?"

"The SIEM raised an alert, but thousands of noisy ones buried it. We need to tune the rules."
