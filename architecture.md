# Architecture

## Overview
Project built with React 19 + Vite. The goal is maintainability, component modularity, and a clean separation between data fetching and UI rendering.

## Core Tech Stack
- **Framework**: React 19 (Vite).
- **State Management**: Zustand (stores located in `src/store/`).
- **Data Layer**: Supabase (via `src/lib/supabaseClient.js`).
- **Routing**: React Router v7.

## Arquitectura Conversacional (WhatsApp-First)
Para reducir la fricción de registro, Qard implementará un backend basado en Webhooks que permite interactuar con la app vía WhatsApp. 
- **Backend**: Supabase Edge Functions como orquestador.
- **Motor**: Integración con IA para procesamiento de lenguaje natural y OCR de comprobantes.
- **Engagement**: Sistema de notificaciones programadas ("Smart Nudges") para fomentar el retorno a la app (Web/Mobile).

## Coding Conventions
- **JavaScript over TypeScript**: We use standard JS. Use JSDoc comments (`/** @param {...} ... */`) for complex objects or store definitions to help IDE/AI infer types.
- **Component Logic**: Keep logic out of `src/pages`. If a feature is complex (over 50 lines or heavy data processing), extract logic into custom hooks in `src/hooks/`.
- **State**: Use Zustand for global state. Do not use local `useState` for data that needs to be accessed by multiple unrelated pages.

## Constraints
- No inline styles. Use CSS classes in `src/styles/`.
- Keep API interactions unified. Never call Supabase directly from a component; always use a function from `src/api/`.

## Architecture Decision Records (ADR)
*   *Pending: Registrar ADR sobre la integración con WhatsApp.*
