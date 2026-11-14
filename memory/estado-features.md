---
name: estado-features-transacciones
description: Seguimiento del estado de desarrollo de las funcionalidades de transacciones
metadata:
  type: project
---

**Estado de Features de Transacciones:**

- [x] **Persistencia de Ítems de Compra (Desglose)**: Implementada mediante la tabla relacional `shopping_items`. Se modificó `insertTransaction` en `src/api/transactions.js` para realizar inserciones múltiples atomizadas.
- [x] **UI de Detalle Expandible**: Añadida en `TransactionsPage.jsx`. Ahora es posible hacer clic en transacciones desglosadas para visualizar los ítems individuales.
- [x] **Robustez en el Formulario**: Corregido el cálculo del monto (`amount`) para evitar conflictos entre estados manuales y automáticos (`TransactionForm.jsx`).
- [ ] **Sincronización en Modo Demo**: Falta asegurar que el modo demo (`isDemoMode`) refleje fielmente la estructura relacional de los `shopping_items` al añadir una transacción, ya que actualmente sigue usando la estructura de `metadata` (JSON).

**Why:**
- Se migró de una estructura de `metadata` (JSONB no existente) a una estructura relacional más robusta (`shopping_items`) para mayor integridad de datos y facilidad de consultas analíticas.

**How to apply:**
- Para cualquier nueva feature de transacciones que requiera datos complejos, siempre preferir tablas dedicadas sobre columnas JSONB en `transactions`.
- Mantener la sincronía entre `financeStore.js` (demo) y `api/` (producción).
