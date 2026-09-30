---
description: An authorized, scoped test that safely simulates selected attacker techniques to find and validate weaknesses in systems or processes.
---

An authorized test in which security professionals try to break into systems using real attacker techniques, to find weaknesses before criminals do. It's often called a *pen test*. The key word is *authorized*: the organization agrees in writing to what will be tested, how, and when.

A pen tester might try to get into a web application (looking for flaws like [SQL injection](./SQL%20injection.md)), break into the internal network from a staff laptop, or trick employees with test phishing emails. Unlike an automated scan, testers chain weaknesses together and prove what's actually possible — "from this bug, we reached the customer database." Where a scan says a flaw *might* be exploitable, a pen test often shows it with a working [exploit](./Exploit.md).

The result is a report of findings ranked by severity, with recommended fixes, which feeds [vulnerability management](./Vulnerability%20management.md). Pen tests are usually narrow and time-boxed; broader, stealthier exercises that test detection and response are done by a [red team](./Red%20team.md).

_Avoid:_ "pen test" as hacking without permission — without written authorization, it's simply an attack.

_Usage:_

"Is our new customer portal secure?"

"Let's get a penetration test before launch. We'd rather a tester finds the holes than an attacker."
