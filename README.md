# Ainyx — App Graph Builder

A responsive "App Graph Builder" UI that visualises service topology graphs with interactive ReactFlow nodes, a service node inspector, TanStack Query data fetching, and Zustand state management.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (MSW mock worker boots automatically)
npm run dev

# 3. Open http://localhost:5173
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint on all `.ts` / `.tsx` files (0 warnings allowed) |
| `npm run typecheck` | Run `tsc --noEmit` for strict type checking |
| `npm run lint:fix` | Auto-fix ESLint issues |

---

## Feature Checklist

### Layout
- [x] **Top bar** — brand logo, app selector pill (opens floating app list), theme/share/avatar actions
- [x] **Left rail** — icon-only nav with 7 coloured icons (floats absolutely over canvas)
- [x] **Right panel** — slides in when a node is selected; overlays canvas on both desktop and mobile
- [x] **Dotted canvas** — ReactFlow `BackgroundVariant.Dots` with dark theme

### ReactFlow
- [x] Render 3 + nodes per graph with animated/static edges
- [x] **Drag** nodes freely
- [x] **Click** to select a node (highlighted with accent border)
- [x] **Delete / Backspace** to delete the selected node (guarded against firing inside inputs)
- [x] **Escape** to deselect
- [x] **F** keyboard shortcut — fit view
- [x] **Zoom + pan** (default ReactFlow behaviour)
- [x] **Fit view on load** — auto-fits after graph data loads, with 600 ms animation
- [x] **Fit view button** in canvas toolbar
- [x] **Add Node button** in canvas toolbar + inside app panel (bonus)
- [x] MiniMap + Controls widgets

### Node Inspector (right panel)
- [x] **Status pill** — Healthy / Degraded / Down / Error / Success with colour coding
- [x] **Config tab** — editable service name, description textarea, status override buttons, type toggle
- [x] **Runtime tab** — active-metric selector, synced slider + numeric input (0–100), cost badge, runtime stat bars
- [x] Slider ↔ numeric input stay in sync both ways; value persists into ReactFlow node data

### TanStack Query
- [x] `GET /api/apps` — returns 5 apps with simulated 400 ms latency (MSW)
- [x] `GET /api/apps/:appId/graph` — returns nodes + edges per app with 600 ms latency
- [x] **Loading state** — animated skeleton cards for app list; spinner for graph
- [x] **Error state** — toggle "Simulate Error" in the app panel to force a fetch failure; retry button available
- [x] **Caching** — `staleTime` 5 min for apps, 2 min for graphs; switching apps re-fetches graph
- [x] `queryKey` includes `simulateError` flag so toggling error invalidates cache correctly

### Zustand State
- [x] `selectedAppId` — which app graph is displayed
- [x] `selectedNodeId` — which node is inspected (drives right panel visibility)
- [x] `isMobilePanelOpen` — mobile drawer open/close
- [x] `activeInspectorTab` — `'config' | 'runtime'`
- [x] `simulateError` — developer toggle to simulate API errors
- [x] `isAppPanelOpen` — floating app selector panel open/close
- No derived data stored; all derived views use selectors

### TypeScript + Tooling
- [x] `tsconfig.json` — `"strict": true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- [x] ESLint 9 flat config — `typescript-eslint`, `react-hooks`, `react-refresh`; 0 warnings allowed
- [x] Path alias `@/*` → `./src/*` for clean imports

### Bonus Features
- [x] **Add Node** — creates a new "New Service" node at a random canvas position
- [x] **Node types** — `service` vs `database` have different border styles and top accent gradients (purple for services, blue for databases)
- [x] **Inspector edits persist** — name, description, status, type, slider value all write back into ReactFlow node data via `updateNodeData`
- [x] **Keyboard shortcuts** — `F` = fit view, `Delete`/`Backspace` = delete node, `Escape` = deselect

### Responsive
- Desktop: right panel slides in as a fixed overlay on the right edge
- Mobile (≤ 768 px): right panel narrows to `min(300px, 92vw)` with a dimmed backdrop; app selector becomes a bottom sheet

---

## Key Decisions

### Mock API — MSW over `setTimeout` wrappers
MSW intercepts real `fetch` calls at the service-worker level, which means query functions stay identical to what they'd look like against a real API. `staleTime` + `queryKey` with `simulateError` gives a realistic cache-and-invalidate demonstration.

### State split — Zustand vs ReactFlow internal state
ReactFlow's `useNodesState` / `useEdgesState` own the *graph structure* (positions, connections). Zustand owns *UI intent* (which node is selected, which tab is active). Node data is updated via ReactFlow's `updateNodeData` utility, propagated upward to the parent via a `onNodesUpdate` callback and a registered `updateNodeData` ref to break the unidirectional data flow cleanly without context.

### Right panel as a fixed overlay
The inspector panel uses `position: fixed` rather than pushing the canvas layout, so the graph never reflows when a node is selected. This also makes the mobile-drawer behaviour a zero-cost variant.

### No prop drilling — Zustand as the communication bus
`selectedNodeId`, `selectedAppId`, and `activeInspectorTab` are read directly from the store by whichever component needs them, keeping the component tree shallow.

### CSS-only — no Tailwind
Vanilla CSS with CSS custom properties gives full control, zero bundle overhead, and makes the stylesheet independently auditable.

---

## Known Limitations

- **No edge creation UI** — nodes can be connected by dragging from a handle to another handle (ReactFlow built-in), but there is no explicit "connect" button. Newly added nodes have no edges by default.
- **Graph edits are not persisted** — changes made in the inspector (name, slider, status) are stored in local React state only and reset when the app is reloaded or the app selection changes (re-fetches from mock).
- **No authentication** — the MSW handlers return static data for all requests without any auth layer.
- **No real backend** — all data is served from `src/mocks/handlers.ts` via MSW; the app will not work in production without a real API or MSW configured for production mode.
- **Single graph per app** — each app has a fixed graph defined in `handlers.ts`. Adding nodes is ephemeral.
- **TypeScript `ignoreDeprecations: "6.0"`** — required because the project uses TypeScript 6 which deprecates some lib options used transitively by the type definitions.

---

## Project Structure

```
src/
├── api/
│   ├── queries.ts          # TanStack Query hooks (useApps, useAppGraph)
│   └── types.ts            # Shared TypeScript interfaces
├── components/
│   ├── apps/
│   │   └── AppList.tsx     # Floating app selector panel
│   ├── canvas/
│   │   ├── AppCanvas.tsx   # ReactFlow wrapper with all interaction logic
│   │   └── ServiceNode.tsx # Custom ReactFlow node card
│   ├── inspector/
│   │   └── NodeInspector.tsx # Right-panel service inspector (tabs + controls)
│   └── layout/
│       ├── LeftRail.tsx    # Icon nav rail
│       ├── RightPanel.tsx  # Inspector panel shell (overlay + close btn)
│       └── TopBar.tsx      # Top bar with brand + app selector + actions
├── mocks/
│   ├── browser.ts          # MSW browser worker setup
│   └── handlers.ts         # Mock API handlers with static data + latency
├── store/
│   └── useAppStore.ts      # Zustand store
├── App.tsx                 # Root layout + QueryClient + ReactFlowProvider
├── index.css               # Global styles (2 000+ lines, no CSS framework)
└── main.tsx                # Entry — boots MSW worker then mounts React
```

---

## Tech Stack

| Library | Version | Role |
|---------|---------|------|
| React | 19 | UI framework |
| Vite | 6 | Build tool + dev server |
| TypeScript | 6 | Strict typing |
| @xyflow/react | 12 | ReactFlow graph canvas |
| @tanstack/react-query | 5 | Server state + caching |
| zustand | 5 | Client UI state |
| msw | 2 | Mock Service Worker (API mocking) |
| @radix-ui/* | latest | Accessible primitives (Slider, Tabs, Dialog…) |
| lucide-react | latest | Icons |
