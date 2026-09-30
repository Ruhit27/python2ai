---
description: A technology that creates an authenticated, protected connection across a network that is not fully trusted; it does not by itself make a device or service safe.
---

A way of creating a protected "tunnel" across a network you don't fully trust, such as the internet or café Wi-Fi. Traffic inside the tunnel is protected with [encryption](./Encryption.md), and the connection is [authenticated](./Authentication.md) so only allowed users can connect.

Companies use VPNs to let remote staff reach internal systems as if they were in the office. Consumers use commercial VPNs mainly for privacy on public Wi-Fi, or to appear to be in another country.

A VPN protects the connection, not the device or the destination. It doesn't remove [malware](./Malware.md) from your laptop, stop you clicking a [phishing](./Phishing.md) link, or make an unsafe website safe. And a stolen VPN account can give an attacker a direct route inside, which is why VPNs should require MFA. [Zero trust](./Zero%20trust.md) approaches increasingly replace broad VPN access with per-application checks, backed by [network segmentation](./Network%20segmentation.md).

_Avoid:_ "a VPN makes me anonymous and safe online" — it protects the connection, not your device or what you click.

_Usage:_

"I'm on the VPN, so this download must be safe."

"The VPN only protects the connection. It can't tell you whether the file is malware."
