# CSS Performance Rules — YPF El Puente

## Regla fundamental: Solo transform y opacity en animaciones

**Solo `transform` y `opacity` pueden usarse en transiciones, animaciones, :hover o scroll.**

Nunca animar directamente:
- `filter` (incluyendo `drop-shadow()`)
- `backdrop-filter`
- `box-shadow` (valores que cambian)
- `width`, `height`, `top`, `left` (en lugar de `transform`)

### Por qué

Estas propiedades fuerzan repintado en la GPU y generan jank severo en hardware integrado de gama baja (ej: AMD Radeon Vega 3 con 3 unidades de cómputo).

`transform` y `opacity` se resuelven en la capa de composición del navegador sin repintar — son las únicas propiedades "baratas" de animar.

### Excepciones permitidas

`backdrop-filter` y `filter` pueden usarse **solo en elementos estáticos** (no sticky, no fixed, no animados) donde el costo se paga una sola vez al renderizar, no 60 veces por segundo.

### Alternativa para efectos de sombra al hover

Si se necesita un efecto de sombra que crece al interactuar:

```css
.card {
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15); /* sombra base estática */
  transition: transform 0.25s ease;
}

.card::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4); /* sombra elevada pre-calculada */
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.card:hover::after {
  opacity: 1; /* solo animamos opacity, no box-shadow */
}
```

### Regla para elementos sticky/fixed

Elementos con `position: sticky` o `position: fixed` **nunca** deben tener `backdrop-filter`. El navegador recalcula el desenfoque en cada frame de scroll porque el contenido detrás cambia constantemente.

Reemplazar por fondo sólido más opaco:
```css
/* MAL */
.sticky-header {
  backdrop-filter: blur(20px);
  background: rgba(0,0,0,0.5);
}

/* BIEN */
.sticky-header {
  background: rgba(0,0,0,0.96);
}
```

## Hardware de referencia

Todo efecto visual debe probarse en hardware de oficina básico:
- GPU integrada (AMD Radeon Vega 3 o similar)
- 4 hilos de CPU
- Sin GPU discreta

Si un efecto genera jank en este hardware, no es apto para producción.
