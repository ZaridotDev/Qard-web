# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint on the project.
- `npm run preview`: Preview the production build locally.

## Architecture

- **Framework**: React 19 + Vite.
- **State Management**: Uses `zustand` for store-based state (e.g., `authStore.js`, `financeStore.js`).
- **Routing**: `react-router-dom` (v7) handles client-side routing.
  - Public routes use `AuthLayout`.
  - Protected routes are wrapped in `PrivateRoute` and use `AppLayout`.
- **API/Data Layer**: Communicates with Supabase using a central client (`src/lib/supabaseClient.js`). API modules are organized in `src/api/` (e.g., `transactions.js`, `auth.js`).
- **Layouts**: `src/layouts/` contains high-level page layouts (AppLayout, AuthLayout).
- **Pages**: Feature-specific pages are located in `src/pages/` (organized by feature domain, e.g., `transactions/`, `auth/`).
- **Styles**: Global and component-specific styles reside in `src/styles/`.
