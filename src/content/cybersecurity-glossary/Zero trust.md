---
description: A security approach that does not grant trust solely because of network location; access is evaluated using identity, context, and policy.
---

A security approach built on "never trust, always verify". Older networks worked like a castle: anyone inside the office network was trusted. Zero trust drops that assumption — being on the company network, or connected through a [VPN](./Virtual%20private%20network%20%28VPN%29.md), isn't enough on its own.

Instead, every request is checked using identity and context: Is this really the user ([authentication](./Authentication.md), ideally with [MFA](./Multi-factor%20authentication%20%28MFA%29.md))? Is their device up to date? Is this access normal for their role? Then only the minimum access is granted ([least privilege](./Least%20privilege.md)), and it's re-checked over time.

Zero trust grew because the "inside" stopped making sense: staff work from home, apps live in the cloud, and attackers who get one foothold inside could otherwise roam freely. It's a direction, not a product — organizations move toward it step by step, often starting with strong [IAM](./Identity%20and%20access%20management%20%28IAM%29.md), [access control](./Access%20control.md), and [network segmentation](./Network%20segmentation.md).

_Avoid:_ "zero trust" as a product you can buy — it's an approach, built from many controls over time.

_Usage:_

"If someone's on the office Wi-Fi, can we skip MFA?"

"Not under zero trust. Being on our network doesn't prove who they are."
