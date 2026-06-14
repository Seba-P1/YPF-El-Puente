---
name: payments-latam-security
description: Seguridad mínima para CUALQUIER integración de pagos.
---

# No negociables
- [ ] PCI-DSS SAQ A (hosted) — NUNCA SAQ D propio salvo equipo dedicado.
- [ ] HTTPS obligatorio, TLS 1.3 only.
- [ ] HSTS preload + CSP estricto.
- [ ] Webhook con HMAC y replay protection (timestamp ±5 min).
- [ ] Idempotency key en TODO POST.
- [ ] No loguear PAN ni CVV NUNCA. Mask en transit.
- [ ] Reconciliación diaria con API del gateway.
- [ ] 3DS 2.x habilitado donde aplique (Argentina: obligatorio).
- [ ] Tokenización para suscripciones (jamás guardar card data).
- [ ] Anti-fraude: Mercado Pago, Stripe Radar, Kushki Smart Routing.
- [ ] Antilavado: KYC obligatorio si volumen alto.
- [ ] Logs PCI: append-only, retención 1 año, cifrado at-rest.