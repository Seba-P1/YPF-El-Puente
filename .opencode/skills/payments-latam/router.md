---
name: payments-latam-router
description: Elige el gateway correcto según país y modelo de negocio. Use ANTES de integrar cualquier pasarela.
---

# Matriz de decisión 2026

| País | Gateway principal | Alternativa | Métodos clave |
|------|-------------------|-------------|---------------|
| Argentina | **Mercado Pago** | Ualá Bis, MODO | Tarjeta, transferencia 3.0, cuenta MP, QR |
| Brasil | **Stripe Pix** + Mercado Pago | dLocal, Pagar.me | Pix, boleto, cartão, Pix Parcelado |
| México | **Mercado Pago** | Stripe, Conekta, OpenPay | SPEI, OXXO, tarjeta, CoDi |
| Colombia | **Wompi** (Bancolombia) | PayU, ePayco | PSE, Nequi, Bre-B, tarjeta |
| Chile | **Transbank Webpay** | Mercado Pago, Khipu, Flow | WebPay Plus, Onepay |
| Perú | **Niubiz** / Culqi | Izipay, Mercado Pago | Yape, PagoEfectivo, tarjeta |
| Ecuador | **Kushki** | PayPhone | DataFast, Pago Plus, tarjeta |
| Uruguay | **dLocal Go** | Mercado Pago | Tarjeta, redes cobranza |
| LATAM-wide / cross-border | **dLocal** o **Kushki PSP** | Stripe + Mercado Pago combo | API única 15+ países |

# Reglas
1. SaaS B2C local: empezar con Mercado Pago (cubre AR/MX/BR/CL/CO/PE/UY).
2. Marketplace cross-border: dLocal Go o Stripe + Pix.
3. Recurrencia: Mercado Pago Subscriptions + Stripe Pix recurring (lanzado 2026-04 por Stripe).
4. SIEMPRE soportar al menos: tarjeta + 1 método local (Pix/PSE/SPEI/Yape).
5. Bre-B (Colombia) es OBLIGATORIO desde 2026 si tu volumen es relevante.