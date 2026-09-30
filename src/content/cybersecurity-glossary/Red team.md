---
description: A group that conducts authorized, realistic adversary simulations to test how well an organization can prevent, detect, and respond to attacks.
---

An authorized group that plays the attacker, simulating a real adversary as realistically as possible to test the whole organization's defenses — technology, people, and processes. Where a [penetration test](./Penetration%20testing.md) tries to find as many weaknesses as possible in a set scope, a red team usually pursues a goal ("reach the payroll system") stealthily over weeks, like a real [threat actor](./Threat%20actor.md).

Its counterpart is the **blue team**: the defenders who monitor systems, detect suspicious activity, and handle [incident response](./Incident%20response.md) — the security operations staff working every day, not just during exercises. Red team exercises test whether the blue team notices and responds in time. Often the blue team isn't told the exercise is happening, to keep it realistic.

When both work together openly — the red team showing techniques live while the blue team tunes detections — it's called *purple teaming*. The value of red teaming isn't "we got in" (attackers usually can, eventually) but what it reveals about detection and response.

_Avoid:_ "red team" as any security tester — it specifically means realistic, goal-driven adversary simulation.

_Usage:_

"The red team got domain admin in two weeks and nobody noticed."

"Then the real finding is for the blue team: our detection missed every step."
