# Contexto del Proyecto

## Objetivo
Qard es una plataforma de gestión financiera personal diseñada para facilitar el control de transacciones y finanzas de manera ágil. El objetivo es proporcionar una herramienta robusta, mantenible y escalable.

## Audiencia
Usuarios que buscan centralizar y gestionar sus finanzas personales, ya sea como individuos, freelancers o cabezas de familia.

## Etapa Actual: MVP en Desarrollo Activo
El proyecto se encuentra en un estado funcional avanzado del MVP, con las core features de gestión financiera implementadas sobre React 19, Vite, Zustand y Supabase.

## Features Implementadas (Estado al 2026-09-10)

### 1. Autenticación
- **Estado**: Implementado.
- **Detalle**: Flujo completo de Login, Registro y Recuperación de contraseña (`ForgotPasswordPage`). Uso de layouts específicos para auth (`AuthLayout`).

### 2. Gestión de Transacciones
- **Estado**: Implementado.
- **Detalle**: Creación, visualización y eliminación de ingresos/egresos (`TransactionsPage`, `TransactionForm`). Integración con categorías y métodos de pago. Incluye lógica de manejo de cuotas vinculadas a transacciones.

### 3. Gestión de Categorías y Presupuestos
- **Estado**: Implementado.
- **Detalle**: CRUD de categorías (`CategoriesPage`) con asignación de color e icono. Gestión de presupuestos mensuales (`insertBudget`, `updateBudget`) vinculados a categorías.

### 4. Métodos de Pago
- **Estado**: Implementado.
- **Detalle**: Gestión de métodos de pago (`PaymentMethodsPage`) (débito/crédito) incluyendo configuración de límites y fechas de cierre/vencimiento.

### 5. Transacciones Recurrentes
- **Estado**: Implementado.
- **Detalle**: Gestión de transacciones recurrentes (`RecurrentsPage`) con frecuencias configurables.

### 6. Dashboard (Resumen Financiero)
- **Estado**: Implementado.
- **Detalle**: Visualización de balance, ingresos, egresos y cuotas impagas. Gráfico de dona para desglose de gastos por categoría y barra de progreso de presupuesto total (`DashboardPage`). Incluye Modo Demo.

---

## Features Pendientes / Roadmap (Contrastar con `scope.md`)

- **Integración WhatsApp**: Pendiente (Registro de gastos vía chat y notificaciones).
- **Cálculos Avanzados**: Refinar el manejo de cuotas complejas y compras compuestas (`shopping_items` mencionados en scope).
- **Métricas Avanzadas**: Profundizar en el análisis de salud financiera más allá del resumen mensual.
