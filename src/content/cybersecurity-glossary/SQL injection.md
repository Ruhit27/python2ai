---
description: A web-application flaw where untrusted input is handled as part of a database command, potentially allowing an attacker to read or alter data.
---

A web [vulnerability](./Vulnerability.md) where text a user types into a website — a search box, a login form — gets mixed directly into a database command (written in a language called SQL). A crafted input can then change what the command does: reveal every customer record, bypass a login, or delete data.

Picture a login that builds its database query by pasting in whatever you type as your username. An attacker types something that isn't a name at all, but a fragment of database command — and the database obeys it.

It's an old and well-understood flaw with a reliable fix: *parameterized queries*, which keep user input strictly separate from the command. Most modern frameworks and database libraries do this by default, but SQL injection still appears in custom or older code. [Penetration testing](./Penetration%20testing.md) and code reviews look for it, and it's a common target of [exploits](./Exploit.md).

_Avoid:_ "input validation alone fixes SQL injection" — the reliable fix is parameterized queries; validation is an extra layer.

_Usage:_

"The search box crashes when I type an apostrophe."

"That could be SQL injection. Tell the developers — the query is probably built by pasting in user input."
