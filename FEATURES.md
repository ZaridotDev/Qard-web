# FEATURES.md — Backlog derivado de VISION vs CONTEXT

> v2 — Regenerado incorporando `architecture.md`, `db.md`, `scope.md` y `CLAUDE.md` además del `context.md` original.
> Cada ticket incluye prioridad, motivo, estado real (según esquema de base de datos cuando aplica) y criterio de aceptación. Pensado para que una sesión de Claude Code lo tome directamente.

---

## 🔴 Prioridad Alta — Gaps confirmados de MVP

### FEAT-001: Metas de ahorro
**Estado**: No implementado. Confirmado por ausencia total en `db.md` — no existe tabla de metas/objetivos de ahorro.
**Por qué**: Feature de MVP en VISION.md, sección 5.
**Alcance**:
- Nueva tabla `savings_goals` (o similar): `user_id`, `target_amount`, `target_date` (opcional), `is_active`/`is_completed`, `created_at`.
- API en `src/api/` (siguiendo convención de CLAUDE.md — nunca llamar a Supabase directo desde componente).
- CRUD de metas.
- Cálculo de progreso en base a balance real (ingresos - egresos) del período relevante — extraer a hook en `src/hooks/` si la lógica supera ~50 líneas.
- Card en Dashboard con progreso de metas activas.
**Criterio de aceptación**: Un usuario crea una meta de $X y el dashboard muestra avance real actualizado con sus transacciones.

---

### FEAT-002: Gastos compartidos con contactos (splits)
**Estado**: Parcialmente scaffoldeado en base de datos — existen las tablas `contacts` (`id`, `user_id`, `profile_id`, `name`) y `transaction_splits` (`transaction_id`, `contact_id`, `amount`, `is_paid`, `paid_at`). **No confirmado si tiene UI/lógica implementada** (no aparece en `context.md` como feature implementada).
**Por qué**: Feature explícitamente definida por el usuario — dividir un gasto puntual con una persona (sin cuenta en la app) en % o monto fijo, con seguimiento de pago.
**Alcance**:
- Confirmar con Claude Code si ya hay UI para esto o si solo existe el modelo de datos.
- Si falta UI: pantalla/modal para agregar contactos, marcar una transacción como compartida, definir división (% o monto fijo — el `amount` en `transaction_splits` sugiere que ya está pensado como monto fijo; si se quiere además por porcentaje, calcular el monto resultante al guardar).
- Vista de "deudas" por contacto: cuánto le corresponde a cada uno y si ya pagó (`is_paid`, `paid_at`).
- Marcar como pagado (actualiza `is_paid`/`paid_at`).
**Criterio de aceptación**: Al crear una transacción, el usuario puede compartirla con uno o más contactos, definir cuánto le toca a cada uno, y ver/actualizar el estado de pago de cada parte.
**Nota**: Esto es distinto del "multiusuario/hogar compartido" (Fase 2) — acá el contacto no tiene cuenta ni acceso a la app.

---

### FEAT-003: Compras compuestas (shopping_items)
**Estado**: Tabla existe en base (`shopping_items`: `transaction_id`, `category_id`, `price`, `quantity`, `description`), y ya está marcada como pendiente de refinar en el roadmap del `context.md`. Confirmado como parte del MVP en `scope.md`.
**Por qué**: Coincide con la necesidad de registrar una compra con varios ítems (ej: supermercado) desglosados por categoría.
**Alcance**:
- Confirmar con Claude Code el estado real de la UI (¿existe formulario para agregar ítems a una transacción? ¿se refleja en categorías/presupuestos correctamente?).
- Completar el flujo: al cargar una transacción, opción de "desglosar en ítems", cada ítem con su categoría, precio y cantidad propios.
- Verificar que los presupuestos por categoría contemplen el desglose por ítem y no solo el total de la transacción.
**Criterio de aceptación**: Una compra de supermercado con ítems de distintas categorías se refleja correctamente en el presupuesto de cada categoría afectada, no solo en una categoría general.

---

### FEAT-004: Historial detallado con filtros
**Estado**: No confirmado en `context.md` (solo menciona "creación, visualización y eliminación" en `TransactionsPage`, sin mención de filtros ni vista global unificada). Requerido explícitamente en `scope.md` como parte del MVP.
**Por qué**: Sin esto, el usuario no puede auditar fácilmente su historial completo (transacciones + cuotas + compras compuestas juntas).
**Alcance**:
- Confirmar con Claude Code si existen filtros actuales en `TransactionsPage`.
- Vista unificada con filtro por tipo (transacción simple / cuota / compra con ítems), rango de fechas, categoría, método de pago.
**Criterio de aceptación**: El usuario puede filtrar su historial completo por tipo de movimiento, fecha, categoría y método de pago desde una sola vista.

---

## 🟡 Prioridad Media — Verificar / completar (infraestructura existe, falta confirmar uso real)

### FEAT-005: Exponer y usar `personal_limit` en tarjetas
**Estado**: **Ya existe en base** (`payment_methods.personal_limit`, distinto de `credit_limit`). Este ítem deja de ser "construir desde cero" y pasa a ser "verificar y completar".
**Por qué**: Es el "límite autoimpuesto" central de la visión.
**Alcance**:
- Confirmar con Claude Code si `personal_limit` ya se pide en el formulario de alta/edición de tarjeta (`PaymentMethodsPage`).
- Si no está expuesto en UI: agregarlo al formulario.
- Confirmar que la lógica nunca bloquea una transacción que supere `personal_limit` — solo debe informar (ver FEAT-006).
**Criterio de aceptación**: El campo `personal_limit` es visible y editable desde la UI, y no restringe la carga de transacciones.

---

### FEAT-006: Alertas informativas (tarjetas y presupuestos)
**Estado**: Infraestructura parcial existente — tabla `notifications` (`scheduled_for`, `is_sent`, `is_read`, `message`) y columna `budgets.alert_threshold`. **No confirmado si está conectada a lógica real** (no aparece como feature implementada en `context.md`).
**Por qué**: Definido en VISION.md — avisar sin bloquear, tanto para tope de tarjeta como para presupuesto de categoría.
**Alcance**:
- Confirmar con Claude Code si `alert_threshold` de `budgets` ya dispara algo, o es un campo sin lógica asociada todavía.
- Definir y conectar: cuando el consumo de una tarjeta se acerca/supera `personal_limit`, o el gasto de una categoría se acerca/supera `alert_threshold` de su presupuesto, generar un registro en `notifications` y mostrarlo como aviso no bloqueante en la UI (banner/badge).
**Criterio de aceptación**: Cargar un gasto que cruza el umbral de alerta (tarjeta o presupuesto) genera una notificación visible, sin impedir guardar la transacción.
**Nota**: Distinto de los "Smart Nudges" (FEAT-008, Fase 2), que son notificaciones de re-engagement, no de control de límites.

---

## 🟢 Prioridad Baja / Fase 2 — Correctamente pendientes

### FEAT-007: WhatsApp — registro por texto libre (MVP según scope.md)
**Estado**: No implementado. Arquitectura ya definida en `architecture.md` (Supabase Edge Functions como orquestador). ADR pendiente de documentar.
**Alcance**: Webhook + Edge Function que recibe mensaje de WhatsApp, interpreta la transacción (monto, categoría, método de pago) vía IA, y la registra usando la misma capa de `src/api/` existente.
**Nota de prioridad**: `scope.md` lo marca como MVP; se recomienda arrancar por esta versión simple (texto) antes que por OCR de comprobantes.

### FEAT-008: WhatsApp — OCR de comprobantes + Smart Nudges
**Estado**: Diseñado a nivel arquitectura, no implementado.
**Fase**: 2.
**Alcance**: Motor de OCR/IA para interpretar imágenes de comprobantes; sistema de notificaciones programadas (`notifications` table ya soporta `scheduled_for`) para fomentar el registro constante.

### FEAT-009: Gastos hormiga con agregación específica en Dashboard
**Estado**: Existe "Transacciones Recurrentes" genérico (`recurring_transactions`), sin distinción de "gasto hormiga" ni vista agregada específica.
**Fase**: 2.
**Alcance**: Flag o categoría especial para marcar una recurrente como "gasto hormiga" + card en Dashboard con el acumulado.

### FEAT-010: Multiusuario / hogar compartido
**Estado**: No implementado como tal. La tabla `profiles` (`is_default`, `budget_start_day`) podría ser la base para esto, pero no hay confirmación — conviene preguntarle a Claude Code para qué se está usando `profiles` actualmente antes de asumir que es el punto de partida.
**Fase**: 2.
**Alcance**: A definir en detalle cuando se aborde. Distinto de FEAT-002 (splits con contactos sin cuenta).

---

## Notas / decisiones pendientes

- **Conflicto de prioridad resuelto**: `scope.md` ponía WhatsApp completo en MVP; se dividió en FEAT-007 (MVP, texto) y FEAT-008 (Fase 2, OCR + nudges) por diferencia de complejidad técnica. Confirmar que este split tiene sentido para el equipo/vos antes de arrancar.
- **`profiles` vs multiusuario**: hay que preguntarle a Claude Code para qué se usa hoy la tabla `profiles` — puede ser solo configuración personal (día de inicio de presupuesto) y no tener relación con multiusuario real.
- **Modo Demo** (mencionado en `context.md`, Dashboard): no contemplado en VISION.md ni en scope.md. Sigue pendiente decidir si se documenta como feature permanente.
- Los principios de UX (mínima fricción, nada de restricciones duras) siguen sin poder verificarse solo leyendo esquema/roadmap — requieren revisión funcional manual.

---

## Convenciones para quien tome estos tickets (de `CLAUDE.md` / `architecture.md`)
- JavaScript, no TypeScript. Usar JSDoc en objetos/stores complejos.
- Lógica fuera de `src/pages`; si supera ~50 líneas o hay procesamiento pesado, extraer a hook en `src/hooks/`.
- Estado global en Zustand (`src/store/`), no `useState` local para datos usados por múltiples páginas.
- Nunca llamar a Supabase directo desde un componente — siempre pasar por `src/api/`.
- Sin estilos inline — CSS en `src/styles/`.
