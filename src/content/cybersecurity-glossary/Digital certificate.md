---
description: A digitally signed document that binds an identity or named subject to a public key, with details that allow relying systems to validate it.
---

An electronic document that ties an identity — like a website's domain name — to a public key, and is [digitally signed](./Digital%20signature.md) by a trusted issuer called a *certificate authority* (CA). It's like a passport: the passport office vouches that the photo and name belong together.

When you visit a website over HTTPS, the site presents its certificate. Your browser checks that it was signed by a CA it trusts, that it matches the domain, and that it hasn't expired or been revoked. If everything checks out, [TLS](./Transport%20Layer%20Security%20%28TLS%29.md) uses the certificate to prove the server's identity while setting up [encryption](./Encryption.md).

The whole system behind this — certificate authorities, the rules for issuing and revoking certificates, and the software that checks them — is called **public key infrastructure (PKI)**. Organizations also run their own internal PKI for things like employee devices. Expired certificates are a common cause of outages when nobody tracks renewal dates.

_Avoid:_ "certificate means the site is trustworthy" — it confirms the site's identity, not that its owner is honest.

_Usage:_

"Why is the website suddenly showing a security warning?"

"The certificate expired last night. Renew it and the warning goes away."
