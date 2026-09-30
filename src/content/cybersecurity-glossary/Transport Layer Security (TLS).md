---
description: A protocol used to protect data in transit and help authenticate a server, commonly used for HTTPS connections.
---

The protocol that protects data traveling between two computers — most visibly, between your browser and a website. When a web address starts with **https://**, TLS is protecting the connection. It replaced an older protocol called SSL, and people still sometimes say "SSL" when they mean TLS.

TLS does two jobs. It uses [encryption](./Encryption.md) so no one in between (on the café Wi-Fi, say) can read or alter the data. And it helps prove the server is genuine: the site presents a [digital certificate](./Digital%20certificate.md), which your browser checks before trusting it.

TLS protects data *in transit* only. It doesn't mean a website is honest — [phishing](./Phishing.md) sites use HTTPS too — and it doesn't protect data once it's stored on the server. A [VPN](./Virtual%20private%20network%20%28VPN%29.md) also protects data in transit, but for a whole connection rather than one application.

_Avoid:_ "the padlock means the site is safe" — it means the connection is protected, not that the site is trustworthy.

_Usage:_

"The site has a padlock, so it can't be a phishing page."

"Phishing sites get certificates too. TLS protects the connection, not the intentions."
