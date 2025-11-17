# Project Overview

Cosmic UI is a Vite + React TypeScript project that showcases a futuristic component library. The site renders a marketing homepage and an embedded documentation browser with interactive component examples.

## Architecture
- **Entry point:** `src/main.tsx` mounts the app inside `StrictMode`, injects an FPS overlay for performance debugging, and wraps routes with `BrowserRouter`.
- **Routing:** `src/router/index.tsx` defines nested React Router routes. The top-level `App` layout hosts the navigation frame, while `/docs` children render documentation pages for each component (buttons, inputs, tabs, etc.).
- **Layout shell:** `src/App.tsx` applies the neon frame aesthetic, exposes a `MobileMenuContext` for the responsive menu toggle, and renders the header, footer, and `<Outlet />` for routed content.

## Components
- **UI kit:** Reusable primitives live under `src/components/ui/` (for example, the `Frame` and `Button` components used in the global header). They encapsulate styling tokens like `--color-frame-*` and Tailwind utilities.
- **Documentation widgets:** Helpers in `src/components/` (e.g., `docs.tsx`) compose the doc pages with consistent typography, code blocks, and layout wrappers.

## Pages
- **Home:** `src/pages/home.tsx` acts as the landing page, introducing Cosmic UI and linking to documentation.
- **Docs:** Each page under `src/pages/` maps to a route, providing live component demos, usage guidance, and prop tables (accordion, dialog, tabs, inputs, chart, colors, etc.).

## Development
- Install dependencies with `yarn`.
- Run `yarn dev` for local development, `yarn build` for production bundles, and `yarn preview` to serve the built site.
