---
description: Setting up systems with security in mind, including removing unnecessary services, changing unsafe defaults, and limiting access.
---

Setting up systems safely rather than leaving them as they came out of the box. Many products ship with convenient but risky defaults: a default admin password, every feature switched on, remote access open to anyone.

Secure configuration (sometimes called *hardening*) means changing those defaults: turn off services you don't use, change default passwords, restrict who can log in, and enable security features like logging. Each change shrinks the [attack surface](./Attack%20surface.md). Published checklists, called *baselines* or *benchmarks*, describe recommended settings for common systems.

Misconfiguration is one of the most common causes of breaches — for example, a cloud storage folder accidentally set to "public". Configurations also drift over time as people make quick changes, so they need checking regularly, as part of [vulnerability management](./Vulnerability%20management.md). [Firewall](./Firewall.md) rules are a classic example of configuration that needs review, since a weak setting can be as much a [vulnerability](./Vulnerability.md) as a software bug.

_Avoid:_ "it works, so it's configured correctly" — working and secure are different; defaults often favor convenience.

_Usage:_

"The new router works fine out of the box."

"Did anyone change the default admin password? That's the first step of secure configuration."
