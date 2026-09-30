---
description: A device or software control that permits or blocks network traffic according to configured rules.
---

A barrier that checks network traffic and allows or blocks it according to rules. A rule might say "allow web traffic to the website server; block everything else from the internet". Firewalls exist as dedicated devices protecting a whole network, and as software on individual computers.

Firewalls are a basic [security control](./Security%20control.md): they reduce what's reachable from outside and enforce the boundaries in [network segmentation](./Network%20segmentation.md). Modern "next-generation" firewalls can also inspect traffic content and recognize applications, and may include prevention features like an [intrusion prevention system](./Intrusion%20detection%20system%20%28IDS%29.md).

A firewall is only as good as its rules. Overly broad rules ("allow all from anywhere, temporarily") often become permanent holes, which is why firewall rules are part of [secure configuration](./Secure%20configuration.md) and are reviewed regularly. Firewalls also can't stop threats that arrive through allowed channels, like a [phishing](./Phishing.md) link in an email.

_Avoid:_ "we have a firewall, so we're safe" — it controls traffic, but can't stop attacks that come through what it allows.

_Usage:_

"The vendor asked us to open all ports for their tool."

"Let's ask exactly which ports they need. A firewall rule that allows everything protects nothing."
