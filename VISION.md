# VISION.md — Sistema de Gestión de Gastos Personales

## Pitch
Aplicación **personal** (no orientada a comercios) para el registro y control de gastos e ingresos de una persona física, pensada para bajar al máximo la barrera de entrada al registrar transacciones — incluso para usuarios a quienes históricamente les cuesta llevar un control de sus finanzas. Pensada para un solo usuario en el MVP, con posibilidad de compartirse en un hogar más adelante.

## Problema que resuelve
- Falta de visibilidad sobre en qué se gasta el dinero mes a mes.
- Dificultad para respetar presupuestos por categoría.
- Falta de control sobre gastos recurrentes chicos ("gastos hormiga") y grandes (alquiler, servicios).
- Falta de visibilidad sobre el uso de tarjetas de crédito: cuotas pendientes, límite disponible vs. límite autoimpuesto.
- Alta fricción para registrar gastos en el momento en que ocurren (principal causa de abandono de este tipo de apps).

## Usuarios objetivo
1. **Usuarios organizados** que ya controlan (o quieren empezar a controlar) su economía personal/hogar con objetivos de ahorro concretos.
2. **Usuarios sin hábito de registro**, para quienes cualquier fricción de carga de datos es una barrera crítica de abandono. Este segundo grupo es el que más condiciona las decisiones de UX del producto.

## Funcionalidades principales

### 1. Transacciones
- Registro de **gastos e ingresos** (sueldo, ingresos extra, etc.), para poder calcular balance real disponible, no solo egresos.
- Cada transacción indica **método de pago**: efectivo/débito (cuenta) o tarjeta de crédito.
- Objetivo: distinguir movimientos de dinero disponible en cuenta vs. deuda generada con tarjeta.

### 2. Categorías y presupuestos
- Transacciones organizadas por categoría (ej: Comida, Transporte, Ocio).
- Cada categoría puede tener un **presupuesto mensual flexible** (ej: $300.000 en Comida).
- "Flexible" = el presupuesto es una referencia informativa, no una restricción dura. El usuario puede superarlo sin bloqueos.
- Dashboard/reporte de cierre de mes: gasto real vs. presupuesto por categoría (cumplido / superado y por cuánto).

### 3. Gastos recurrentes
Dos variantes con lógicas distintas:
- **Gastos hormiga recurrentes**: transacciones pequeñas y frecuentes (ej: café diario). El objetivo es que el dashboard pueda agregarlas y mostrar cuánto representan acumuladas en el tiempo.
- **Gastos fijos mensuales**: servicios, alquiler, suscripciones. No necesariamente ligados a tarjeta de crédito. Se cargan una vez y se repiten automáticamente mes a mes.

### 4. Gestión de tarjetas de crédito
- Alta de tarjetas con sus datos (nombre/banco, límite real).
- **Límite autoimpuesto**: el usuario puede definir un tope propio, menor al límite real de la tarjeta (ej: límite real $1.000.000, tope deseado $300.000).
- Gestión de **cuotas**: al cargar un gasto con tarjeta, poder indicar cantidad de cuotas y ver cómo se distribuye en los meses siguientes.
- Vista de deuda proyectada por tarjeta (cuotas pendientes mes a mes).
- **Alertas informativas** (no bloqueantes) cuando el gasto se acerca o supera el tope autoimpuesto. Nunca debe restringir ni rechazar la carga de una transacción.

### 5. Metas de ahorro
- El usuario puede definir objetivos de ahorro (ej: monto destino, fecha objetivo opcional).
- Seguimiento de avance de la meta en base al balance real (ingresos - gastos) del período.
- Visualización del progreso (cuánto falta, si va en línea con el objetivo o no).

### 6. Dashboard / reportes
- Vista mensual de gasto real vs. presupuesto por categoría.
- Balance de ingresos vs. egresos del período.
- Desglose de gastos hormiga acumulados.
- Estado de tarjetas: consumido vs. tope autoimpuesto vs. límite real, cuotas pendientes.
- Progreso de metas de ahorro activas.
- **Historial detallado**: vista global con filtros por transacciones/cuotas/compras.

### 7. Integración vía chat (WhatsApp, alternativamente Telegram)
- Bot conversacional que permite registrar transacciones charlando como con cualquier contacto. Backend orquestado vía Supabase Edge Functions.
- **Registro por texto libre** (MVP): el bot interpreta un mensaje de texto y registra la transacción.
- **Carga por comprobante** (Fase 2): el bot interpreta una imagen de comprobante de transferencia/pago (OCR + IA) y registra la transacción automáticamente. Clave para billeteras virtuales sin API de transacciones.
- **Smart Nudges** (Fase 2): notificaciones programadas para fomentar el retorno a la app y el registro constante.
- Pensado para convertirse en el canal principal de carga de datos, dejando a la app web/mobile más orientada a consulta, reportes y configuración.

### 8. Gastos compartidos con contactos (splits)
- El usuario puede marcar una transacción como "compartida" con uno o más contactos (personas sin cuenta en la app, solo un nombre de referencia).
- División flexible: por porcentaje o por monto fijo, definido libremente por transacción (ej: un regalo entre 2 hermanos, cada uno se hace cargo de lo que acuerden).
- Seguimiento de si la parte del contacto está pagada o pendiente.
- No implica multiusuario ni cuentas compartidas — el contacto no accede a la app, es solo un registro de a quién se le debe/cobra.

## Principios de UX
- Entorno amigable, simple, con estética atractiva.
- Prioridad absoluta: **mínima fricción para cargar una transacción**. Si cargar un gasto es tedioso, el producto no cumple su función, sin importar qué tan completas sean las demás features.
- Nada de restricciones duras sobre el dinero del usuario: todo control de presupuesto o límite de tarjeta es informativo, nunca bloqueante.

## Fuera de alcance (explícitamente descartado)
- Gestión contable/económica de comercios o negocios.
- Multiusuario tipo empresa (roles, permisos complejos, facturación). El multiusuario contemplado acá es, como mucho, un hogar compartiendo gastos — no un caso B2B.
- Cualquier feature que agregue fricción o restricciones duras al registro de una transacción.

## Priorización sugerida (a validar/ajustar)

**MVP**
- Registro de transacciones (gastos e ingresos, efectivo/débito y crédito)
- Categorías + presupuestos flexibles
- Gastos recurrentes (fijos mensuales)
- Gestión de tarjetas de crédito + cuotas + límite autoimpuesto
- Compras compuestas (varios ítems en una sola transacción)
- Metas de ahorro con seguimiento de progreso
- Gastos compartidos con contactos (splits, % o monto fijo)
- Historial detallado con filtros
- Dashboard mensual (balance, presupuesto vs. real, estado de tarjetas, progreso de metas)
- Integración WhatsApp — registro por texto libre
- Usuario único (sin multiusuario)

**Fase 2**
- Multiusuario / hogar compartido (cuentas compartidas, distinto de los splits con contactos)
- Gastos hormiga recurrentes con agregación específica en dashboard
- Alertas informativas de límite de tarjeta y presupuesto
- Integración WhatsApp — carga por comprobante (OCR/IA)
- Integración WhatsApp — Smart Nudges (notificaciones de engagement)

**Fase 3 (posible)**
- Rediseño completo del apartado mobile
