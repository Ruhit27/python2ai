---
description: The naming system that helps devices find internet services by translating domain names, such as example.com, into network addresses.
---

The internet's address book. Computers find each other using numeric addresses, but people use names like example.com. DNS translates the name you type into the address your device should connect to.

Because almost everything online relies on it, DNS matters for security in several ways. Attackers register look-alike domains (examp1e.com) for [phishing](./Phishing.md); take over forgotten DNS records to hijack a company's subdomain; or tamper with DNS answers to send people to fake sites. A company's domains and DNS settings are part of its [attack surface](./Attack%20surface.md).

DNS also helps defenders. Blocking lookups for known malicious domains — often at the [firewall](./Firewall.md) or a filtering DNS service — stops many threats early. And DNS lookups recorded in [security logs](./Security%20log.md) can reveal infected devices contacting attackers.

_Avoid:_ "DNS" as a website host — DNS only points names to addresses; the website lives elsewhere.

_Usage:_

"We shut down the old marketing site, so we're done."

"Delete its DNS record too. A dangling record can let someone take over that subdomain."
